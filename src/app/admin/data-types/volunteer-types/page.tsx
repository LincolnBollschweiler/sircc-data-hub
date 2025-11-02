import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import VolunteerTypes from "@/components/volunteerTypes/VolunteerTypes";
import { getVolunteerTypes } from "@/tableInteractions/db";
import { DialogTrigger } from "@/components/ui/dialog";
import VolunteerTypesFormDialog from "@/components/volunteerTypes/VolunteerTypesFormDialog";

export default async function VolunteerTypesPage() {
	const volunteerTypes = await getVolunteerTypes();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Volunteer Types">
				<VolunteerTypesFormDialog>
					<DialogTrigger asChild>
						<Button>Add New Volunteer Type</Button>
					</DialogTrigger>
				</VolunteerTypesFormDialog>
			</PageHeader>
			<VolunteerTypes items={volunteerTypes} />
		</div>
	);
}
