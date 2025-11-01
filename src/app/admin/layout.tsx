import DataTypesDropdownMenu from "@/components/DataTypesDropdownMenu";
import { Badge } from "@/components/ui/badge";
import { canAccessAdminPages, canAccessCoachPages, canAccessDevPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}

const Navbar = () => {
	return (
		<header className="flex h-12 shadow bg-background-dark z-10">
			<nav className="flex gap-2 container">
				<div className="mr-auto flex items-center gap-2">
					<Link className="text-lg hover:underline" href="/">
						Sircc Data Hub
					</Link>
					<Badge className="bg-black hover:bg-black">Admin</Badge>
				</div>
				<Dev />
				<Coaches />
				<Clients />
				<Volunteers />
				<DataTypes />
				<div className="size-8 self-center">
					<UserButton
						appearance={{
							elements: {
								userButtonAvatarBox: { width: "100%", height: "100%" },
							},
						}}
					/>
				</div>
			</nav>
		</header>
	);
};

const Dev = async () => {
	const user = await getCurrentUser();
	if (!canAccessDevPages(user)) return null;

	return (
		<Link className="flex items-center px-2 hover:bg-accent/50" href="/admin/dev">
			<span className="hover:border-b">Dev</span>
		</Link>
	);
};

const Coaches = async () => {
	const user = await getCurrentUser();
	if (!canAccessCoachPages(user)) return null;

	return (
		<Link className="flex items-center px-2 hover:bg-accent/50" href="/admin/coaches">
			<span className="hover:border-b">Coaches</span>
		</Link>
	);
};

const Clients = async () => {
	const user = await getCurrentUser();
	if (!canAccessAdminPages(user)) return null;

	return (
		<Link className="flex items-center px-2 hover:bg-accent/50" href="/admin/clients">
			<span className="hover:border-b">Clients</span>
		</Link>
	);
};

const Volunteers = async () => {
	const user = await getCurrentUser();
	if (!canAccessAdminPages(user)) return null;

	return (
		<Link className="flex items-center px-2 hover:bg-accent/50" href="/admin/volunteers">
			<span className="hover:border-b">Volunteers</span>
		</Link>
	);
};

const DataTypes = async () => {
	const user = await getCurrentUser();
	if (!canAccessAdminPages(user)) return null;
	return <DataTypesDropdownMenu />;
};
