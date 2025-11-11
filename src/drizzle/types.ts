import { InferSelectModel } from "drizzle-orm";
import * as table from "./schema";

export type User = InferSelectModel<typeof table.user>;
export type Site = InferSelectModel<typeof table.site>;
