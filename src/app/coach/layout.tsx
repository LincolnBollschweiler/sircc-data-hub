import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

export default function CoachLayout({ children }: Readonly<{ children: ReactNode }>) {
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
				<div className="mr-auto flex items-center gap-1 sm:gap-2">
					<Link className="hover:underline" href="/">
						Sircc Data Hub
					</Link>
					<Badge className="bg-foreground text-background-dark hover:bg-foreground h-5 text-[10px] sm:text-xs">
						Coach
					</Badge>
				</div>
				<div className="size-8 self-center ml-[1rem]">
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
