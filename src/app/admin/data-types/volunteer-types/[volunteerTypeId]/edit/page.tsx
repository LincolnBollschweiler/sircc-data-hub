import VolunteerTypesForm from "@/components/VolunteerTypesForm";
import PageHeader from "@/components/PageHeader";
import { getVolunteeringTypeIdTag } from "@/tableInteractions/cache";
import { getVolunteerTypeById } from "@/tableInteractions/db";
import { unstable_cache } from "next/cache";

export default async function EditVolunteerTypePage({ params }: { params: Promise<{ volunteerTypeId: string }> }) {
	const { volunteerTypeId } = await params;
	const volunteerType = await getCachedVolunteerType(volunteerTypeId);
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="Edit Client Service" />
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
