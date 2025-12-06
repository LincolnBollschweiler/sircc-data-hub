"use server";

import { db } from "@/drizzle/db";
import * as table from "@/drizzle/schema";
import { businessContact, client, user } from "@/drizzle/schema";

export const insertClerkUserDev = async (data: typeof table.user.$inferInsert) => {
	const [newUser] = await db.insert(table.user).values(data).returning();
	return newUser;
};

export const deleteAllReferralSource = async () => {
	await db.delete(table.referralSource);
};
export const deleteAllReferredOut = async () => {
	await db.delete(table.referredOut);
};
export const deleteAllContacts = async () => {
	await db.delete(table.businessContact);
};
export const deleteAllVolunteerTypes = async () => {
	await db.delete(table.volunteeringType);
};
export const deleteAllVisit = async () => {
	await db.delete(table.visit);
};
export const deleteAllLocation = async () => {
	await db.delete(table.location);
};
export const deleteAllService = async () => {
	await db.delete(table.service);
};
export const deleteAllReentryChecklistItem = async () => {
	await db.delete(table.reentryCheckListItem);
};
export const deleteAllCity = async () => {
	await db.delete(table.city);
};

export const deleteAllUser = async () => {
	await db.delete(table.user);
};
export const deleteAllCoach = async () => {
	await db.delete(table.coach);
};
export const deleteAllClient = async () => {
	await db.delete(table.client);
};
export const deleteAllClientService = async () => {
	await db.delete(table.clientService);
};
export const createReferralSource = async (data: typeof table.referralSource.$inferInsert) => {
	const [newReferralSource] = await db.insert(table.referralSource).values(data).returning();
	return newReferralSource?.id;
};
export const createReferredOut = async (data: typeof table.referredOut.$inferInsert) => {
	const [newReferredOut] = await db.insert(table.referredOut).values(data).returning();
	return newReferredOut?.id;
};
export const createVolunteerType = async (data: typeof table.volunteeringType.$inferInsert) => {
	const [newVolunteeringType] = await db.insert(table.volunteeringType).values(data).returning();
	return newVolunteeringType?.id;
};
export const createReentryChecklistItem = async (data: typeof table.reentryCheckListItem.$inferInsert) => {
	const [newReentryChecklistItem] = await db.insert(table.reentryCheckListItem).values(data).returning();
	return newReentryChecklistItem?.id;
};
export const createVisit = async (data: typeof table.visit.$inferInsert) => {
	const [newVisit] = await db.insert(table.visit).values(data).returning();
	return newVisit?.id;
};
export const createLocation = async (data: typeof table.location.$inferInsert) => {
	const [newLocation] = await db.insert(table.location).values(data).returning();
	return newLocation?.id;
};
export const createService = async (data: typeof table.service.$inferInsert) => {
	const [newService] = await db.insert(table.service).values(data).returning();
	return newService?.id;
};
export const createCity = async (data: typeof table.city.$inferInsert) => {
	const [newCity] = await db.insert(table.city).values(data).returning();
	return newCity?.id;
};

async function addUser(userData: typeof user.$inferInsert, clientData: typeof client.$inferInsert) {
	const userInsert = await db.transaction(async (tx) => {
		const [newUser] = await tx
			.insert(user)
			.values({ ...userData, accepted: true })
			.returning();
		if (!newUser) throw new Error("Failed to add user");

		if (userData.role?.includes("client")) {
			const [newClient] = await tx
				.insert(client)
				.values({
					...clientData,
					id: newUser.id,
				})
				.returning();
			if (!newClient) throw new Error("Failed to create client for user");
		}
		return newUser;
	});
	return userInsert.id;
}

export const createUser = async (userData: typeof user.$inferInsert, clientData: typeof client.$inferInsert) =>
	await addUser(userData, clientData);

export const addClientService = async (data: typeof table.clientService.$inferInsert) => {
	const [newClientService] = await db.insert(table.clientService).values(data).returning();
	return newClientService?.id;
};

export const insertContact = async (data: typeof businessContact.$inferInsert) => {
	console.log(data);
	const [newContact] = await db.insert(businessContact).values(data).returning();
	return newContact?.id;
};
