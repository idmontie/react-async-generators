import React from "react";
import Async from "./Async";

describe("debug utility behavior", () => {
	it("uses a good display name", () => {
		const MyComponent = () => <div />;

		const comp = <Async render={MyComponent} />;

		expect(comp.type.displayName).toBe("AsyncWrapper");
	});
});
