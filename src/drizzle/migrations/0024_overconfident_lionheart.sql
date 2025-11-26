ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'admin-coach';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'admin-coach-volunteer';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'staff';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'staff-volunteer';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'coach-staff';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'coach-volunteer';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'coach-staff-volunteer';
ALTER TYPE "user_role" ADD VALUE IF NOT EXISTS 'client-volunteer-staff';

ALTER TABLE "coach" ADD COLUMN "therapy_notes_url" varchar(500);