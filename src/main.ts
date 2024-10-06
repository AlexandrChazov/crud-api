import { config } from "dotenv";
import { createServer } from "http";
import { createRequire } from "module";
import { server } from "./server";

const require = createRequire(import.meta.url);
require("./db/users.json");
config();

export const app = createServer(server);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	process.stdout.write(`Server running at port ${PORT}`);
});
