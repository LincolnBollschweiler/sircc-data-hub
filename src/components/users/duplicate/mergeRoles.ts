export const mergeRoles = (existing: string, incoming: string): string => {
	const parse = (role: string) => (role ? role.split("-").filter(Boolean) : []);

	const existingSet = new Set(parse(existing));
	const incomingSet = new Set(parse(incoming));

	// Merge sets
	for (const r of incomingSet) existingSet.add(r);

	// Canonical ordering for ALL valid role parts
	const order = ["admin", "coach", "client", "staff", "volunteer"];

	return order.filter((r) => existingSet.has(r)).join("-");
};

export const removeRole = (existing: string, roleToRemove: string): string => {
	const parts = existing.split("-").filter(Boolean);
	const filtered = parts.filter((part) => part !== roleToRemove);
	return filtered.join("-");
};
