import request from "supertest";
import { app } from "../app";

export class TestCommon {
	static VALID_EMAIL = "test@example.com";
	static VALID_PASSWORD = "password";
	static INVALID_EMAIL = "thisisaninvalidemail";
	static INVALID_PASSWORD = "12";
	static VALID_USER = {
		email: TestCommon.VALID_EMAIL,
		password: TestCommon.VALID_PASSWORD,
	};

	static signUp = async () => {
		return request(app)
			.post("/api/users/signup")
			.send(TestCommon.VALID_USER)
			.expect(201);
	};
}
