import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { TestCommon } from "../../test/orders-test-common";
import { Order, OrderStatus } from "../../models/order";
import { Ticket, TicketDoc } from "../../models/ticket";

it("only fetches orders for a particular user", async () => {
  // Create three tickets
  const firstTicket = await TestCommon.newTicket();
  const secondTicket = await TestCommon.newTicket();
  const thirdTicket = await TestCommon.newTicket();

  // Build users
  const firstUser = TestCommon.getCookie(TestCommon.newValidId());
  const secondUser = TestCommon.getCookie(TestCommon.newValidId());

  // Create one order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", firstUser)
    .send({ ticketId: firstTicket.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", secondUser)
    .send({ ticketId: secondTicket.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", secondUser)
    .send({ ticketId: thirdTicket.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", secondUser)
    .expect(200);

  // Make sure we only got the orders for user #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
