import { Button } from "@/components/ui/button";
import { ApplyUserTheme } from "@/components/users/ApplyUserTheme";
import ProfileDialog from "@/components/users/profile/ProfileDialog";
import { Site, User } from "@/types";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { getUserSites } from "@/userInteractions/db";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { DialogTrigger } from "@radix-ui/react-dialog";
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
		<header className="flex h-12 shadow bg-background-dark z-10">
			<nav className="flex container text-sm sm:text-lg lg:text-xl">
				<Link className="mr-auto hover:underline flex items-center" href="/">
					Sircc Data Hub
				</Link>
				<SignedIn>
					<HeaderLinks />
					<div className="size-8 self-center ml-[0.5rem]">
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

const HeaderLinks = async () => {
	const user = await getCurrentUser({ allData: true });
	const sites = await getUserSites();

	return (
		<>
			<ApplyUserTheme userTheme={user.data?.themePreference ?? undefined} />
			{AdminLink(user.data as User)}
			{/* {YourClients()} */}
			{ProfileLink(user.data as User, sites as Site[])}
		</>
	);
};

const AdminLink = (user: User) => {
	if (!user || !canAccessAdminPages(user)) return null;
	return (
		<Link className="flex items-center px-2 hover:bg-accent/50" href="/admin">
			<span className="hover-underline-border">Admin</span>
		</Link>
	);
};

const ProfileLink = (user: User, sites: Site[]) => {
	if (!user) return null;
	return (
		<ProfileDialog user={user} sites={sites}>
			<DialogTrigger className="flex items-center px-1 sm:px-2 hover:bg-accent/50">
				<span className="hover-underline-border">Profile</span>
			</DialogTrigger>
		</ProfileDialog>
	);
};

// const YourClients = async () => {
// 	const user = await getCurrentUser();
// 	if (!canAccessCoachPages(user)) return null;

// 	return (
// 		<Link className="flex items-center px-2 hover:bg-accent/50" href="/clients">
// 			<span className="hover-underline-border">Clients</span>
// 		</Link>
// 	);
// };
