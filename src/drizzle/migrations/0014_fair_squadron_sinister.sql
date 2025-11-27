CREATE TABLE "coach" (
	"id" uuid PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"llc" varchar(100),
	"website" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "coach_hours" DROP CONSTRAINT "coach_hours_coach_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "coach_mileage" DROP CONSTRAINT "coach_mileage_coach_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "coach_training" DROP CONSTRAINT "coach_training_coach_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "coach" ADD CONSTRAINT "coach_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "coach_deleted_at_idx" ON "coach" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "coach_hours" ADD CONSTRAINT "coach_hours_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_mileage" ADD CONSTRAINT "coach_mileage_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_training" ADD CONSTRAINT "coach_training_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE cascade ON UPDATE no action;