import { readFile, writeFile } from "node:fs";
import { IncomingMessage, ServerResponse } from "node:http";
import { v4, validate } from "uuid";
import { pathToDb, serverError, userId } from "./lib";
import { EStatus } from "./enums";

export function server(
	req: IncomingMessage,
	res: ServerResponse<IncomingMessage> & { req: IncomingMessage },
) {
	console.log("server's PORT is", process.env.PORT);
	if (req.method === "GET" && req.url === "/api/users") {
		readFile(pathToDb(import.meta.url), "utf-8", (err, data) => {
			if (err) {
				serverError(res);
			} else {
				const users = JSON.parse(data);
				res.writeHead(EStatus.OK, { "Content-type": "application/json" });
				res.end(JSON.stringify(Object.values(users)));
			}
		});
	} else if (req.method === "GET" && req.url?.includes("/api/users/")) {
		const id = userId(req.url);
		if (!validate(id)) {
			res.writeHead(EStatus.BAD_REQUEST);
			res.end("Invalid user id");
		} else {
			readFile(pathToDb(import.meta.url), "utf-8", (err, data) => {
				if (err) {
					serverError(res);
				} else {
					const users = JSON.parse(data);
					if (!users[id]) {
						res.writeHead(EStatus.NOT_FOUND);
						res.end("User doesn't exist");
					} else {
						res.writeHead(EStatus.OK, { "Content-type": "application/json" });
						res.end(JSON.stringify(users[id]));
					}
				}
			});
		}
	} else if (req.method === "POST" && req.url === "/api/users") {
		let file = "";
		req.on("data", (chunk) => {
			file = file.concat(chunk.toString());
		});
		req.on("end", () => {
			const body = JSON.parse(file);
			if (!body.username || !body.age || !body.hobbies) {
				res.writeHead(EStatus.BAD_REQUEST);
				res.end("Fields username, age, hobbies are required");
			} else {
				const newUser = {
					id: v4(),
					...body,
				};
				readFile(pathToDb(import.meta.url), "utf-8", (err, data) => {
					if (err) {
						serverError(res);
					} else {
						const users = JSON.parse(data);
						users[newUser.id] = newUser;
						writeFile(
							pathToDb(import.meta.url),
							JSON.stringify(users, null, 2),
							() => {
								res.writeHead(EStatus.CREATED, {
									"Content-type": "application/json",
								});
								res.end(JSON.stringify(newUser));
							},
						);
					}
				});
			}
		});
	} else if (req.method === "PUT" && req.url?.includes("/api/users/")) {
		let file = "";
		req.on("data", (chunk) => {
			file = file.concat(chunk.toString());
		});
		req.on("end", () => {
			const body = JSON.parse(file);
			const id = userId(req.url);
			if (!validate(id)) {
				res.writeHead(EStatus.BAD_REQUEST);
				res.end("Invalid user id");
			} else {
				readFile(pathToDb(import.meta.url), "utf-8", (err, data) => {
					if (err) {
						serverError(res);
					} else {
						const users = JSON.parse(data);
						const user = users[id];
						if (!user) {
							res.writeHead(EStatus.NOT_FOUND);
							res.end("User doesn't exist");
						} else {
							if (body.username) user.username = body.username;
							if (body.age) user.age = body.age;
							if (body.hobbies) user.hobbies = body.hobbies;
							writeFile(
								pathToDb(import.meta.url),
								JSON.stringify(users, null, 2),
								() => {
									res.writeHead(EStatus.OK, {
										"Content-type": "application/json",
									});
									res.end(JSON.stringify(users[id]));
								},
							);
						}
					}
				});
			}
		});
	} else if (req.method === "DELETE" && req.url?.includes("/api/users/")) {
		const id = userId(req.url);
		if (!validate(id)) {
			res.writeHead(EStatus.BAD_REQUEST);
			res.end("Invalid user id");
		} else {
			readFile(pathToDb(import.meta.url), "utf-8", (err, data) => {
				if (err) {
					serverError(res);
				} else {
					const users = JSON.parse(data);
					if (!users[id]) {
						res.writeHead(EStatus.NOT_FOUND);
						res.end("User doesn't exist");
					} else {
						delete users[id];
						writeFile(
							pathToDb(import.meta.url),
							JSON.stringify(users, null, 2),
							() => {
								res.writeHead(EStatus.NO_CONTENT);
								res.end();
							},
						);
					}
				}
			});
		}
	} else if (req.method === "DELETE" && req.url?.includes("test/data")) {
		writeFile(pathToDb(import.meta.url), JSON.stringify({}, null, 2), () => {
			res.writeHead(EStatus.NO_CONTENT);
			res.end();
		});
	} else {
		res.writeHead(EStatus.NOT_FOUND, { "Content-type": "text/plain" });
		res.end("The endpoint doesn't exist");
	}
	process.on("uncaughtException", () => {
		serverError(res);
	});
}
