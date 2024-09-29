/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
	transform: {
		"^.+\\.ts?$": [
			"ts-jest",
			{
				useESM: true,
			},
		],
	},
	extensionsToTreatAsEsm: [".ts"],
};
