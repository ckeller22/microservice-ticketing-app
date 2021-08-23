import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

export class TestCommon {
  static VALID_EMAIL = "test@example.com";
  static VALID_TITLE = "Concert Ticket";
  static VALID_PRICE = 10;

  static getCookie = () => {
    // Build JWT payload
    const payload = {
      id: "ch23k2454lsa",
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
}
