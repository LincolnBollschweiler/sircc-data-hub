CREATE TYPE "user_role" AS ENUM (
  'developer',
  'admin',
  'admin-coach',
  'admin-volunteer',
  'admin-coach-volunteer',
  'staff',
  'staff-volunteer',
  'coach',
  'coach-staff',
  'coach-volunteer',
  'coach-staff-volunteer',
  'client',
  'volunteer',
  'client-volunteer',
  'client-staff',
  'client-volunteer-staff'
);

CREATE TYPE "theme_preference" AS ENUM ('light', 'dark', 'system');


CREATE TABLE "city" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "client" (
	"id" uuid PRIMARY KEY NOT NULL,
	"coach_id" uuid,
	"is_reentry_client" boolean DEFAULT false,
	"follow_up_needed" boolean DEFAULT false,
	"follow_up_date" timestamp with time zone,
	"follow_up_notes" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "client_reentry_check_list_item" (
	"client_id" uuid NOT NULL,
	"reentry_check_list_item_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"site_id" uuid,
	"city_id" uuid,
	"location_id" uuid,
	"requested_service_id" uuid,
	"provided_service_id" uuid,
	"referral_source_id" uuid,
	"referred_out_id" uuid,
	"visit_id" uuid,
	"funds" numeric(6, 2),
	"notes" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coach" (
	"id" uuid PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"llc" varchar(100),
	"website" varchar(255),
	"therapy_notes_url" varchar(500),
	"notes" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "coach_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coach_id" uuid NOT NULL,
	"paid_hours" numeric(5, 2),
	"volunteer_hours" numeric(5, 2),
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coach_mileage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coach_id" uuid NOT NULL,
	"miles" numeric(5, 2),
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coach_training" (
	"coach_id" uuid NOT NULL,
	"training_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "reentry_check_list_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "referral_source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "referred_out" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"disperses_funds" boolean DEFAULT false,
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "site" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" varchar(255) NOT NULL,
	"phone" varchar(12) NOT NULL,
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "training" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" varchar(100),
	"first_name" varchar(30) NOT NULL,
	"last_name" varchar(30) NOT NULL,
	"role" "user_role" DEFAULT 'client' NOT NULL,
	"desiredRole" "user_role",
	"email" varchar(255),
	"photo_url" varchar(500),
	"site_id" uuid,
	"phone" varchar(12),
	"address1" varchar(100),
	"address2" varchar(100),
	"city" varchar(50),
	"state" varchar(2),
	"zip" varchar(5),
	"birth_month" integer,
	"birth_day" integer,
	"accepted" boolean,
	"notes" varchar(1000),
	"theme_preference" "theme_preference" DEFAULT 'system',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "user_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "visit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "volunteer_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"volunteer_id" uuid NOT NULL,
	"volunteering_type_id" uuid NOT NULL,
	"site_id" uuid,
	"hours" numeric(5, 2) NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "volunteering_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_coach_id_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_reentry_check_list_item" ADD CONSTRAINT "client_reentry_check_list_item_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_reentry_check_list_item" ADD CONSTRAINT "client_reentry_check_list_item_reentry_check_list_item_id_reentry_check_list_item_id_fk" FOREIGN KEY ("reentry_check_list_item_id") REFERENCES "public"."reentry_check_list_item"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_requested_service_id_service_id_fk" FOREIGN KEY ("requested_service_id") REFERENCES "public"."service"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_provided_service_id_service_id_fk" FOREIGN KEY ("provided_service_id") REFERENCES "public"."service"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_referral_source_id_referral_source_id_fk" FOREIGN KEY ("referral_source_id") REFERENCES "public"."referral_source"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_referred_out_id_referred_out_id_fk" FOREIGN KEY ("referred_out_id") REFERENCES "public"."referred_out"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_visit_id_visit_id_fk" FOREIGN KEY ("visit_id") REFERENCES "public"."visit"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach" ADD CONSTRAINT "coach_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_hours" ADD CONSTRAINT "coach_hours_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_mileage" ADD CONSTRAINT "coach_mileage_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_training" ADD CONSTRAINT "coach_training_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_training" ADD CONSTRAINT "coach_training_training_id_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."training"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_hours" ADD CONSTRAINT "volunteer_hours_volunteer_id_user_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_hours" ADD CONSTRAINT "volunteer_hours_volunteering_type_id_volunteering_type_id_fk" FOREIGN KEY ("volunteering_type_id") REFERENCES "public"."volunteering_type"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_hours" ADD CONSTRAINT "volunteer_hours_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "city_deleted_at_idx" ON "city" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "client_coach_id_idx" ON "client" USING btree ("coach_id");--> statement-breakpoint
CREATE UNIQUE INDEX "client_id_reentry_check_list_item_id" ON "client_reentry_check_list_item" USING btree ("client_id","reentry_check_list_item_id");--> statement-breakpoint
CREATE INDEX "client_service_site_id_idx" ON "client_service" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "client_service_city_id_idx" ON "client_service" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "client_service_client_id_idx" ON "client_service" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "client_service_requested_service_id_idx" ON "client_service" USING btree ("requested_service_id");--> statement-breakpoint
CREATE INDEX "client_service_provided_service_id_idx" ON "client_service" USING btree ("provided_service_id");--> statement-breakpoint
CREATE INDEX "client_service_referral_source_id_idx" ON "client_service" USING btree ("referral_source_id");--> statement-breakpoint
CREATE INDEX "coach_deleted_at_idx" ON "coach" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "coach_hours_coach_id_idx" ON "coach_hours" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "coach_mileage_coach_id_idx" ON "coach_mileage" USING btree ("coach_id");--> statement-breakpoint
CREATE UNIQUE INDEX "coach_id_training_id" ON "coach_training" USING btree ("coach_id","training_id");--> statement-breakpoint
CREATE INDEX "location_deleted_at_idx" ON "location" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "reentry_check_list_item_deleted_at_idx" ON "reentry_check_list_item" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "referral_source_deleted_at_idx" ON "referral_source" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "referred_out_deleted_at_idx" ON "referred_out" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "service_deleted_at_idx" ON "service" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "site_deleted_at_idx" ON "site" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "training_deleted_at_idx" ON "training" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_deleted_at_idx" ON "user" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "user_site_id_idx" ON "user" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "visit_deleted_at_idx" ON "visit" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "volunteer_hours_volunteer_id_idx" ON "volunteer_hours" USING btree ("volunteer_id");--> statement-breakpoint
CREATE INDEX "volunteer_hours_volunteering_type_id_idx" ON "volunteer_hours" USING btree ("volunteering_type_id");--> statement-breakpoint
CREATE INDEX "volunteer_hours_site_id_idx" ON "volunteer_hours" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "volunteering_type_deleted_at_idx" ON "volunteering_type" USING btree ("deleted_at");