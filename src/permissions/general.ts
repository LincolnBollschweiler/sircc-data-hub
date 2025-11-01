import { UserRole } from "@/drizzle/schema";

export const canAccessDevPages = ({ role }: { role: UserRole | undefined }) => role === "developer";

export const canAccessAdminPages = ({ role }: { role: UserRole | undefined }) =>
	role === "admin" || role === "developer";

export const canAccessCoachPages = ({ role }: { role: UserRole | undefined }) =>
	role === "admin" || role === "developer" || role === "coach"; // Admins can access coach pages as well
