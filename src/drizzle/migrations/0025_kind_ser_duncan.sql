ALTER TABLE "volunteer_hours" ADD COLUMN "date" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "volunteer_hours" ADD COLUMN "notes" varchar(1000);