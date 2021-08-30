import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@csktickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    console.log(data);
    const ticket = await Ticket.findByIdAndPreviousVersion(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}