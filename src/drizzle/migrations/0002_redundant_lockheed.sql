ALTER TABLE "client" DROP CONSTRAINT "client_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "client" DROP CONSTRAINT "client_coach_id_coach_id_fk";
--> statement-breakpoint
ALTER TABLE "client_reentry_check_list_item" DROP CONSTRAINT "client_reentry_check_list_item_client_id_client_id_fk";
--> statement-breakpoint
ALTER TABLE "client_reentry_check_list_item" DROP CONSTRAINT "client_reentry_check_list_item_reentry_check_list_item_id_reentry_check_list_item_id_fk";
--> statement-breakpoint
ALTER TABLE "client_service" DROP CONSTRAINT "client_service_site_id_site_id_fk";
--> statement-breakpoint
ALTER TABLE "client_service" DROP CONSTRAINT "client_service_location_id_location_id_fk";
--> statement-breakpoint
ALTER TABLE "client_service" DROP CONSTRAINT "client_service_client_id_client_id_fk";
--> statement-breakpoint
ALTER TABLE "client_service" DROP CONSTRAINT "client_service_requested_service_id_service_id_fk";
--> statement-breakpoint
ALTER TABLE "client_service" DROP CONSTRAINT "client_service_provided_service_id_service_id_fk";
--> statement-breakpoint
ALTER TABLE "client_service" DROP CONSTRAINT "client_service_referral_source_id_referral_source_id_fk";
--> statement-breakpoint
ALTER TABLE "coach" DROP CONSTRAINT "coach_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "coach" DROP CONSTRAINT "coach_site_id_site_id_fk";
--> statement-breakpoint
ALTER TABLE "coach_hours" DROP CONSTRAINT "coach_hours_coach_id_coach_id_fk";
--> statement-breakpoint
ALTER TABLE "coach_mileage" DROP CONSTRAINT "coach_mileage_coach_id_coach_id_fk";
--> statement-breakpoint
ALTER TABLE "coach_training" DROP CONSTRAINT "coach_training_coach_id_coach_id_fk";
--> statement-breakpoint
ALTER TABLE "coach_training" DROP CONSTRAINT "coach_training_training_id_training_id_fk";
--> statement-breakpoint
ALTER TABLE "volunteer" DROP CONSTRAINT "volunteer_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "volunteer" DROP CONSTRAINT "volunteer_coach_id_coach_id_fk";
--> statement-breakpoint
ALTER TABLE "volunteer_hours" DROP CONSTRAINT "volunteer_hours_volunteer_id_volunteer_id_fk";
--> statement-breakpoint
ALTER TABLE "volunteer_hours" DROP CONSTRAINT "volunteer_hours_volunteering_type_id_volunteering_type_id_fk";
--> statement-breakpoint
ALTER TABLE "volunteer_hours" DROP CONSTRAINT "volunteer_hours_site_id_site_id_fk";
--> statement-breakpoint
ALTER TABLE "coach" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_reentry_check_list_item" ADD CONSTRAINT "client_reentry_check_list_item_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_reentry_check_list_item" ADD CONSTRAINT "client_reentry_check_list_item_reentry_check_list_item_id_reentry_check_list_item_id_fk" FOREIGN KEY ("reentry_check_list_item_id") REFERENCES "public"."reentry_check_list_item"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_requested_service_id_service_id_fk" FOREIGN KEY ("requested_service_id") REFERENCES "public"."service"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_provided_service_id_service_id_fk" FOREIGN KEY ("provided_service_id") REFERENCES "public"."service"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_referral_source_id_referral_source_id_fk" FOREIGN KEY ("referral_source_id") REFERENCES "public"."referral_source"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach" ADD CONSTRAINT "coach_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach" ADD CONSTRAINT "coach_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_hours" ADD CONSTRAINT "coach_hours_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_mileage" ADD CONSTRAINT "coach_mileage_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_training" ADD CONSTRAINT "coach_training_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_training" ADD CONSTRAINT "coach_training_training_id_training_id_fk" FOREIGN KEY ("training_id") REFERENCES "public"."training"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer" ADD CONSTRAINT "volunteer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer" ADD CONSTRAINT "volunteer_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_hours" ADD CONSTRAINT "volunteer_hours_volunteer_id_volunteer_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_hours" ADD CONSTRAINT "volunteer_hours_volunteering_type_id_volunteering_type_id_fk" FOREIGN KEY ("volunteering_type_id") REFERENCES "public"."volunteering_type"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteer_hours" ADD CONSTRAINT "volunteer_hours_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE set null ON UPDATE no action;