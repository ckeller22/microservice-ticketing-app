import { Ticket } from "../ticket";
import { TestCommon } from "../../test/tickets-test-common";

it("implements optimistic concurrency control", async () => {
  // Create a ticket and save the ticket to the database
  const ticket = await TestCommon.newTicket();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two seperate changes to tickets we found
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // Save the first fetched ticket
  await firstInstance!.save();

  // Save the second fetched ticket
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
});

it("increments the version number on multiple saves", async () => {
  const ticket = await TestCommon.newTicket();

  let expectedVersionNumber = 1;

  for (let i = 0; i < 10; i++) {
    await ticket.save();
    expect(ticket.__v).toEqual(expectedVersionNumber);
    expectedVersionNumber++;
  }
});
