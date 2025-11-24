import { z } from "zod";

export const assignRoleSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	desiredRole: z.enum(["admin", "coach", "client", "volunteer", "client-volunteer"]).nullable(),
	role: z.enum(["admin", "coach", "client", "volunteer", "client-volunteer"]),
	isReentryClient: z.boolean().optional(),
});

export const clerkUserSchema = z
	.object({
		firstName: z.string().min(2, "Required").max(30),
		lastName: z.string().min(1, "Required").max(30),
		email: z.string().email().max(255).nullable(),
		address1: z.string().max(100).optional(),
		address2: z.string().max(100).optional(),
		city: z.string().min(2, "City is required"),
		state: z.string().max(2, "Two letter state abbreviation").optional(),
		zip: z.string().max(5, "Five digit zip code").optional(),
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
		notes: z.preprocess((val) => {
			if (val == null) return ""; // convert null/undefined → ""
			if (typeof val === "string") return val.trim();
			return val;
		}, z.string().max(1000).optional()),
		desiredRole: z.enum(["developer", "admin", "coach", "client", "volunteer", "client-volunteer"]).nullable(),
		themePreference: z.enum(["light", "dark", "system"]).default("system"),
		accepted: z.boolean().nullable(),
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

export const userSchema = z
	.object({
		firstName: z.string().min(2, "Required").max(30),
		lastName: z.string().min(1, "Required").max(30),
		role: z.enum(["client", "volunteer", "client-volunteer"]),
		email: z
			.string()
			.email()
			.max(255)
			.nullable()
			.transform((v) => (v === "" ? null : v))
			.optional(),
		phone: z
			.string()
			.nullable()
			.optional()
			.transform((v) => (v === "" ? null : v)),
		address1: z.string().max(100).nullable().optional(),
		address2: z.string().max(100).nullable().optional(),
		city: z.string().max(50).nullable().optional(),
		state: z.string().max(2, "Two letter state abbreviation").nullable().optional(),
		zip: z.string().max(5, "Five digit zip code").nullable().optional(),
		birthMonth: z.preprocess(
			(val) => (val === "" || val == null ? null : Number(val)),
			z.number().min(1).max(12).nullable().optional()
		),
		birthDay: z.preprocess(
			(val) => (val === "" || val == null ? null : Number(val)),
			z.number().min(1).max(31).nullable().optional()
		),
		notes: z.preprocess((val) => {
			if (val == null) return ""; // convert null/undefined → ""
			if (typeof val === "string") return val.trim();
			return val;
		}, z.string().max(1000).optional()),
		isReentryClient: z.boolean().optional(),
		followUpNeeded: z.boolean().optional(),
		followUpNotes: z.string().max(1000).optional().nullable(),
		followUpDate: z.preprocess((val) => {
			if (val === "" || val == null) return null;
			return new Date(val as string);
		}, z.date().nullable().optional()),
	})
	.superRefine((data, ctx) => {
		const hasPhone = !!data.phone;
		const hasBirthDate = !!data.birthMonth && !!data.birthDay;
		const hasFollowUpDate = !!data.followUpDate;

		if (hasPhone && (data.phone as string).length !== 12) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Phone number must be 12 characters (Ex: 208-555-1234)",
				path: ["phone"],
			});
		}

		if (!hasPhone && !hasBirthDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Please provide either a phone number or your birth month and day.",
				path: ["phone"],
			});
		}

		if (data.followUpNeeded && !hasFollowUpDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Please provide a follow-up date if follow-up is needed.",
				path: ["followUpDate"],
			});
		}
	});
