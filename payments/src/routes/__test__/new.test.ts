import request from "supertest";
import { app } from "../../app";
import { TestCommon } from "../../test/payments-test-common";
import { Order } from "../../models/order";
import { OrderStatus } from "@csktickets/common";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that doesn't exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", TestCommon.getCookie())
    .send({ token: TestCommon.newValidId(), orderId: TestCommon.newValidId() })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesn't belong to the user", async () => {
  const order = Order.build({
    id: TestCommon.newValidId(),
    userId: TestCommon.newValidId(),
    version: 0,
    price: TestCommon.VALID_PRICE,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", TestCommon.getCookie())
    .send({ token: TestCommon.newValidId(), orderId: order.id })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = TestCommon.newValidId();
  const cookie = TestCommon.getCookie(userId);

  const order = Order.build({
    id: TestCommon.newValidId(),
    userId: userId,
    version: 0,
    price: TestCommon.VALID_PRICE,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({ token: TestCommon.newValidId(), orderId: order.id })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = TestCommon.newValidId();
  const cookie = TestCommon.getCookie(userId);

  const order = Order.build({
    id: TestCommon.newValidId(),
    userId: userId,
    version: 0,
    price: TestCommon.VALID_PRICE,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({ token: "tok_visa", orderId: order.id })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(TestCommon.VALID_PRICE * 100);
  expect(chargeOptions.currency).toEqual("usd");
});
