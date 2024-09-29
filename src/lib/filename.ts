import { fileURLToPath } from "url";

export function filename(metaUrl: string): string {
	return fileURLToPath(metaUrl);
}
