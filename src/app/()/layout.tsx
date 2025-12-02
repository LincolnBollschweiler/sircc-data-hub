import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";
import SignedInNavbar from "@/components/users/signed-in/SignedInNavbar";

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
					<SignedInNavbar />
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
