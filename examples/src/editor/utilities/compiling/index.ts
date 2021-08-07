import {parse} from "@babel/parser";
import babelGenerate from "@babel/generator";
import {transform as babelTransform} from "@babel/standalone";

/**
 * Takes the given code and produces the AST tree.
 *
 * Only a subset of plugins are available, see: https://babeljs.io/docs/en/6.26.3/babylon
 */
export const ast = (code: string) => {
	console.log(code);
	return parse(code, {
		sourceType: "module",
		plugins: [
			["decorators", {decoratorsBeforeExport: false}],
			"jsx",
			"classProperties",
			"objectRestSpread",
			"asyncGenerators",
		],
	});
};

/**
 * Transform the given code with babel presets
 */
export const transform = (code: string) => {
	return babelTransform(code, {
		presets: ["es2016", "react"],
	}).code;
};

/**
 * Fixes compiled code for eval
 *
 * @param {String} code
 * @returns code
 */
export const clean = (code: string) => {
	return code
		.replace(/;$/gm, "")
		.replace(/\\\\/, "\\")
		.replace(/^import.+$/gm, "");
};

/**
 * Replace unicode with it's character equivalent
 *
 * @param {String} code
 * @returns code
 */
export const fixUnicode = (code: string) => {
	return code.replace(/\\u[\dA-F]{4}/gi, (match) => {
		return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
	});
};

/**
 * Generates babelified code given an ast tree.
 *
 * @param {Object} ast
 * @returns code
 */
export const generate = (ast: any) => {
	return babelGenerate(ast).code;
};

export interface Scope {
	[key: string]: any;
}

/**
 * Returns a function that will take code, and wrap it
 * in code to make it eval-able with the given scope.
 *
 * @param {*} scope
 * @returns Function
 */
export const wrap = (scope: Scope) => (code: string) => {
	const classPattern = /class (\w+) extends React.Component/g;
	const statelessArrowPattern = /const (\w+) = \((.*)\) =>/;
	const statelessFunctionPattern = /function (\w+)(\s)?\((.*)\) {/;
	const asyncGenPattern = /const (\w+) = asyncGen/;
	const missingAsyncGenWrapper = asyncGenPattern.test(code);
	const missingClassWrapper = !classPattern.test(code);
	const missingStatelessWrapper =
		statelessArrowPattern.test(code) || statelessFunctionPattern.test(code);
	let fixedCode = code;

	if (missingAsyncGenWrapper) {
		const matches = asyncGenPattern.exec(code);

		console.log(
			[
				`((${Object.keys(scope).join(", ")}) => {`,
				`  ${code}`,
				`  return ${matches ? matches[1] : ""};`,
				"});",
			].join("\n"),
		);

		return [
			`((${Object.keys(scope).join(", ")}) => {`,
			`  ${code}`,
			`  return ${matches ? matches[1] : ""};`,
			"});",
		].join("\n");
	} else if (missingStatelessWrapper) {
		const matches =
			statelessArrowPattern.exec(code) || statelessFunctionPattern.exec(code);

		return [
			`((${Object.keys(scope).join(", ")}) => {`,
			`  ${code}`,
			`  return ${matches ? matches[1] : ""};`,
			"});",
		].join("\n");
	} else if (missingClassWrapper) {
		fixedCode = [
			"class Example extends React.Component {",
			"  render() {",
			"    return (",
			`      ${code}`,
			"    );",
			"  }",
			"}",
		].join("\n");
	}

	classPattern.lastIndex = 0;

	const classMatch = classPattern.exec(fixedCode);

	return [
		`((${Object.keys(scope).join(", ")}) => {`,
		`  ${fixedCode}`,
		`  return ${classMatch?.[1] ?? ""};`,
		"});",
	].join("\n");
};

/**
 * Returns a function which is a react's Component in a given scope
 *
 * @param {*} scope
 * @returns Function
 */
export const evaluate = (scope: Scope) => (code: string) => {
	// eslint-disable-next-line no-eval
	return eval(code)(...Object.values(scope));
};
