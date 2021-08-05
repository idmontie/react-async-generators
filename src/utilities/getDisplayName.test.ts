import {getDisplayName} from "./getDisplayName";

describe("getDisplayName", () => {
	test("should return the displayName of the given component", () => {
		const MyComponent = () => null;

		expect(getDisplayName(MyComponent)).toBe("AsyncGenerator(MyComponent)");
	});
});
