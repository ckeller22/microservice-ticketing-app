import request from "supertest";
import { app } from "../../app";
import { TestCommon } from "../../test/test-common";

it("returns a 201 on succesful signup", async () => {
	return request(app)
		.post("/api/users/signup")
		.send(TestCommon.VALID_USER)
		.expect(201);
});

it("returns a 400 with an invalid email", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: TestCommon.INVALID_EMAIL,
			password: TestCommon.VALID_PASSWORD,
		})
		.expect(400);
});

it("returns a 400 with an invalid password", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: TestCommon.VALID_EMAIL,
			password: TestCommon.INVALID_PASSWORD,
		})
		.expect(400);
});

it("returns a 400 with a missing email", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({ password: TestCommon.VALID_PASSWORD })
		.expect(400);
});

it("returns a 400 with a missing password", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({ email: TestCommon.VALID_EMAIL })
		.expect(400);
});

it("doesn't allow a user to sign up with an email that is already in use", async () => {
	await request(app)
		.post("/api/users/signup")
		.send(TestCommon.VALID_USER)
		.expect(201);

	return request(app)
		.post("/api/users/signup")
		.send(TestCommon.VALID_USER)
		.expect(400);
});

it("sets a cookie after successful signup", async () => {
	const response = await request(app)
		.post("/api/users/signup")
		.send(TestCommon.VALID_USER)
		.expect(201);

	expect(response.get("Set-Cookie")).toBeDefined();
});
