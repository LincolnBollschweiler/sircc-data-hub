import { getCurrentClerkUser } from "@/services/clerk";
import { ApplyUserTheme } from "../ApplyUserTheme";
import ProfileDialog from "../profile/ProfileDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { User } from "@/types";
import Link from "next/link";
import { canAccessAdminPages, canAccessCoachPages } from "@/permissions/general";
import PeopleDropdownMenu from "@/components/PeopleDropdownMenu";
import DataTypesDropdownMenu from "@/components/DataTypesDropdownMenu";
import { headers as nextHeaders } from "next/headers";
import { cn } from "@/lib/utils";

export default async function HeaderLinks() {
	const [user, h] = await Promise.all([getCurrentClerkUser({ allData: true }), nextHeaders()]);

	const url = h.get("x-url");
	const pathName = url ? new URL(url).pathname : null;
	const accepted = user?.data?.accepted ?? false;

	const admin = user && accepted && canAccessAdminPages(user);
	const adminActive = admin && pathName?.includes("/admin");

	const coach = user && accepted && canAccessCoachPages(user);
	const coachActive = coach && pathName?.includes("/coach");

	const client = user && accepted && user.data?.role.includes("client");
	const clientActive = client && pathName?.includes("/client");

	const volunteer = user && accepted && user.data?.role.includes("volunteer");
	const volunteerActive = volunteer && pathName?.includes("/volunteer");

	const RoleLink = ({ label, href, active }: { label: string; href: string; active: boolean }) => (
		<Link className="flex items-center hover:bg-accent/50" href={href}>
			<span
				className={cn(
					"hover-underline-border rounded-sm px-1 sm:px-2",
					active && "bg-foreground text-background"
				)}
			>
				{label}
			</span>
		</Link>
	);

	return (
		<>
			<ApplyUserTheme userTheme={user?.data?.themePreference ?? undefined} />
			{admin && (
				<>
					{adminActive && (
						<>
							<PeopleDropdownMenu />
							<DataTypesDropdownMenu />
						</>
					)}
					<RoleLink label="Admin" href="/admin" active={!!adminActive} />
				</>
			)}
			{coach && <RoleLink label="Coach" href="/coach" active={!!coachActive} />}
			{client && <RoleLink label="Client" href="/client" active={!!clientActive} />}
			{volunteer && <RoleLink label="Volunteer" href="/volunteer" active={!!volunteerActive} />}
			{user && (
				<ProfileDialog user={user.data as User}>
					<DialogTrigger
						id="profile-dialog-trigger"
						className="flex items-center px-1 sm:px-2 hover:bg-accent/50"
					>
						<span className="hover-underline-border">Profile</span>
					</DialogTrigger>
				</ProfileDialog>
			)}
		</>
	);
}
