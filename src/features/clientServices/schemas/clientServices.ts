import z from "zod";

export const clientServiceSchema = z.object({
	name: z.string().min(2, "Required").max(100),
	description: z.string().max(500).optional(),
	dispersesFunds: z.boolean().default(false),
});
