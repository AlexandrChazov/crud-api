import request from "supertest";
import { server } from "../main";

describe("API", () => {
	let userId = "";
	beforeAll(async () => {
		await request(server).delete("/test/data");
	});
	afterAll((done) => {
		server.close();
		done();
	});
	it("Get users list", async () => {
		await request(server)
			.get("/api/users")
			.then(() => {
				expect(200);
				expect([]);
			});
	});
	it("Create user", async () => {
		await request(server)
			.post("/api/users")
			.send({ username: "Alexey", age: 25, hobbies: ["food"] })
			.then((response) => {
				userId = response.body.id;
				expect(201);
				expect(response.body.username).toBe("Alexey");
				expect(response.body.age).toBe(25);
				expect(response.body.hobbies).toEqual(["food"]);
			});
	});
	it("Get user", async () => {
		await request(server)
			.get(`/api/users/${userId}`)
			.then((response) => {
				expect(200);
				expect(response.body.username).toBe("Alexey");
				expect(response.body.age).toBe(25);
				expect(response.body.hobbies).toEqual(["food"]);
			});
	});
	it("Update user", async () => {
		await request(server)
			.put(`/api/users/${userId}`)
			.send({ username: "John", age: 46, hobbies: ["alcohol"] })
			.then((response) => {
				expect(200);
				expect(response.body.username).toBe("John");
				expect(response.body.age).toBe(46);
				expect(response.body.hobbies).toEqual(["alcohol"]);
			});
	});
	it("Delete user", async () => {
		await request(server).delete(`/api/users/${userId}`).expect(204);
	});
	it("Get user", async () => {
		await request(server)
			.get(`/api/users/${userId}`)
			.then((response) => {
				expect(404);
				expect(response.text).toBe("User doesn't exist");
			});
	});
});
