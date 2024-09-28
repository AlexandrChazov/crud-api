import { createServer } from "http";
import { readFile, writeFile } from "fs";
import { v4, validate } from "uuid";
import { userId } from "./lib/userId.js";
import { serverError } from "./lib/serverError.js";

const server = createServer((req, res) => {
	if (req.method === "GET" && req.url === "/api/users") {
		readFile(`${import.meta.dirname}/db/users.json`, "utf-8", (err, data) => {
			if (err) {
				serverError(res);
			} else {
				const users = JSON.parse(data);
				res.writeHead(200, { "Content-type": "application/json" });
				res.end(JSON.stringify(Object.values(users)));
			}
		});
	} else if (req.method === "GET" && req.url?.includes("/api/users/")) {
		const id = userId(req.url);
		if (!validate(id)) {
			res.writeHead(400);
			res.end("Invalid user id");
		} else {
			readFile(pathToDb(), "utf-8", (err, data) => {
				if (err) {
					serverError(res);
				} else {
					const users = JSON.parse(data);
					if (!users[id]) {
						res.writeHead(404);
						res.end("User doesn't exist");
					} else {
						res.writeHead(200, { "Content-type": "application/json" });
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
				res.writeHead(400);
				res.end("Fields username, age, hobbies are required");
			} else {
				const newUser = {
					id: v4(),
					...body,
				};
				readFile(pathToDb(), "utf-8", (err, data) => {
					if (err) {
						serverError(res);
					} else {
						const users = JSON.parse(data);
						users[newUser.id] = newUser;
						writeFile(
							`${import.meta.dirname}/db/users.json`,
							JSON.stringify(users, null, 2),
							() => {
								res.writeHead(201, { "Content-type": "application/json" });
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
				res.writeHead(400);
				res.end("Invalid user id");
			} else {
				readFile(pathToDb(), "utf-8", (err, data) => {
					if (err) {
						serverError(res);
					} else {
						const users = JSON.parse(data);
						const user = users[id];
						if (!user) {
							res.writeHead(404);
							res.end("User doesn't exist");
						} else {
							if (body.username) user.username = body.username;
							if (body.age) user.age = body.age;
							if (body.hobbies) user.hobbies = body.hobbies;
							writeFile(
								`${import.meta.dirname}/db/users.json`,
								JSON.stringify(users, null, 2),
								() => {
									res.writeHead(200, { "Content-type": "application/json" });
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
			res.writeHead(400);
			res.end("Invalid user id");
		} else {
			readFile(pathToDb(), "utf-8", (err, data) => {
				if (err) {
					serverError(res);
				} else {
					const users = JSON.parse(data);
					if (!users[id]) {
						res.writeHead(404);
						res.end("User doesn't exist");
					} else {
						delete users[id];
						writeFile(
							`${import.meta.dirname}/db/users.json`,
							JSON.stringify(users, null, 2),
							() => {
								res.writeHead(204, { "Content-type": "application/json" });
								res.end();
							},
						);
					}
				}
			});
		}
	} else {
		res.writeHead(404, { "Content-type": "text/plain" });
		res.end("The endpoint doesn't exist");
	}
	process.on("uncaughtException", () => {
		serverError(res);
	});
});

const PORT = 3000;
server.listen(PORT, () => {
	console.log(`Server running at port ${PORT}`);
});

function pathToDb() {
	return `${import.meta.dirname}/db/users.json`;
}
