import {
	integer,
	pgTable,
	uuid,
	varchar,
	timestamp,
	pgEnum,
	decimal,
	boolean,
	index,
	uniqueIndex,
} from "drizzle-orm/pg-core";

// ---------- Reusable timestamps ----------
const createdAt = timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = timestamp("updated_at", { withTimezone: true })
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date());
const deletedAt = timestamp("deleted_at", { withTimezone: true });

// In your generated migration .sql, add these two CREATE TYPE lines to .sql migration (before any CREATE TABLE statements):
// -- Enums
// CREATE TYPE "user_role" AS ENUM ('developer',
// 	'admin',
// 	'admin-coach',
// 	'admin-volunteer',
// 	'admin-coach-volunteer',
// 	'staff',
// 	'staff-volunteer',
// 	'coach',
// 	'coach-staff',
// 	'coach-volunteer',
// 	'coach-staff-volunteer',
// 	'client',
// 	'volunteer',
// 	'client-volunteer',
// 	'client-staff',
// 	'client-staff-volunteer');

// CREATE TYPE "theme_preference" AS ENUM ('light', 'dark', 'system');

// ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin-volunteer';
// ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'client-staff';

// When rolling back add these to .sql migration (after all DROP TABLE statements):
// DROP TABLE IF EXISTS "user";
// DROP TYPE IF EXISTS "user_role";
// DROP TYPE IF EXISTS "theme_preference";

// If we need to drop the DB and recreate it:
// docker exec -it sircc-data-hub-db-1 psql -U postgres -d sircc_data_hub
// then from the psql prompt run:
// DROP SCHEMA public CASCADE;
// CREATE SCHEMA public;
// exit with \q

// Enums
const userRoles = [
	"developer",
	"admin",
	"admin-coach",
	"admin-volunteer",
	"admin-coach-volunteer",
	"staff",
	"staff-volunteer",
	"coach",
	"coach-staff",
	"coach-volunteer",
	"coach-staff-volunteer",
	"client",
	"volunteer",
	"client-volunteer",
	"client-staff",
	"client-staff-volunteer",
	"",
] as const;
export type UserRole = (typeof userRoles)[number];
const userRoleEnum = pgEnum("user_role", userRoles);

export const coachRoles: UserRole[] = userRoles.filter((role) => role.includes("coach"));
export const clientRoles: UserRole[] = userRoles.filter((role) => role.includes("client"));
export const volunteerRoles: UserRole[] = userRoles.filter((role) => role.includes("volunteer"));
export const staffRoles: UserRole[] = userRoles.filter((role) => role.includes("staff"));
export const adminRoles: UserRole[] = userRoles.filter((role) => role.includes("admin"));

const themes = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof themes)[number];
const themePreferenceEnum = pgEnum("theme_preference", themes);

// ---------- Tables ----------

export const site = pgTable(
	"site",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		address: varchar("address", { length: 255 }).notNull(),
		phone: varchar("phone", { length: 12 }).notNull(),
		order: integer("order").notNull().default(9999),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("site_deleted_at_idx").on(table.deletedAt)]
);

export const user = pgTable(
	"user",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		clerkUserId: varchar("clerk_user_id", { length: 100 }).unique(),
		firstName: varchar("first_name", { length: 30 }).notNull(),
		lastName: varchar("last_name", { length: 30 }).notNull(),
		role: userRoleEnum().notNull().default("client"),
		desiredRole: userRoleEnum(),
		email: varchar("email", { length: 255 }),
		photoUrl: varchar("photo_url", { length: 500 }),
		siteId: uuid("site_id").references(() => site.id, { onDelete: "set null" }),
		phone: varchar("phone", { length: 12 }),
		address1: varchar("address1", { length: 100 }),
		address2: varchar("address2", { length: 100 }),
		city: varchar("city", { length: 50 }),
		state: varchar("state", { length: 2 }),
		zip: varchar("zip", { length: 5 }),
		birthMonth: integer("birth_month"),
		birthDay: integer("birth_day"),
		accepted: boolean("accepted"),
		notes: varchar("notes", { length: 1000 }),
		themePreference: themePreferenceEnum("theme_preference").default("system"),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [
		index("user_role_idx").on(table.role),
		index("user_deleted_at_idx").on(table.deletedAt),
		index("user_site_id_idx").on(table.siteId),
	]
);

export const client = pgTable(
	"client",
	{
		id: uuid("id")
			.references(() => user.id, { onDelete: "cascade" })
			.primaryKey(),
		coachId: uuid("coach_id").references(() => user.id, { onDelete: "set null" }),
		isReentryClient: boolean("is_reentry_client").default(false),
		followUpNeeded: boolean("follow_up_needed").default(false),
		followUpDate: timestamp("follow_up_date", { withTimezone: true }),
		followUpNotes: varchar("follow_up_notes", { length: 1000 }),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("client_coach_id_idx").on(table.coachId)]
);

export const coach = pgTable(
	"coach",
	{
		id: uuid("id")
			.references(() => user.id, { onDelete: "cascade" })
			.primaryKey(),
		isActive: boolean("is_active").default(true),
		llc: varchar("llc", { length: 100 }),
		website: varchar("website", { length: 255 }),
		therapyNotesUrl: varchar("therapy_notes_url", { length: 500 }),
		notes: varchar("notes", { length: 1000 }),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("coach_deleted_at_idx").on(table.deletedAt)]
);

export const coachMileage = pgTable(
	"coach_mileage",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		coachId: uuid("coach_id")
			.references(() => coach.id, { onDelete: "cascade" })
			.notNull(),
		miles: decimal("miles", { precision: 5, scale: 2 }),
		date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
		notes: varchar("notes", { length: 1000 }),
		createdAt,
		updatedAt,
	},
	(table) => [index("coach_mileage_coach_id_idx").on(table.coachId)]
);

