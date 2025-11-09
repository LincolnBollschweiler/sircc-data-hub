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
