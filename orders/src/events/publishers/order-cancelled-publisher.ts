import { Publisher, OrderCancelledEvent, Subjects } from "@csktickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
