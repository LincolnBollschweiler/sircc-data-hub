import LocationsForm from "@/components/locations/LocationsForm";
import PageHeader from "@/components/PageHeader";

export default function NewLocationsPage() {
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="New Location" />
			<LocationsForm />
		</div>
	);
}
