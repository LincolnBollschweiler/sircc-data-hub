"use server";

import { db } from "@/drizzle/db";
import * as table from "@/drizzle/schema";

export const deleteAllReferralSource = async () => {
	await db.delete(table.referralSource);
};

export const deleteAllReferredOut = async () => {
	await db.delete(table.referredOut);
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
