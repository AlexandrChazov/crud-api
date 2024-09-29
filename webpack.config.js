import { resolve } from "path";

export default {
	entry: "./src/main.ts",
	mode: "production",
	output: {
		filename: "main.cjs",
		path: resolve(import.meta.dirname, "dist"),
		assetModuleFilename: "db/[name][ext]",
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /users\.json$/,
				type: "asset/resource",
			},
		],
	},
	target: "node",
	resolve: {
		extensions: [".js", ".ts"],
	},
};
