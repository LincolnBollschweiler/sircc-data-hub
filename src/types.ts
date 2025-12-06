import { InferSelectModel } from "drizzle-orm";
import * as table from "./drizzle/schema";

export type User = InferSelectModel<typeof table.user>;
export type Contact = InferSelectModel<typeof table.businessContact>;
export type Site = InferSelectModel<typeof table.site>;
export type ComboboxItem = { id: string; name: string };
export type DateRangePreset =
	| "all"
	| "thisMonth"
	| "lastMonth"
	| "thisQuarter"
	| "lastQuarter"
	| "thisYear"
	| "lastYear";
