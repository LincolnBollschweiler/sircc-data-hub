DROP INDEX "client_service_deleted_at_idx";--> statement-breakpoint
DROP INDEX "coach_mileage_deleted_at_idx";--> statement-breakpoint
ALTER TABLE "coach_hours" ADD COLUMN "date" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "coach_mileage" ADD COLUMN "date" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "coach_training" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "client_service" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "coach_mileage" DROP COLUMN "deleted_at";