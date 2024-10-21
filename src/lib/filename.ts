import { fileURLToPath } from "node:url";

export function filename(metaUrl: string): string {
	return fileURLToPath(metaUrl);
}
