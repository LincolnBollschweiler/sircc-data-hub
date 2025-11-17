ALTER TABLE "client" ADD COLUMN "is_reentry_client" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "follow_up_needed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "follow_up_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "is_reentry_client";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "follow_up_needed";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "follow_up_date";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "coach_authorized";