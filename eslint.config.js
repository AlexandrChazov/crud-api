import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: { globals: globals.node },
		rules: {
			"no-unused-vars": "error",
			"no-undef": "error",
		},
		files: ["src/**/*.{ts}"],
	},
	eslintConfigPrettier,
];
