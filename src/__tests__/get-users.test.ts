import request from "supertest";
import { app } from "../main";
import { EStatus } from "../enums";
import { jest } from "@jest/globals";

jest.spyOn(console, "log").mockImplementation(() => {});

describe("API", () => {
	let userId = "";
	beforeAll(async () => {
		await request(app).delete("/test/data");
	});
	afterAll((done) => {
		app.close();
		done();
	});
	test("Get users list", async () => {
		await request(app)
			.get("/api/users")
			.then(() => {
				expect(EStatus.OK);
				expect([]);
			});
	});
	test("Create user", async () => {
		await request(app)
			.post("/api/users")
			.send({ username: "Alexey", age: 25, hobbies: ["food"] })
			.then((response) => {
				userId = response.body.id;
				expect(EStatus.CREATED);
				expect(response.body.username).toBe("Alexey");
				expect(response.body.age).toBe(25);
				expect(response.body.hobbies).toEqual(["food"]);
			});
	});
	test("Get user", async () => {
		await request(app)
			.get(`/api/users/${userId}`)
			.then((response) => {
				expect(EStatus.OK);
				expect(response.body.username).toBe("Alexey");
				expect(response.body.age).toBe(25);
				expect(response.body.hobbies).toEqual(["food"]);
			});
	});
	test("Update user", async () => {
		await request(app)
			.put(`/api/users/${userId}`)
			.send({ username: "John", age: 46, hobbies: ["alcohol"] })
			.then((response) => {
				expect(EStatus.OK);
				expect(response.body.username).toBe("John");
				expect(response.body.age).toBe(46);
				expect(response.body.hobbies).toEqual(["alcohol"]);
			});
	});
	test("Delete user", async () => {
		await request(app)
			.delete(`/api/users/${userId}`)
			.expect(EStatus.NO_CONTENT);
	});
	test("Get user", async () => {
		await request(app)
			.get(`/api/users/${userId}`)
			.then((response) => {
				expect(EStatus.NOT_FOUND);
				expect(response.text).toBe("User doesn't exist");
			});
	});
});
