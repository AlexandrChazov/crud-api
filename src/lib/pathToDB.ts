import { dirname } from "./dirname";

export function pathToDb(url: string): string {
	return `${dirname(url)}/db/users.json`;
}
