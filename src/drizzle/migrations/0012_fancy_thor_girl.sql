ALTER TABLE "client_reentry_check_list_item" DROP CONSTRAINT "client_reentry_check_list_item_client_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "client_reentry_check_list_item" ADD CONSTRAINT "client_reentry_check_list_item_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;