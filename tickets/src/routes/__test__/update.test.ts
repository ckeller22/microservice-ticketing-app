import request from "supertest";
import { app } from "../../app";
import { TestCommon } from "../../test/tickets-test-common";
import { Ticket, TicketDoc } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  await request(app)
    .put(`/api/tickets/${TestCommon.newValidId()}`)
    .set("Cookie", TestCommon.getCookie())
    .send({
      title: TestCommon.VALID_TITLE,
      price: TestCommon.VALID_PRICE,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  await request(app)
    .put(`/api/tickets/${TestCommon.newValidId()}`)
    .send({
      title: TestCommon.VALID_TITLE,
      price: TestCommon.VALID_PRICE,
    })
    .expect(401);
});

describe("if a ticket exists", () => {
  let userId: string;
  //let ticketId: string;
  let cookie: string[];
  let ticket: TicketDoc;

  beforeEach(async () => {
    // Get userid
    userId = TestCommon.newValidId();
    // create ticket with userId
    ticket = await TestCommon.newTicket(userId);
    // Authenticate user
    cookie = TestCommon.getCookie(userId);
  });

  describe("and the user does not own the ticket", () => {
    it("returns a 401 if the user does not own the ticket", async () => {
      // Make request using default userId
      await request(app)
        .put(`/api/tickets/${ticket.id}`)
        .set("Cookie", TestCommon.getCookie())
        .send({
          title: "should not change",
          price: 99,
        })
        .expect(401);

      // Check to make sure that item was not modified
      const ticketCheck = await Ticket.findById(ticket.id);
      expect(ticketCheck!.price).toEqual(TestCommon.VALID_PRICE);
      expect(ticketCheck!.title).toEqual(TestCommon.VALID_TITLE);
    });
  });

  describe("and the user owns the ticket", () => {
    it("returns a 400 if the user provides an invalid title", async () => {
      await request(app)
        .put(`/api/tickets/${ticket.id}`)
        .set("Cookie", cookie)
        .send({
          title: "",
          price: 10,
        })
        .expect(400);
    });

    it("returns a 400 if the user provides an invalid price", async () => {
      await request(app)
        .put(`/api/tickets/${ticket.id}`)
        .set("Cookie", cookie)
        .send({
          title: TestCommon.VALID_TITLE,
          price: -10,
        })
        .expect(400);
    });

    it("updates the ticket provided valid inputs", async () => {
      const newTitle = "This should change";
      const newPrice = 10000;
      await request(app)
        .put(`/api/tickets/${ticket.id}`)
        .set("Cookie", cookie)
        .send({
          title: newTitle,
          price: newPrice,
        })
        .expect(200);

      const ticketCheck = await Ticket.findById(ticket.id);
      expect(ticketCheck!.price).toEqual(newPrice);
      expect(ticketCheck!.title).toEqual(newTitle);
    });

    it("publishes an event", async () => {
      const newTitle = "This should change";
      const newPrice = 10000;
      await request(app)
        .put(`/api/tickets/${ticket.id}`)
        .set("Cookie", cookie)
        .send({
          title: newTitle,
          price: newPrice,
        })
        .expect(200);

      expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
  });
});
