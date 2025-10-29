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

const createdAt = timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

const updatedAt = timestamp("updated_at", { withTimezone: true })
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date());

const deletedAt = timestamp("deleted_at", { withTimezone: true });

// Enum

export const userRoles = ["developer", "admin", "coach", "client", "volunteer", "client-volunteer"] as const;
export type UserRole = (typeof userRoles)[number];
const userRoleEnum = pgEnum("user_role", userRoles);

export const user = pgTable(
	"user",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		clerkUserId: varchar("clerk_user_id", { length: 100 }).notNull().unique(),
		firstName: varchar("first_name", { length: 30 }).notNull(),
		lastName: varchar("last_name", { length: 30 }).notNull(),
		role: userRoleEnum().notNull().default("client"),
		photoUrl: varchar("photo_url", { length: 500 }),
		email: varchar("email", { length: 255 }),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("user_role_idx").on(table.role), index("user_deleted_at_idx").on(table.deletedAt)]
);

export const site = pgTable(
	"site",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		address: varchar("address", { length: 255 }).notNull(),
		phone: varchar("phone", { length: 10 }).notNull(),
		order: integer("order").notNull().default(0),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("site_deleted_at_idx").on(table.deletedAt)]
);

export const location = pgTable(
	"location",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 1000 }),
		order: integer("order").notNull().default(0),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("location_deleted_at_idx").on(table.deletedAt)]
);

export const coach = pgTable(
	"coach",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		siteId: uuid("site_id").references(() => site.id, { onDelete: "set null" }),
		authorized: boolean("authorized").default(false),
		phone: varchar("phone", { length: 10 }),
		address: varchar("address", { length: 255 }),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [
		index("coach_deleted_at_idx").on(table.deletedAt),
		index("coach_user_id_idx").on(table.userId),
		index("coach_site_id_idx").on(table.siteId),
	]
);

export const coachMileage = pgTable(
	"coach_mileage",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		coachId: uuid("coach_id")
			.references(() => coach.id, { onDelete: "cascade" })
			.notNull(),
		miles: integer("miles").notNull(),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [
		index("coach_mileage_coach_id_idx").on(table.coachId),
		index("coach_mileage_deleted_at_idx").on(table.deletedAt),
	]
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
		createdAt,
		updatedAt,
	},
	(table) => [index("coach_hours_coach_id_idx").on(table.coachId)]
);

export const client = pgTable(
	"client",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		coachId: uuid("coach_id").references(() => coach.id, {
			onDelete: "set null",
		}),
		phone: varchar("phone", { length: 10 }),
		address: varchar("address", { length: 255 }),
		dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
		isReentryClient: boolean("is_reentry_client").default(false),
		followUpNeeded: boolean("follow_up_needed").default(false),
		followUpDate: timestamp("follow_up_date", { withTimezone: true }),
		notes: varchar("notes", { length: 1000 }),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [
		index("client_deleted_at_idx").on(table.deletedAt),
		index("client_user_id_idx").on(table.userId),
		index("client_coach_id_idx").on(table.coachId),
	]
);

// TODO: dispersesFunds might be better as an enum if we have more options later, so we know what dispersal table or column to update
export const service = pgTable(
	"service",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 1000 }),
		dispersesFunds: boolean("disperses_funds").default(false),
		order: integer("order").notNull().default(0),
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
		order: integer("order").notNull().default(0),
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
		order: integer("order").notNull().default(0),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("reentry_check_list_item_deleted_at_idx").on(table.deletedAt)]
);

export const volunteer = pgTable(
	"volunteer",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		coachId: uuid("coach_id").references(() => coach.id, {
			onDelete: "set null",
		}),
		phone: varchar("phone", { length: 10 }),
		address: varchar("address", { length: 255 }),
		dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [
		index("volunteer_deleted_at_idx").on(table.deletedAt),
		index("volunteer_user_id_idx").on(table.userId),
		index("volunteer_coach_id_idx").on(table.coachId),
	]
);

export const volunteeringType = pgTable(
	"volunteering_type",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 100 }).notNull(),
		description: varchar("description", { length: 1000 }),
		order: integer("order").notNull().default(0),
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
			.references(() => volunteer.id, { onDelete: "cascade" })
			.notNull(),
		volunteeringTypeId: uuid("volunteering_type_id")
			.references(() => volunteeringType.id, { onDelete: "restrict" })
			.notNull(),
		siteId: uuid("site_id").references(() => site.id, { onDelete: "set null" }),
		hours: decimal("hours", { precision: 5, scale: 2 }).notNull(),
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
		order: integer("order").notNull().default(0),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [index("referral_source_deleted_at_idx").on(table.deletedAt)]
);

export const clientService = pgTable(
	"client_service",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		siteId: uuid("site_id").references(() => site.id, { onDelete: "set null" }),
		locationId: uuid("location_id").references(() => location.id, {
			onDelete: "set null",
		}),
		clientId: uuid("client_id")
			.references(() => client.id, { onDelete: "cascade" })
			.notNull(),
		requestedServiceId: uuid("requested_service_id").references(() => service.id, { onDelete: "restrict" }),
		providedServiceId: uuid("provided_service_id")
			.references(() => service.id, { onDelete: "restrict" })
			.notNull(),
		referralSourceId: uuid("referral_source_id").references(() => referralSource.id, { onDelete: "set null" }),
		notes: varchar("notes", { length: 1000 }),
		createdAt,
		updatedAt,
		deletedAt,
	},
	(table) => [
		index("client_service_site_id_idx").on(table.siteId),
		index("client_service_deleted_at_idx").on(table.deletedAt),
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
	},
	(table) => [uniqueIndex("coach_id_training_id").on(table.coachId, table.trainingId)]
);
