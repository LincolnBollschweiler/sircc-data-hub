CREATE TYPE "user_role" AS ENUM (
  'admin',
  'coach',
  'client',
  'volunteer',
  'client-volunteer'
);

CREATE TABLE "client" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"coach_id" uuid,
	"is_reentry_client" boolean DEFAULT false,
	"ssn_or_dln" varchar(20) DEFAULT '0' NOT NULL,
	"photo_url" varchar(500),
	"phone" varchar(10),
	"email" varchar(255),
	"address" varchar(255),
	"follow_up_needed" boolean DEFAULT false,
	"follow_up_date" timestamp with time zone,
	"notes" varchar(1000),
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
	"site_id" uuid,
	"location_id" uuid,
	"client_id" uuid NOT NULL,
	"requested_service_id" uuid,
	"provided_service_id" uuid NOT NULL,
	"referral_source_id" uuid,
	"notes" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "coach" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"site_id" uuid,
	"photo_url" varchar(500),
	"phone" varchar(10),
	"email" varchar(255),
	"address" varchar(255),
	"authorized" boolean DEFAULT false,
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
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coach_mileage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coach_id" uuid NOT NULL,
	"miles" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "coach_training" (
	"coach_id" uuid NOT NULL,
	"training_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "reentry_check_list_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "referral_source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
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
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "site" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" varchar(255) NOT NULL,
	"phone" varchar(10) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "training" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" uuid NOT NULL,
	"first_name" varchar(30) NOT NULL,
	"last_name" varchar(30) NOT NULL,
	"role" "user_role" DEFAULT 'client' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "volunteer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"coach_id" uuid,
	"photo_url" varchar(500),
	"phone" varchar(10),
	"email" varchar(255),
	"address" varchar(255),
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
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "volunteering_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_reentry_check_list_item" ADD CONSTRAINT "client_reentry_check_list_item_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_reentry_check_list_item" ADD CONSTRAINT "client_reentry_check_list_item_reentry_check_list_item_id_reentry_check_list_item_id_fk" FOREIGN KEY ("reentry_check_list_item_id") REFERENCES "public"."reentry_check_list_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_requested_service_id_service_id_fk" FOREIGN KEY ("requested_service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_provided_service_id_service_id_fk" FOREIGN KEY ("provided_service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_referral_source_id_referral_source_id_fk" FOREIGN KEY ("referral_source_id") REFERENCES "public"."referral_source"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach" ADD CONSTRAINT "coach_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach" ADD CONSTRAINT "coach_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_hours" ADD CONSTRAINT "coach_hours_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_mileage" ADD CONSTRAINT "coach_mileage_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_training" ADD CONSTRAINT "coach_training_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_training" ADD CONSTRAINT "coach_training_training_id_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."training"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer" ADD CONSTRAINT "volunteer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer" ADD CONSTRAINT "volunteer_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_hours" ADD CONSTRAINT "volunteer_hours_volunteer_id_volunteer_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_hours" ADD CONSTRAINT "volunteer_hours_volunteering_type_id_volunteering_type_id_fk" FOREIGN KEY ("volunteering_type_id") REFERENCES "public"."volunteering_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_hours" ADD CONSTRAINT "volunteer_hours_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_deleted_at_idx" ON "client" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "client_user_id_idx" ON "client" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "client_coach_id_idx" ON "client" USING btree ("coach_id");--> statement-breakpoint
CREATE UNIQUE INDEX "client_id_reentry_check_list_item_id" ON "client_reentry_check_list_item" USING btree ("client_id","reentry_check_list_item_id");--> statement-breakpoint
CREATE INDEX "client_service_site_id_idx" ON "client_service" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "client_service_deleted_at_idx" ON "client_service" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "client_service_client_id_idx" ON "client_service" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "client_service_requested_service_id_idx" ON "client_service" USING btree ("requested_service_id");--> statement-breakpoint
CREATE INDEX "client_service_provided_service_id_idx" ON "client_service" USING btree ("provided_service_id");--> statement-breakpoint
CREATE INDEX "client_service_referral_source_id_idx" ON "client_service" USING btree ("referral_source_id");--> statement-breakpoint
CREATE INDEX "coach_deleted_at_idx" ON "coach" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "coach_user_id_idx" ON "coach" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "coach_site_id_idx" ON "coach" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "coach_hours_coach_id_idx" ON "coach_hours" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "coach_mileage_coach_id_idx" ON "coach_mileage" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "coach_mileage_deleted_at_idx" ON "coach_mileage" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "coach_id_training_id" ON "coach_training" USING btree ("coach_id","training_id");--> statement-breakpoint
CREATE INDEX "location_deleted_at_idx" ON "location" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "reentry_check_list_item_deleted_at_idx" ON "reentry_check_list_item" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "referral_source_deleted_at_idx" ON "referral_source" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "service_deleted_at_idx" ON "service" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "site_deleted_at_idx" ON "site" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "training_deleted_at_idx" ON "training" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_deleted_at_idx" ON "user" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "volunteer_deleted_at_idx" ON "volunteer" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "volunteer_user_id_idx" ON "volunteer" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "volunteer_coach_id_idx" ON "volunteer" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "volunteer_hours_volunteer_id_idx" ON "volunteer_hours" USING btree ("volunteer_id");--> statement-breakpoint
CREATE INDEX "volunteer_hours_volunteering_type_id_idx" ON "volunteer_hours" USING btree ("volunteering_type_id");--> statement-breakpoint
CREATE INDEX "volunteer_hours_site_id_idx" ON "volunteer_hours" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "volunteering_type_deleted_at_idx" ON "volunteering_type" USING btree ("deleted_at");