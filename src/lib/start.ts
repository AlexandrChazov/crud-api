import { arch } from "os";
export function start() {
	process.stdout.write(arch());
}
