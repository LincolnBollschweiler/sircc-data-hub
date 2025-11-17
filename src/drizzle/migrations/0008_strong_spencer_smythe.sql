ALTER TABLE "user" ADD COLUMN "birth_month" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "birth_day" integer;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "date_of_birth";