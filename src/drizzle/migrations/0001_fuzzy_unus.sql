CREATE TABLE "business_contact" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type_of_service" varchar(100),
	"email" varchar(255),
	"phone" varchar(12),
	"address1" varchar(100),
	"address2" varchar(100),
	"city" varchar(50),
	"state" varchar(2),
	"zip" varchar(5),
	"contact_name" varchar(50),
	"contact_phone" varchar(12),
	"contact_email" varchar(255),
	"second_contact_name" varchar(50),
	"second_contact_phone" varchar(12),
	"second_contact_email" varchar(255),
	"notes" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "business_contact_deleted_at_idx" ON "business_contact" USING btree ("deleted_at");