export function userId(url = ""): string {
	return url.split("/")[3] || "";
}
