/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
	checkers: ["typescript"],
	tsconfigFile: "tsconfig.json",
	packageManager: "npm",
	reporters: ["html", "clear-text", "progress"],
	testRunner: "jest",
	coverageAnalysis: "perTest",
  timeoutMS: 600000,
};
