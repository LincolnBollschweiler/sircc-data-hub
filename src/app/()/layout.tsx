import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";
import SignedInNavbar from "@/components/users/signed-in/SignedInNavbar";
import { Home } from "lucide-react";

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
					{/* Mobile: icon only */}
					<Home className="size-5 md:hidden" />
					{/* >= sm: text only */}
					<span className="hidden md:inline">SIRCC Data Hubs</span>
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
