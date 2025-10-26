import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function VolunteerRolesPage() {
	return (
		<div className="container py-4">
			<PageHeader title="Volunteer Roles">
				<Button asChild>
					<Link href="/admin/data-types/volunteer-roles/new">Add New Volunteer Role</Link>
				</Button>
			</PageHeader>
		</div>
	);
}
