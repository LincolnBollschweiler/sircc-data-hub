import { UserRole } from "@/drizzle/schema";

export const canAccessAdminPages = ({ role }: { role: UserRole | undefined }) =>
	role === "admin" || role === "developer";

export const canAccessCoachPages = ({ role }: { role: UserRole | undefined }) =>
	canAccessAdminPages({ role }) || role === "coach"; // Admins can access coach pages as well test comment
