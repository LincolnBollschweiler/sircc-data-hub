"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { redirect } from "next/navigation";
import { Table2 } from "lucide-react";

export default function DataTypesDropdownMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center px-1 sm:px-2 hover:bg-accent/50">
				<Table2 className="size-5 sm:hidden mr-1" />
				<span className="hidden sm:inline hover-underline-border">Data Types</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-background-dark border-transparent -translate-y-3">
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/cities")}>
					<span className="hover-underline-border">Cities</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/client-services")}>
					<span className="hover-underline-border">Client Services</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/coach-trainings")}>
					<span className="hover-underline-border">Coach Trainings</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/locations")}>
					<span className="hover-underline-border">Locations</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/reentry-checklist-items")}>
					<span className="hover-underline-border">Re-entry Checklist Items</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/referral-sources")}>
					<span className="hover-underline-border">Referral Sources</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/referred-out")}>
					<span className="hover-underline-border">Referred Out</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/sites")}>
					<span className="hover-underline-border">Sites</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/volunteer-types")}>
					<span className="hover-underline-border">Volunteer Types</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => redirect("/admin/data-types/visits")}>
					<span className="hover-underline-border">Visit Types</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
