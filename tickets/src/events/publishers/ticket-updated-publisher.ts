import { Publisher, Subjects, TicketUpdatedEvent } from "@csktickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
