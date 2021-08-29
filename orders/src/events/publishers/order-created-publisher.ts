import { Publisher, OrderCreatedEvent, Subjects } from "@csktickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
