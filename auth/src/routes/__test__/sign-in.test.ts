import request from "supertest";
import { isIterationStatement } from "typescript";
import { app } from "../../app";

const validEmail = "test@example.com";
const validPassword = "password";
const invalidEmail = "jkfslkjsdflkjsdflkj";

const signUp = async () => {
	return request(app)
		.post("/api/users/signup")
		.send({ email: validEmail, password: validPassword })
		.expect(201);
};

it("returns a 400 with an invalid email", async () => {
	return request(app)
		.post("/api/users/signin")
		.send({
			email: invalidEmail,
			password: validPassword,
		})
		.expect(400);
});

it("returns a 400 with a missing email", async () => {
	return request(app)
		.post("/api/users/signin")
		.send({ password: validPassword })
		.expect(400);
});

it("returns a 400 with a missing password", async () => {
	return request(app)
		.post("/api/users/signin")
		.send({ email: validEmail })
		.expect(400);
});

it("fails when an email that does not exist is supplied", async () => {
	await request(app)
		.post("/api/users/signin")
		.send({ email: validEmail, password: validPassword })
		.expect(400);
});

// it("fails when an incorrect password is supplied", async () => {
// 	await signUp();

// 	return request(app)
// 		.post("/api/users/signin")
// 		.send({ email: validEmail, password: "asdfgh" })
// 		.expect(400);
// });

// it("responds with a cookie when given valid credentials", async () => {});

describe("after signing up", () => {
	beforeEach(async () => {
		await signUp();
	});

	it("fails when an incorrect password is supplied", async () => {
		return request(app)
			.post("/api/users/signin")
			.send({ email: validEmail, password: "asdfgh" })
			.expect(400);
	});

	it("responds with a cookie when given valid credentials", async () => {
		const response = await request(app)
			.post("/api/users/signin")
			.send({ email: validEmail, password: validPassword })
			.expect(200);

		expect(response.get("Set-Cookie")).toBeDefined();
	});
});
