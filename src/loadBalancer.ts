import Cluster from "cluster";
import { cpus } from "os";
import { createServer, request } from "http";
import { config } from "dotenv";
import { server } from "./server";

config();
const numCPUs = cpus().length;
const PORT = process.env.PORT as unknown as string;

if (Cluster.isPrimary) {
	console.info(`-=Master ${process.pid} is running=-`);

	for (let i = 0; i < numCPUs; i++) {
		Cluster.fork({ PORT: `${Number(PORT) + i + 1}` });
	}

	let increment = 1;
	const loadBalancer = createServer((req, res) => {
		const options = {
			hostname: "localhost",
			port: Number(PORT) + (increment % (numCPUs + 1)),
			path: req.url,
			method: req.method,
			headers: req.headers,
		};

		const proxy = request(options, (proxyRes) => {
			res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
			proxyRes.pipe(res, { end: true });
		});

		req.pipe(proxy, { end: true });
		increment++;
	});

	loadBalancer.listen(PORT, () => {
		console.log(`Load balancer listening on port ${PORT}`);
	});

	Cluster.on("exit", (worker) => {
		console.log(`worker ${worker.process.pid} died`);
	});
} else {
	console.info(`Starting server on port ${PORT}`);
	createServer(server).listen(PORT);
}
