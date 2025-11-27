ALTER TABLE "client_service" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "client_service_deleted_at_idx" ON "client_service" USING btree ("deleted_at");