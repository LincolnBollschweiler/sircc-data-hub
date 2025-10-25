ALTER TABLE "user" ADD COLUMN "photo_url" varchar(500);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" varchar(10);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "address" varchar(255);--> statement-breakpoint
ALTER TABLE "client" DROP COLUMN "photo_url";--> statement-breakpoint
ALTER TABLE "client" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "client" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "client" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "coach" DROP COLUMN "photo_url";--> statement-breakpoint
ALTER TABLE "coach" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "coach" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "coach" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "volunteer" DROP COLUMN "photo_url";--> statement-breakpoint
ALTER TABLE "volunteer" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "volunteer" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "volunteer" DROP COLUMN "address";