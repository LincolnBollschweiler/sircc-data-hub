CREATE TABLE "referred_out" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "visit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(1000),
	"order" integer DEFAULT 9999 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "client_service" ADD COLUMN "referred_out_id" uuid;--> statement-breakpoint
ALTER TABLE "client_service" ADD COLUMN "visit_id" uuid;--> statement-breakpoint
CREATE INDEX "referred_out_deleted_at_idx" ON "referred_out" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "visit_deleted_at_idx" ON "visit" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_referred_out_id_referred_out_id_fk" FOREIGN KEY ("referred_out_id") REFERENCES "public"."referred_out"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_service" ADD CONSTRAINT "client_service_visit_id_visit_id_fk" FOREIGN KEY ("visit_id") REFERENCES "public"."visit"("id") ON DELETE set null ON UPDATE no action;