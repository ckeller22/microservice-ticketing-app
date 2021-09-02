import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { TestCommon } from "../../test/tickets-test-common";

it("returns a 404 if the ticket is not found", async () => {
  await request(app)
    .get(`/api/tickets/${TestCommon.newValidId()}`)
    .send()
    .expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const ticket = await TestCommon.newTicket();

  const ticketResponse = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(TestCommon.VALID_TITLE);
  expect(ticketResponse.body.price).toEqual(TestCommon.VALID_PRICE);
});
