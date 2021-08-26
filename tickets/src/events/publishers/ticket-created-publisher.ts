import { Publisher, Subjects, TicketCreatedEvent } from "@csktickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
