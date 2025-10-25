ALTER TABLE "user" ADD COLUMN "address" varchar(255);--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_deleted_at_idx" ON "user" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_clerk_user_id_unique" UNIQUE("clerk_user_id");