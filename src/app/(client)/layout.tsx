import { Button } from "@/components/ui/button";
import { canAccessAdminPages, canAccessCoachPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export default function ClientLayout({ children }: Readonly<{ children: ReactNode }>) {
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
				<Link className="mr-auto text-lg hover:underline flex items-center" href="/">
					Sircc Data Hub
				</Link>
				<SignedIn>
					<AdminLink />
					<YourClients />
					<div className="size-8 self-center">
						<UserButton
							appearance={{
								elements: {
									userButtonAvatarBox: { width: "100%", height: "100%" },
								},
							}}
						/>
					</div>
				</SignedIn>
				<SignedOut>
					<Button className="self-center" asChild>
						<SignInButton>Sign In</SignInButton>
					</Button>
				</SignedOut>
			</nav>
		</header>
	);
};

const AdminLink = async () => {
	const currUser = await getCurrentUser();
	if (!canAccessAdminPages(currUser)) return null;

	return (
		<Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
			Admin
		</Link>
	);
};

const YourClients = async () => {
	const user = await getCurrentUser();
	if (!canAccessCoachPages(user)) return null;

	return (
		<Link className="hover:bg-accent/10 flex items-center px-2" href="/coach">
			Your Clients
		</Link>
	);
};
