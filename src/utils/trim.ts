type StringKeys<T> = {
	[K in keyof T]: Extract<T[K], string> extends never ? never : K;
}[keyof T];

// StringKeys is only used if an array of keys is provided.
export function trimStrings<T extends Record<string, unknown>>(obj: T, keys?: readonly StringKeys<T>[]): T {
	const result: Partial<T> = { ...obj };

	const keysToCheck = (keys ?? Object.keys(obj)) as readonly (keyof T)[];

	for (const key of keysToCheck) {
		const value = obj[key];

		if (typeof value === "string") {
			result[key] = value.trim() as T[typeof key];
		}
	}

	return result as T;
}
