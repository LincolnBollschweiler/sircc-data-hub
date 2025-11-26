import { UserRole } from "@/drizzle/schema";

export const canAccessDevPages = ({ role }: { role?: UserRole | undefined }) => role === "developer";

export const canAccessAdminPages = ({ role }: { role?: UserRole | undefined }) =>
	role?.includes("admin") || role === "developer";

export const canAccessCoachPages = ({ role }: { role?: UserRole | undefined }) => role?.includes("coach");

export const canAccessVolunteerPages = ({ role }: { role?: UserRole | undefined }) => role?.includes("volunteer");

export const canAccessStaffPages = ({ role }: { role?: UserRole | undefined }) => role?.includes("staff");
