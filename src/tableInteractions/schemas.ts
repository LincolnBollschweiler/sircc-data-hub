import { z } from "zod";

export const clientServiceSchema = z.object({
	name: z.string().min(2, "Required").max(100),
	description: z.string().max(500).nullable(),
	dispersesFunds: z.boolean().nullable().default(false),
});