export const coachHours = pgTable(
	"coach_hours",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		coachId: uuid("coach_id")
			.references(() => coach.id, { onDelete: "cascade" })
			.notNull(),
		paidHours: decimal("paid_hours", { precision: 5, scale: 2 }),
		volunteerHours: decimal("volunteer_hours", { precision: 5, scale: 2 }),
		date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
		notes: varchar("notes", { length: 1000 }),
		createdAt,
		updatedAt,
	},
	(table) => [index("coach_hours_coach_id_idx").on(table.coachId)]
);

export const service = pgTable(
	"service",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 1000 }),
		requiresFunding: boolean("disperses_funds").default(false),
		order: integer("order").notNull().default(9999),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("service_deleted_at_idx").on(table.deletedAt)]
);

export const training = pgTable(
	"training",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 1000 }),
		order: integer("order").notNull().default(9999),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("training_deleted_at_idx").on(table.deletedAt)]
);

export const reentryCheckListItem = pgTable(
	"reentry_check_list_item",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 1000 }),
		order: integer("order").notNull().default(9999),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("reentry_check_list_item_deleted_at_idx").on(table.deletedAt)]
);

export const volunteeringType = pgTable(
	"volunteering_type",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 1000 }),
		order: integer("order").notNull().default(9999),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("volunteering_type_deleted_at_idx").on(table.deletedAt)]
);

export const volunteerHours = pgTable(
	"volunteer_hours",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		volunteerId: uuid("volunteer_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		volunteeringTypeId: uuid("volunteering_type_id")
			.references(() => volunteeringType.id, { onDelete: "restrict" })
			.notNull(),
		siteId: uuid("site_id").references(() => site.id, { onDelete: "set null" }),
		hours: decimal("hours", { precision: 5, scale: 2 }).notNull(),
		date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
		notes: varchar("notes", { length: 1000 }),
		createdAt,
		updatedAt,
	},
	(table) => [
		index("volunteer_hours_volunteer_id_idx").on(table.volunteerId),
		index("volunteer_hours_volunteering_type_id_idx").on(table.volunteeringTypeId),
		index("volunteer_hours_site_id_idx").on(table.siteId),
	]
);

export const referralSource = pgTable(
	"referral_source",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 1000 }),
		order: integer("order").notNull().default(9999),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("referral_source_deleted_at_idx").on(table.deletedAt)]
);

export const referredOut = pgTable(
	"referred_out",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 1000 }),
		order: integer("order").notNull().default(9999),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("referred_out_deleted_at_idx").on(table.deletedAt)]
);

export const visit = pgTable(
	"visit",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 1000 }),
		order: integer("order").notNull().default(9999),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("visit_deleted_at_idx").on(table.deletedAt)]
);

export const location = pgTable(
	"location",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 1000 }),
		order: integer("order").notNull().default(9999),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("location_deleted_at_idx").on(table.deletedAt)]
);

export const city = pgTable(
	"city",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		order: integer("order").notNull().default(9999),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("city_deleted_at_idx").on(table.deletedAt)]
);

export const clientService = pgTable(
	"client_service",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		clientId: uuid("client_id")
			.references(() => client.id, { onDelete: "cascade" })
			.notNull(),
		siteId: uuid("site_id").references(() => site.id, { onDelete: "set null" }),
		cityId: uuid("city_id").references(() => city.id, { onDelete: "set null" }),
		locationId: uuid("location_id").references(() => location.id, { onDelete: "set null" }),
		requestedServiceId: uuid("requested_service_id").references(() => service.id, { onDelete: "restrict" }),
		providedServiceId: uuid("provided_service_id").references(() => service.id, { onDelete: "restrict" }),
		referralSourceId: uuid("referral_source_id").references(() => referralSource.id, { onDelete: "set null" }),
		referredOutId: uuid("referred_out_id").references(() => referredOut.id, { onDelete: "set null" }),
		visitId: uuid("visit_id").references(() => visit.id, { onDelete: "set null" }),
		funds: decimal("funds", { precision: 6, scale: 2 }),
		notes: varchar("notes", { length: 1000 }),
		createdAt,
		updatedAt,
	},
	(table) => [
		index("client_service_site_id_idx").on(table.siteId),
		index("client_service_city_id_idx").on(table.cityId),
		index("client_service_client_id_idx").on(table.clientId),
		index("client_service_requested_service_id_idx").on(table.requestedServiceId),
		index("client_service_provided_service_id_idx").on(table.providedServiceId),
		index("client_service_referral_source_id_idx").on(table.referralSourceId),
	]
);

export const clientReentryCheckListItem = pgTable(
	"client_reentry_check_list_item",
	{
		clientId: uuid("client_id")
			.references(() => client.id, { onDelete: "cascade" })
			.notNull(),
		reentryCheckListItemId: uuid("reentry_check_list_item_id")
			.references(() => reentryCheckListItem.id, { onDelete: "restrict" })
			.notNull(),
	},
	(table) => [uniqueIndex("client_id_reentry_check_list_item_id").on(table.clientId, table.reentryCheckListItemId)]
);

export const coachTraining = pgTable(
	"coach_training",
	{
		coachId: uuid("coach_id")
			.references(() => coach.id, { onDelete: "cascade" })
			.notNull(),
		trainingId: uuid("training_id")
			.references(() => training.id, { onDelete: "restrict" })
			.notNull(),
		createdAt,
	},
	(table) => [uniqueIndex("coach_id_training_id").on(table.coachId, table.trainingId)]
);
