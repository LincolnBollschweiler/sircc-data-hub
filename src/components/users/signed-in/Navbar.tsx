import SignedInNavbar from "./SignedInNavbar";
import Link from "next/link";
import { Home } from "lucide-react";

export default function Navbar() {
	return (
		<header className="flex h-12 shadow bg-background-dark z-10">
			<nav className="flex container text-sm sm:text-lg lg:text-xl">
				<Link className="mr-auto hover:underline flex items-center" href="/">
					{/* Mobile: icon only */}
					<Home className="size-5 md:hidden" />
					{/* >= sm: text only */}
					<span className="hidden md:inline">SIRCC Data Hub</span>
				</Link>
				<SignedInNavbar />
			</nav>
		</header>
	);
}
