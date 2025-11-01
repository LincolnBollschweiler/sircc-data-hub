import LocationsForm from "@/components/locations/LocationsForm";
import PageHeader from "@/components/PageHeader";
import { getLocationIdTag } from "@/tableInteractions/cache";
import { getLocationById } from "@/tableInteractions/db";
import { unstable_cache } from "next/cache";

export default async function EditLocationsPage({ params }: { params: Promise<{ locationId: string }> }) {
	const { locationId } = await params;
	const location = await getCachedLocation(locationId);
	return (
		<div className="container mt-4 py-4 px-6 max-w-2xl mx-auto bg-background-light rounded-md shadow-md">
			<PageHeader title="Edit Location" />
			<LocationsForm location={location} />
		</div>
	);
}

const getCachedLocation = (locationId: string) => {
	const cachedFn = unstable_cache(
		async () => {
			return await getLocationById(locationId);
		},
		["getLocationById", locationId],
		{ tags: [getLocationIdTag(locationId)] }
	);
	return cachedFn(); // execute it only when this function is called
};
