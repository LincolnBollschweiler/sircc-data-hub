"use server";

import { User } from "@/types";
import { user } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { and, eq, isNull, sql } from "drizzle-orm";

export const findDuplicates = async (potentialUser: User) => {
	const { phone, firstName, lastName, birthDay, birthMonth } = potentialUser;

	const duplicateByPhone = phone
		? await db.query.user.findMany({
				where: and(eq(user.phone, phone), isNull(user.deletedAt)),
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
					),
			  })
			: [];

	return Array.from(new Map([...duplicateByPhone, ...duplicateByNameAndDob].map((u) => [u.id, u])).values());
};
