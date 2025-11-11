ALTER TABLE "user" ADD COLUMN "accepted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "assigned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "client" DROP COLUMN "accepted";--> statement-breakpoint
ALTER TABLE "client" DROP COLUMN "assigned";