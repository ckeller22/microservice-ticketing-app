import request from "supertest";
import { app } from "../../app";
import { TestCommon } from "../../test/auth-test-common";

it("responds with details about the current user", async () => {
  const signUpResponse = await TestCommon.signUp();
  const cookie = signUpResponse.get("Set-Cookie");

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual(TestCommon.VALID_USER.email);
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
