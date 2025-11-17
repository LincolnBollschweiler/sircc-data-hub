import { z } from "zod";

export const updateSchema = z.object({
	id: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const generalSchema = z.object({
	name: z.string().min(2, "Required").max(100),
	description: z.string().max(500).optional().nullable(),
});

export const servicesSchema = z.object({
	name: z.string().min(2, "Required").max(100),
	description: z.string().max(500).nullable(),
	requiresFunding: z.boolean().nullable().default(false),
});

export const siteSchema = z.object({
	name: z.string().min(2, "Required").max(100),
	address: z.string().min(10, "Required").max(255),
	phone: z.string().min(12, "Phone number required. Ex: (208) 555-1234").max(12),
});
