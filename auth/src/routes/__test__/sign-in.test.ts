import request from "supertest";
import { app } from "../../app";
import { TestCommon } from "../../test/test-common";

it("returns a 400 with an invalid email", async () => {
	return request(app)
		.post("/api/users/signin")
		.send({
			email: TestCommon.VALID_EMAIL,
			password: TestCommon.VALID_PASSWORD,
		})
		.expect(400);
});

it("returns a 400 with a missing email", async () => {
	return request(app)
		.post("/api/users/signin")
		.send({ password: TestCommon.VALID_PASSWORD })
		.expect(400);
});

it("returns a 400 with a missing password", async () => {
	return request(app)
		.post("/api/users/signin")
		.send({ email: TestCommon.VALID_EMAIL })
		.expect(400);
});

it("fails when an email that does not exist is supplied", async () => {
	await request(app)
		.post("/api/users/signin")
		.send({
			email: TestCommon.VALID_EMAIL,
			password: TestCommon.VALID_PASSWORD,
		})
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
		await TestCommon.signUp();
	});

	it("fails when an incorrect password is supplied", async () => {
		return request(app)
			.post("/api/users/signin")
			.send({ email: TestCommon.VALID_EMAIL, password: "asdfgh" })
			.expect(400);
	});

	it("responds with a cookie when given valid credentials", async () => {
		const response = await request(app)
			.post("/api/users/signin")
			.send({
				email: TestCommon.VALID_EMAIL,
				password: TestCommon.VALID_PASSWORD,
			})
			.expect(200);

		expect(response.get("Set-Cookie")).toBeDefined();
	});
});
