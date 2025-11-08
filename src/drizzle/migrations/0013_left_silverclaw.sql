CREATE TYPE "theme_preference" AS ENUM ('light', 'dark', 'system');

ALTER TABLE "user" ADD COLUMN "themePreference" "theme_preference" DEFAULT 'system';