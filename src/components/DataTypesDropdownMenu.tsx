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

export default function DataTypesDropdownMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center px-1 sm:px-2 hover:bg-accent/50">
				<span className="hover:border-b">Data Types</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-background-dark border-transparent -translate-y-3">
				{/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator /> */}
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/client-services")}>
					<span className="hover:border-b">Client Services</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/coach-trainings")}>
					<span className="hover:border-b">Coach Trainings</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/locations")}>
					<span className="hover:border-b">Locations</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/reentry-checklist-items")}>
					<span className="hover:border-b">Reentry Checklist Items</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/referral-sources")}>
					<span className="hover:border-b">Referral Sources</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/sites")}>
					<span className="hover:border-b">Sites</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/volunteer-types")}>
					<span className="hover:border-b">Volunteer Types</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
