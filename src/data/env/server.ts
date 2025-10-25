import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		// Define your environment variables and their types here
		DB_PASSWORD: z.string().min(1),
		DB_USER: z.string().min(1),
		DB_NAME: z.string().min(1),
		DB_HOST: z.string().min(1),
		CLERK_SECRET_KEY: z.string().min(1),
		CLERK_WEBHOOK_SECRET: z.string().min(1),
	},
	runtimeEnv: {
		DB_PASSWORD: process.env.DB_PASSWORD,
		DB_USER: process.env.DB_USER,
		DB_NAME: process.env.DB_NAME,
		DB_HOST: process.env.DB_HOST,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
	},
});
