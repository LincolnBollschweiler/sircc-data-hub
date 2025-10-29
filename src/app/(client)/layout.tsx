import { Button } from "@/components/ui/button";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";
// import { canAccessAdminPages } from "@/permissions/general"
// import { getCurrentUser } from "@/services/clerk"

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
				<Link className="mr-auto text-lg hover:underline px-2 flex items-center" href="/">
					Sircc Data Hub
				</Link>
				<SignedIn>
					<AdminLink />
					<Link className="hover:bg-accent/10 flex items-center px-2" href="/client/profile">
						Profile
					</Link>
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
	const user = await getCurrentUser();
	if (!canAccessAdminPages(user)) return null;

	return (
		<Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
			Admin
		</Link>
	);
};
