import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getLocations } from "@/tableInteractions/db";
import LocationsFormDialog from "@/components/data-types/locations/LocationsFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import Locations from "@/components/data-types/locations/Locations";
import Link from "next/link";

export default async function LocationsPage() {
	const locations = await getLocations();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Locations">
				<LocationsFormDialog>
					<DialogTrigger asChild>
						<Button className="mr-2">Add New Location</Button>
					</DialogTrigger>
				</LocationsFormDialog>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<Locations items={locations} />
		</div>
	);
}
