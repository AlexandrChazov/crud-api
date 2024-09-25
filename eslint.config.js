const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("typescript-eslint");
const eslintConfigPrettier = require("eslint-config-prettier");

const config = [
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
    languageOptions: { globals: globals.node },
		rules: {
			"no-unused-vars": "error",
			"no-undef": "error",
		},
		files: ["src/**/*.{js}"],
	},
	eslintConfigPrettier
];

module.exports = config;
