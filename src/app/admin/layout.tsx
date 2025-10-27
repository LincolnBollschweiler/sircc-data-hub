import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { canAccessAdminPages, canAccessCoachPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
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
		<header className="flex h-12 shadow bg-background z-10">
			<nav className="flex gap-4 container">
				<div className="mr-auto flex items-center gap-2">
					<Link className="text-lg hover:underline" href="/">
						Sircc Data Hub
					</Link>
					<Badge>Admin</Badge>
				</div>
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

const Coaches = async () => {
	const user = await getCurrentUser();
	if (!canAccessAdminPages(user)) return null;

	return (
		<Link className="hover:bg-accent/10 flex items-center px-2" href="/admin/coaches">
			Coaches
		</Link>
	);
};

const Clients = async () => {
	const user = await getCurrentUser();
	if (!canAccessAdminPages(user)) return null;

	return (
		<Link className="hover:bg-accent/10 flex items-center px-2" href="/admin/clients">
			Clients
		</Link>
	);
};

const Volunteers = async () => {
	const user = await getCurrentUser();
	if (!canAccessAdminPages(user)) return null;

	return (
		<Link className="hover:bg-accent/10 flex items-center px-2" href="/admin/volunteers">
			Volunteers
		</Link>
	);
};

const DataTypes = async () => {
	const user = await getCurrentUser();
	if (!canAccessAdminPages(user)) return null;

	return (
		<Link className="hover:bg-accent/10 flex items-center px-2" href="/admin/data-types">
			Data Types
		</Link>
	);
};
