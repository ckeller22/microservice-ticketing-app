import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { TestCommon } from "../../test/orders-test-common";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("marks an order as cancelled", async () => {
  const cookie = TestCommon.getCookie();

  // Create a ticket
  const ticket = await TestCommon.newTicket();

  // Make request to create order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo("emits a order cancelled event");
