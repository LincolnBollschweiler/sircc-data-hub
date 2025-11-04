"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	// DropdownMenuLabel,
	// DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { redirect } from "next/navigation";

export default function PeopleDropdownMenu({ role }: { role: string }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center px-1 sm:px-2 hover:bg-accent/50 text-inherit">
				<span className="hover:border-b">People</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-background-dark border-transparent -translate-y-3 min-w-fit">
				{/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator /> */}
				<DropdownMenuItem onSelect={() => redirect("/admin/clients")}>
					<span className="hover:border-b">Clients</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/coaches")}>
					<span className="hover:border-b">Coaches</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/volunteers")}>
					<span className="hover:border-b">Volunteers</span>
				</DropdownMenuItem>
				{role === "developer" ? (
					<DropdownMenuItem onSelect={() => redirect("/admin/dev")}>
						<span className="hover:border-b">Dev</span>
					</DropdownMenuItem>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
