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
			<DropdownMenuTrigger className="flex items-center px-2 hover:bg-accent/50">
				<span className="hover:border-b">Data Types</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="bg-background-dark border-transparent -translate-y-3">
				{/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator /> */}
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/client-services")}>
					Client Services
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/coach-trainings")}>
					Coach Trainings
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/locations")}>Locations</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/reentry-checklist-items")}>
					Reentry Checklist Items
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/referral-sources")}>
					Referral Sources
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/sites")}>Sites</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/volunteer-types")}>
					Volunteer Types
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
