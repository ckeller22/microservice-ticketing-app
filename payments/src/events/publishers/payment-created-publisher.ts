import { Subjects, Publisher, PaymentCreatedEvent } from "@csktickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
