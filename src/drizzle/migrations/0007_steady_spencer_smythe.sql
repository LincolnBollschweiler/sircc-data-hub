ALTER TABLE "user" ADD COLUMN "date_of_birth" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_reentry_client" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "follow_up_needed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "follow_up_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "notes" varchar(1000);