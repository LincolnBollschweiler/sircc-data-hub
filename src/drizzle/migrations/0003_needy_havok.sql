ALTER TABLE "client_service" DROP CONSTRAINT "client_service_client_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;