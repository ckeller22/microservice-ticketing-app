import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { TestCommon } from "../../test/orders-test-common";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
  // Create user
  const userId = TestCommon.newValidId();
  const cookie = TestCommon.getCookie(userId);

  // Create a ticket
  const ticket = await TestCommon.newTicket();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if the user tries to fetch another users order", async () => {
  // Create user
  const userId = TestCommon.newValidId();
  const cookie = TestCommon.getCookie(userId);

  // Create a ticket
  const ticket = await TestCommon.newTicket();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order with different user
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", TestCommon.getCookie())
    .expect(401);
});
