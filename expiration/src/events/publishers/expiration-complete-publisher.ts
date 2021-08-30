import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@csktickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
