import { createServer } from "http";
import { readFile } from "fs";

const server = createServer((req, res) => {
	if (req.method === "GET" && req.url === "/api/users") {
		readFile("src/db/users.json", "utf-8", (err, data) => {
			if (err) {
				console.log(err);
			} else {
				const users = JSON.parse(data);
				res.writeHead(200, { "Content-type": "text/plain" });
				res.end(JSON.stringify(Object.values(users)));
			}
		});
	} else {
		res.writeHead(404, { "Content-type": "text/plain" });
		res.end("The endpoint doesn't exist");
	}
});

const PORT = 3000;
server.listen(PORT, () => {
	console.log(`Server running at port ${PORT}`);
});
