import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import { Ticket } from "../models/ticket";
import { Order, OrderStatus } from "../models/order";
import jwt from "jsonwebtoken";

export class TestCommon {
  static VALID_EMAIL = "test@example.com";
  static VALID_TITLE = "Concert Ticket";
  static VALID_PRICE = 10;

  static newValidId = () => {
    return new mongoose.Types.ObjectId().toHexString();
  };

  static getCookie = (id = TestCommon.newValidId()) => {
    // Build JWT payload
    const payload = {
      id: id,
      email: TestCommon.VALID_EMAIL,
    };
    // Create JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    // Build Session object
    const session = { jwt: token };
    // Turn session into JSON
    const sessionJSON = JSON.stringify(session);
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");
    //return a cookie string with data
    return [`express:sess=${base64}`];
  };

  static newTicket = async () => {
    const ticket = Ticket.build({
      title: TestCommon.VALID_TITLE,
      price: TestCommon.VALID_PRICE,
      id: TestCommon.newValidId(),
    });
    await ticket.save();

    return ticket;
  };

  // static newOrder = async (userId = "123456") => {
  //   const order = Order.build({
  //     ticket,
  //     userId: userId,
  //     status: OrderStatus.Created,
  //     expiresAt: new Date(),
  //   });
  // };
}
