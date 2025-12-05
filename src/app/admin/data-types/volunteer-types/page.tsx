import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import VolunteerTypes from "@/components/data-types/volunteerTypes/VolunteerTypes";
import { getVolunteerTypes } from "@/tableInteractions/db";
import { DialogTrigger } from "@/components/ui/dialog";
import VolunteerTypesFormDialog from "@/components/data-types/volunteerTypes/VolunteerTypesFormDialog";
import Link from "next/link";

export default async function VolunteerTypesPage() {
	const volunteerTypes = await getVolunteerTypes();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Volunteer Types">
				<VolunteerTypesFormDialog>
					<DialogTrigger asChild>
						<Button className="mr-2">Add New Volunteer Type</Button>
					</DialogTrigger>
				</VolunteerTypesFormDialog>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<VolunteerTypes items={volunteerTypes} />
		</div>
	);
}
