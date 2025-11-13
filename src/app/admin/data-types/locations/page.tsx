import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getLocations } from "@/tableInteractions/db";
import Locations from "@/components/data-types/locations/Locations";
import LocationsFormDialog from "@/components/data-types/locations/LocationsFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

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
			<Locations items={locations} />
		</div>
	);
}
