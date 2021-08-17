import request from "supertest";
import { app } from "../../app";

const validEmail = "test@example.com";
const validPassword = "password";
const invalidEmail = "jkfslkjsdflkjsdflkj";
const invalidPassword = "12";
const validPayload = {
	email: validEmail,
	password: validPassword,
};

it("returns a 201 on succesful signup", async () => {
	return request(app).post("/api/users/signup").send(validPayload).expect(201);
});

it("returns a 400 with an invalid email", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: invalidEmail,
			password: validPassword,
		})
		.expect(400);
});

it("returns a 400 with an invalid password", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: validEmail,
			password: invalidPassword,
		})
		.expect(400);
});

it("returns a 400 with a missing email", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({ password: validPassword })
		.expect(400);
});

it("returns a 400 with a missing password", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({ email: validEmail })
		.expect(400);
});

it("doesn't allow a user to sign up with an email that is already in use", async () => {
	await request(app).post("/api/users/signup").send(validPayload).expect(201);

	return request(app).post("/api/users/signup").send(validPayload).expect(400);
});

it("sets a cookie after successful signup", async () => {
	const response = await request(app)
		.post("/api/users/signup")
		.send(validPayload)
		.expect(201);

	expect(response.get("Set-Cookie")).toBeDefined();
});
