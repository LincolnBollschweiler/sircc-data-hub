import VolunteerTypesForm from "@/components/volunteerTypes/VolunteerTypesForm";
import PageHeader from "@/components/PageHeader";
import { getVolunteeringTypeIdTag } from "@/tableInteractions/cacheTags";
import { getVolunteerTypeById } from "@/tableInteractions/db";
import { unstable_cache } from "next/cache";

export default async function EditVolunteerTypePage({ params }: { params: Promise<{ volunteerTypeId: string }> }) {
	const { volunteerTypeId } = await params;
	const volunteerType = await getCachedVolunteerType(volunteerTypeId);
	return (
		<div className="container mt-4 py-4 px-6 max-w-2xl mx-auto bg-background-light rounded-md shadow-md">
			<PageHeader title="Edit Volunteer Type" />
			<VolunteerTypesForm volunteerType={volunteerType} />
		</div>
	);
}

const getCachedVolunteerType = (volunteerTypeId: string) => {
	const cachedFn = unstable_cache(
		async () => {
			return await getVolunteerTypeById(volunteerTypeId);
		},
		["getVolunteerTypeById", volunteerTypeId],
		{ tags: [getVolunteeringTypeIdTag(volunteerTypeId)] }
	);
	return cachedFn(); // execute it only when this function is called
};
