import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getLocations } from "@/tableInteractions/db";
import LocationsFormDialog from "@/components/data-types/locations/LocationsFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import Cities from "@/components/data-types/cities/Cities";

export default async function LocationsPage() {
	const locations = await getLocations();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Locations">
				<LocationsFormDialog>
					<DialogTrigger asChild>
						<Button>Add New Location</Button>
					</DialogTrigger>
				</LocationsFormDialog>
			</PageHeader>
			<Cities items={locations} />
		</div>
	);
}
