import { z } from "zod";

export const generalSchema = z.object({
	name: z.string().min(2, "Required").max(100),
	description: z.string().max(500).nullable(),
});

export const clientServiceSchema = z.object({
	name: z.string().min(2, "Required").max(100),
	description: z.string().max(500).nullable(),
	dispersesFunds: z.boolean().nullable().default(false),
});

export const siteSchema = z.object({
	name: z.string().min(2, "Required").max(100),
	address: z.string().min(10, "Required").max(255),
	phone: z.string().min(12, "Phone number required. Ex: (208) 555-1234").max(12),
});
