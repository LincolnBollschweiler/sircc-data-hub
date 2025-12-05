"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { redirect } from "next/navigation";

export default function PeopleDropdownMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center px-1 sm:px-2 hover:bg-accent/50">
				<User className="size-5 sm:hidden" />
				<span className="hidden sm:inline hover-underline-border">People</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-background-dark border-transparent -translate-y-3 min-w-fit">
				{/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator /> */}
				<DropdownMenuItem onSelect={() => redirect("/admin/applicants")}>
					<span className="hover-underline-border">Applicants</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/clients")}>
					<span className="hover-underline-border">Clients</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/coaches")}>
					<span className="hover-underline-border">Coaches</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/volunteers")}>
					<span className="hover-underline-border">Volunteers</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/admins")}>
					<span className="hover-underline-border">Admins</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/staff")}>
					<span className="hover-underline-border">Staff</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/rejected-applicants")}>
					<span className="hover-underline-border">
						<div>Rejected</div>
						<div>Applicants</div>
					</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/deleted-users")}>
					<span className="hover-underline-border">Deleted Users</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
