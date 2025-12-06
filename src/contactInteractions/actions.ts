"use server";

import { businessContact } from "@/drizzle/schema";
import { addContact, deleteContactById, updateContactById } from "./db";
import { contactSchema } from "./schema";

export const insertContact = async (unsafeData: Partial<typeof businessContact.$inferInsert>) => {
	const { success, data } = contactSchema.safeParse(unsafeData);
	if (!success) {
		throw new Error("Invalid contact data");
	}

	const rv = await addContact(data);
	return { error: !rv, message: rv ? "User added successfully" : "Failed to add user" };
};

export const updateContact = async (contactId: string, unsafeData: Partial<typeof businessContact.$inferInsert>) => {
	const { success, data } = contactSchema.safeParse(unsafeData);
	if (!success) {
		throw new Error("Invalid contact data");
	}
	const rv = await updateContactById(contactId, data);
	return { error: !rv, message: rv ? "User updated successfully" : "Failed to update user" };
};

export const deleteContact = async (contactId: string) => {
	const rv = await deleteContactById(contactId);
	return { error: !rv, message: rv ? "User updated successfully" : "Failed to update user" };
};
