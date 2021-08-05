import React from "react";
import AsyncGenerator from "./AsyncGenerator";

describe("debug utility behavior", () => {
	it("uses a good display name", () => {
		const MyComponent = () => <div />;

		const comp = <AsyncGenerator render={MyComponent} />;

		expect(comp.type.displayName).toBe("AsyncGenerator");
	});
});
