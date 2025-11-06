import { z } from "zod";

export const userSchema = z
	.object({
		firstName: z.string().min(2, "Required").max(30),
		lastName: z.string().min(1, "Required").max(30),
		email: z.string().email().max(255).nullable(),
		address: z
			.string()
			.max(255)
			.nullable()
			.transform((val) => (val === "" ? null : val)),
		phone: z
			.string()
			.nullable()
			.transform((val) => (val === "" ? null : val))
			.refine(
				(val) => val === null || val.length === 12,
				"Phone number must be 12 characters (Ex: 208-555-1234)"
			),
		siteId: z
			.string()
			.nullable()
			.transform((val) => (val === "none" ? null : val)),
		birthMonth: z.number().min(1).max(12).nullable(),
		birthDay: z.number().min(1).max(31).nullable(),
		notes: z.string().min(2, "Required: can be as simple as 'Help!'").max(1000),
		desiredRole: z.enum(["developer", "admin", "coach", "client", "volunteer", "client-volunteer"]).nullable(),
	})
	.superRefine((data, ctx) => {
		const hasPhone = !!data.phone;
		const hasBirthDate = !!data.birthMonth && !!data.birthDay;

		if (!hasPhone && !hasBirthDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Please provide either a phone number or your birth month and day.",
				path: ["phone"],
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Please provide either a phone number or your birth month and day.",
				path: ["birthMonth"],
			});
		}
	});

// export const userAdminSchema = userSchema.extend({
// 	id: z.string().uuid(),
// 	role: z.enum(userRoles).nullable(),
// 	coachAuthorized: z.boolean().nullable(),
// 	isReentryClient: z.boolean().nullable(),
// 	followUpNeeded: z.boolean().nullable(),
// 	followUpDate: z.date().nullable(),
// 	accepted: z.boolean().nullable(),
// 	notes: z.string().max(1000).nullable(),
// });

export type UserType =
	| {
			role: "developer" | "admin" | "coach" | "client" | "volunteer" | "client-volunteer";
			accepted: boolean | null;
			coachAuthorized: boolean | null;
			firstName: string;
			lastName: string;
			phone: string | null;
			siteId: string | null;
			address: string | null;
			id: string;
			email: string | null;
			birthMonth: number | null;
			birthDay: number | null;
			notes: string | null;
			desiredRole: "developer" | "admin" | "coach" | "client" | "volunteer" | "client-volunteer" | null;
			clerkUserId: string;
			photoUrl: string | null;
			createdAt: Date;
			updatedAt: Date;
			deletedAt: Date | null;
			isReentryClient: boolean | null;
			followUpNeeded: boolean | null;
			followUpDate: Date | null;
			roleAssigned: boolean | null;
	  }
	| undefined;
