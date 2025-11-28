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

export default async function HeaderLinks() {
	const [user, h] = await Promise.all([getCurrentClerkUser({ allData: true }), nextHeaders()]);

	const url = h.get("x-url");
	const pathName = url ? new URL(url).pathname : null;

	const admin = user && canAccessAdminPages(user);
	const coach = user && canAccessCoachPages(user);
	const client = user && user.data?.role.includes("client");

	return (
		<>
			<ApplyUserTheme userTheme={user.data?.themePreference ?? undefined} />
			{admin && !pathName?.includes("/admin") && (
				<Link className="flex items-center px-2 hover:bg-accent/50" href="/admin">
					<span className="hover-underline-border">Admin</span>
				</Link>
			)}
			{admin && pathName?.includes("/admin") && (
				<>
					<PeopleDropdownMenu />
					<DataTypesDropdownMenu />
				</>
			)}
			{coach && !pathName?.includes("/coach") && (
				<Link className="flex items-center px-2 hover:bg-accent/50" href="/coach">
					<span className="hover-underline-border">Coach</span>
				</Link>
			)}
			{client && !pathName?.includes("/client") && (
				<Link className="flex items-center px-2 hover:bg-accent/50" href="/client">
					<span className="hover-underline-border">Client</span>
				</Link>
			)}
			{user && (
				<ProfileDialog user={user.data as User}>
					<DialogTrigger className="flex items-center px-1 sm:px-2 hover:bg-accent/50">
						<span className="hover-underline-border">Profile</span>
					</DialogTrigger>
				</ProfileDialog>
			)}
		</>
	);
}
