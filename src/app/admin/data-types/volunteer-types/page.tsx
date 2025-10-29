import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import VolunteerTypes from "@/components/VolunteerTypes";
import { getVolunteerTypes } from "@/tableInteractions/db";

export default async function VolunteerTypesPage() {
	const volunteerTypes = await getVolunteerTypes();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Volunteer Types">
				<Button asChild>
					<Link href="/admin/data-types/volunteer-types/new">Add New Volunteer Type</Link>
				</Button>
			</PageHeader>

			{/* scroll container handled inside ClientServices */}
			<VolunteerTypes items={volunteerTypes} />
		</div>
	);
}
