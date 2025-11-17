ALTER TABLE "user" ALTER COLUMN "accepted" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "desiredRole" "user_role";