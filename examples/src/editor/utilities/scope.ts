import React from "react";
import * as RAG from "react-async-generators";

/** regex */
const reactImports =
	/import[\s]*(?:[\w]+,? )(?:{?(?:[\w\n\r\t, ]+)\s})?\s?from\s?['"]react['"];?$/gm;
// has two catching groups: one catches component(s) inside "{}", second catches the from part
const nxImports =
	/import[\s]*(?:[\w]+, )?{\s([\w*\n\r\t, ]+)\s} from\s*?["'\s]((?:[@\w_-]+)(?:\/[\w_-]+)?)["'\s].*;?/gm;
const jsxComponents = /<([A-Z][a-z]+[a-z,A-Z]+)/gm;

const fullScope: any = {};
const otherScope: any = {
	// TODO maybe add RAG to scope?
};

interface ScopeCache {
	code: string;
	codeScope: any;
}

const cache: ScopeCache = {
	code: "",
	codeScope: null,
};

export default (code: string, withGlobals = false) => {
	if (code === cache.code) return cache.codeScope;

	const scope = fullScope;

	cache.code = code;

	const {default: _, ...RAGNoDefault} = RAG;

	cache.codeScope = withGlobals ? {React, ...React, ...RAGNoDefault} : {};

	code
		.replace(reactImports, "")
		.replace(nxImports, (_: string, ...args: any[]) => {
			const [components, pkg] = args;
			// parse import lines
			components.split(",").forEach((name: string) => {
				const comp = name.trim();

				if (!scope[pkg] || !scope[pkg][comp]) return null;

				cache.codeScope[comp] = scope[pkg][comp];

				return null;
			});

			return _;
		})
		.replace(jsxComponents, (_: string, ...args: any[]) => {
			const [component] = args;
			// parse JSX and add other components to the scope
			const nxComponent = otherScope[component];

			if (!cache.codeScope[component] && nxComponent) {
				cache.codeScope[component] = nxComponent;
			}

			return _;
		});

	return cache.codeScope;
};
