ALTER TABLE "client" ADD COLUMN "phone" varchar(10);--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "address" varchar(255);--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "date_of_birth" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "coach" ADD COLUMN "phone" varchar(10);--> statement-breakpoint
ALTER TABLE "coach" ADD COLUMN "address" varchar(255);--> statement-breakpoint
ALTER TABLE "volunteer" ADD COLUMN "phone" varchar(10);--> statement-breakpoint
ALTER TABLE "volunteer" ADD COLUMN "address" varchar(255);--> statement-breakpoint
ALTER TABLE "volunteer" ADD COLUMN "date_of_birth" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "address";