import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from "@csktickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { NotFoundError } from "@csktickets/common";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post("/api/orders", requireAuth, [
  body("ticketId").not().isEmpty().withMessage("TicketId must be provided"),
]),
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket user is trying to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket isn't already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }
    // Calculate an expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });
    await order.save();
    // Publish an event saying an order was created

    res.status(201).send(order);
  };

export { router as newOrderRouter };
