ALTER TABLE "user" RENAME COLUMN "address" TO "address1";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "address2" varchar(100);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "city" varchar(50);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "state" varchar(2);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "zip" varchar(5);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "birth_year" integer;