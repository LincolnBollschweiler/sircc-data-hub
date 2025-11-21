DROP INDEX "client_service_deleted_at_idx";--> statement-breakpoint
ALTER TABLE "client_service" DROP COLUMN "deleted_at";