import { IncomingMessage, ServerResponse } from "http";

export function serverError(
	res: ServerResponse<IncomingMessage> & { req: IncomingMessage },
): void {
	res.writeHead(500);
	res.end("Something went wrong");
}
