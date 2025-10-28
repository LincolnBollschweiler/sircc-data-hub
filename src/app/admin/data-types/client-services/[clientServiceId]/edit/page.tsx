import ClientServiceForm from "@/components/ClientServiceForm";
import PageHeader from "@/components/PageHeader";
import { getClientServiceIdTag } from "@/tableInteractions/cache";
import { getClientServiceById } from "@/tableInteractions/db";
import { unstable_cache } from "next/cache";

export default async function EditClientServicePage({ params }: { params: Promise<{ clientServiceId: string }> }) {
	const { clientServiceId } = await params;
	const clientService = await getCachedClientService(clientServiceId);
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="Edit Client Service" />
			<ClientServiceForm clientService={clientService} />
		</div>
	);
}

const getCachedClientService = (clientServiceId: string) => {
	const cachedFn = unstable_cache(
		async () => {
			return await getClientServiceById(clientServiceId);
		},
		["getClientServiceById", clientServiceId],
		{ tags: [getClientServiceIdTag(clientServiceId)] }
	);
	return cachedFn(); // execute it only when this function is called
};
