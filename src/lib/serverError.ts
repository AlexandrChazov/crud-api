import { IncomingMessage, ServerResponse } from "node:http";
import { EStatus } from "../enums";

export function serverError(
	res: ServerResponse<IncomingMessage> & { req: IncomingMessage },
): void {
	res.writeHead(EStatus.SERVER_ERROR);
	res.end("Something went wrong");
}
