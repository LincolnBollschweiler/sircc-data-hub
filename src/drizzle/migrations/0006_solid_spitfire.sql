ALTER TABLE "user" ADD COLUMN "site_id" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "coach_authorized" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" varchar(12);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "address" varchar(255);--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE set null ON UPDATE no action;