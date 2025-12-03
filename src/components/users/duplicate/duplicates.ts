"use server";

import { User } from "@/types";
import { db } from "@/drizzle/db";
import { and, eq, isNull, sql } from "drizzle-orm";
import { user } from "@/drizzle/schema";
// import { clientRoles, user, volunteerRoles } from "@/drizzle/schema";
// import { and, eq, inArray, isNull, or, sql } from "drizzle-orm";

export const findDuplicates = async (potentialUser: User) => {
	const { id, phone, firstName, lastName, birthDay, birthMonth } = potentialUser;

	const duplicateByPhone = phone
		? await db.query.user.findMany({
				where: and(
					eq(user.phone, phone),
					isNull(user.deletedAt)
					// or(inArray(user.role, clientRoles), inArray(user.role, volunteerRoles))
				),
		  })
		: [];

	const duplicateByNameAndDob =
		firstName && lastName && birthDay && birthMonth
			? await db.query.user.findMany({
					// columns: { id: true, clerkUserId: true },
					where: and(
						eq(user.firstName, firstName),
						sql`LEFT(${user.lastName}, 1) = ${lastName[0]}`,
						eq(user.birthDay, birthDay),
						eq(user.birthMonth, birthMonth),
						isNull(user.deletedAt)
						// or(inArray(user.role, clientRoles), inArray(user.role, volunteerRoles))
					),
			  })
			: [];

	const duplicateArray = Array.from(
		new Map([...duplicateByPhone, ...duplicateByNameAndDob].map((u) => [u.id, u])).values()
	);
	return duplicateArray.filter((u) => u.id !== id);
};
