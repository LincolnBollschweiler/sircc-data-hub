import { z } from "zod";

export const contactSchema = z
	.object({
		name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
		typeOfService: z.string().max(100, "Type of Service must be at most 100 characters").optional().nullable(),
		email: z
			.string()
			.email("Invalid email address")
			.max(255, "Email must be at most 255 characters")
			.optional()
			.nullable(),
		phone: z.string().max(12, "Phone number must be at most 12 characters").optional().nullable(),
		address1: z.string().max(100, "Address must be at most 255 characters").optional().nullable(),
		address2: z.string().max(100, "Address must be at most 255 characters").optional().nullable(),
		city: z.string().max(50, "City must be at most 50 characters").optional().nullable(),
		state: z.string().max(2, "State must be at most 2 characters").optional().nullable(),
		zip: z.string().max(10, "ZIP Code must be at most 10 characters").optional().nullable(),
		contactName: z.string().max(50, "Contact Name must be at most 100 characters").optional().nullable(),
		contactPhone: z.string().max(12, "Contact Phone must be at most 12 characters").optional().nullable(),
		contactEmail: z
			.string()
			.email("Invalid contact email address")
			.max(255, "Contact Email must be at most 255 characters")
			.optional()
			.nullable(),
		secondContactName: z
			.string()
			.max(50, "Second Contact Name must be at most 100 characters")
			.optional()
			.nullable(),
		secondContactPhone: z
			.string()
			.max(12, "Second Contact Phone must be at most 12 characters")
			.optional()
			.nullable(),
		secondContactEmail: z
			.string()
			.email("Invalid second contact email address")
			.max(255, "Second Contact Email must be at most 255 characters")
			.optional()
			.nullable(),
		notes: z.string().max(1000, "Notes must be at most 1000 characters").optional().nullable(),
	})
	.superRefine((data, ctx) => {
		// At least one of contactEmail or contactPhone must be provided
		if (!!data.phone && data.phone.length !== 12) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Must be in the format XXX-XXX-XXXX",
				path: ["phone"],
			});
		}

		if (!!data.contactPhone && data.contactPhone.length !== 12) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Must be in the format XXX-XXX-XXXX",
				path: ["contactPhone"],
			});
		}

		if (!!data.secondContactPhone && data.secondContactPhone.length !== 12) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Must be in the format XXX-XXX-XXXX",
				path: ["secondContactPhone"],
			});
		}
	});
