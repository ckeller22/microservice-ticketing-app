import request from "supertest";
import { couldStartTrivia } from "typescript";
import { app } from "../../app";
import { TestCommon } from "../../test/tickets-test-common";

it("can fetch a list of tickets", async () => {
  const ticketCount = 5;
  for (let i = 0; i < ticketCount; i++) {
    await TestCommon.newTicket();
  }

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(ticketCount);
});
