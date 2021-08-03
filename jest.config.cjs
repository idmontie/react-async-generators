// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	preset: "ts-jest",

	// Automatically clear mock calls and instances between every test
	clearMocks: true,

	// A set of global variables that need to be available in all test environments
	globals: {
		"ts-jest": {},
	},

	// An array of file extensions your modules use
	moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

	modulePathIgnorePatterns: [
		"<rootDir>/node_modules/",
		"<rootDir>/dist/",
		"<rootDir>/examples",
	],

	// The test environment that will be used for testing
	testEnvironment: "jest-environment-jsdom",

	// An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
	testPathIgnorePatterns: ["/node_modules/", "/_[^_].*"],

	// A map from regular expressions to paths to transformers
	transform: {
		"^.+\\.tsx?$": "ts-jest",
		"^.+\\.jsx?$": "ts-jest",
	},

	// An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
	watchPathIgnorePatterns: [
		"index.js",
		"dom.js",
		"html.js",
		"cjs",
		"dist",
		"umd",
		".d.ts",
		".js.map",
	],
};
