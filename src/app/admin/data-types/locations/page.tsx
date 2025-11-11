import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { getLocations } from "@/tableInteractions/db";
import Locations from "@/components/locations/Locations";

export default async function LocationsPage() {
	const locations = await getLocations();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Locations">
				<Button asChild>
					<Link href="/admin/data-types/locations/new">Add New Location</Link>
				</Button>
			</PageHeader>

			{/* scroll container handled inside ClientServices */}
			<Locations items={locations} />
		</div>
	);
}
