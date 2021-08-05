import {isIterator} from "./isIterator";

describe("isIterator", () => {
	test("should return true if the given value is a generator", () => {
		const generator = function* () {};
		const iterator = generator();
		expect(isIterator(iterator)).toBe(true);
	});
	test("should return false if the given value is not a generator", () => {
		const notGenerator = function () {};
		const iterator = notGenerator();
		expect(isIterator(iterator)).toBe(false);
	});
	test("should return true for duck typed generator", () => {
		// Taken from MDN
		function makeRangeIterator(start = 0, end = Infinity, step = 1) {
			let nextIndex = start;
			let iterationCount = 0;

			const rangeIterator = {
				next: function () {
					let result;
					if (nextIndex < end) {
						result = {value: nextIndex, done: false};
						nextIndex += step;
						iterationCount++;
						return result;
					}
					return {value: iterationCount, done: true};
				},
			};
			return rangeIterator;
		}

		const iterator = makeRangeIterator();
		expect(isIterator(iterator)).toBe(true);
	});
});
