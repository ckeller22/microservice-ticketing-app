import request from "supertest";
import { app } from "../../app";
import { TestCommon } from "../../test/test-common";

it("clears the cookie after signing out", async () => {
	await TestCommon.signUp();

	const response = await request(app)
		.post("/api/users/signout")
		.send({})
		.expect(200);

	expect(response.get("Set-Cookie")).toBeDefined();
});
