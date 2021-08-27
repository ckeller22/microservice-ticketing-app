import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { TestCommon } from "../../test/orders-test-common";
import { Order, OrderStatus } from "../../models/order";
import { Ticket, TicketDoc } from "../../models/ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/orders").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", TestCommon.getCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", TestCommon.getCookie())
    .send({ ticketId: ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = await TestCommon.newTicket();

  const order = Order.build({
    ticket: ticket,
    userId: "asdasd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", TestCommon.getCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("successfully reserves a ticket", async () => {
  const ticket = await TestCommon.newTicket();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", TestCommon.getCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  const order = await Order.findById(response.body.id);
  expect(order!.status).toEqual(OrderStatus.Created);
  expect(String(order!.ticket)).toEqual(String(ticket.id));
});

it.todo("emits and order created event");
