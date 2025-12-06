import { db } from "@/drizzle/db";
import { businessContact } from "@/drizzle/schema";
import { eq, isNull, and } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getAllContactsGlobalTag, getContactIdTag } from "./cacheTags";
import { revalidateContactCache } from "./cache";
import { Contact } from "@/types";

//#region CRUD Contacts
// export type Contact = typeof businessContact.$inferSelect;

const cachedContacts = unstable_cache(
	async (): Promise<Contact[]> => {
		return await db
			.select()
			.from(businessContact)
			.where(isNull(businessContact.deletedAt))
			.orderBy(businessContact.name);
	},
	["getAllContacts"],
	{ tags: [getAllContactsGlobalTag()] }
);
export const getAllContacts = async () => cachedContacts();

const cachedContactById = (id: string) => {
	const cachedFn = unstable_cache(
		async (): Promise<Contact | null> => {
			const [contactRow] = await db
				.select()
				.from(businessContact)
				.where(and(eq(businessContact.id, id), isNull(businessContact.deletedAt)))
				.limit(1);

			return contactRow || null;
		},
		["getContactById", id],
		{ tags: [getContactIdTag(id)] }
	);
	return cachedFn;
};
export const getContactById = async (id: string) => cachedContactById(id);

export const addContact = async (data: typeof businessContact.$inferInsert) => {
	const [newContact] = await db.insert(businessContact).values(data).returning();
	if (!newContact) throw new Error("Failed to create new contact");
	revalidateContactCache(newContact.id);
	return newContact;
};

export const updateContactById = async (contactId: string, data: Partial<typeof businessContact.$inferInsert>) => {
	const [updatedContact] = await db
		.update(businessContact)
		.set(data)
		.where(eq(businessContact.id, contactId))
		.returning();

	if (!updatedContact) throw new Error("Failed to update contact");
	revalidateContactCache(updatedContact.id);
	return updatedContact;
};

export const deleteContactById = async (contactId: string) => {
	const [deletedContact] = await db
		.update(businessContact)
		.set({ deletedAt: new Date() })
		.where(eq(businessContact.id, contactId))
		.returning();

	if (!deletedContact) throw new Error("Failed to delete contact");
	revalidateContactCache(deletedContact.id);
	return deletedContact;
};
//#endregion
