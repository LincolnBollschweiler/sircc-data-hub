import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import SignedInNavbar from "./SignedInNavbar";

export default function Navbar({ userType }: { userType: string }) {
	return (
		<header className="flex h-12 shadow bg-background-dark z-10">
			<nav className="flex container text-sm sm:text-lg lg:text-xl">
				<div className="mr-auto flex items-center gap-1 sm:gap-2">
					<Link className="hover:underline" href="/">
						Sircc Data Hub
					</Link>
					<Badge className="bg-foreground text-background-dark hover:bg-foreground h-5 text-[10px] sm:text-xs">
						{userType}
					</Badge>
				</div>
				<SignedInNavbar />
			</nav>
		</header>
	);
}
