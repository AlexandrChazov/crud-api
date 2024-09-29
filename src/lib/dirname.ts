import path from "path";
import { filename } from "./filename";

export function dirname(metaUrl: string): string {
	return path.dirname(filename(metaUrl));
}
