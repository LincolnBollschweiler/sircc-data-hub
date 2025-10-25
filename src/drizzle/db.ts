import { env } from "@/data/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle({
	schema,
	connection: {
		host: env.DB_HOST,
		database: env.DB_NAME,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
	},
});
