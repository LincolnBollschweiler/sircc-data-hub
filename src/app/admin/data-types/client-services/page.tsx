import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import ClientServicesTable from "@/components/ClientServicesTable";
import { db } from "@/drizzle/db";
import { service } from "@/drizzle/schema";
import { isNull, desc } from "drizzle-orm";
import { getClientServiceGlobalTag } from "@/tableInteractions/cache";
import { unstable_cache } from "next/cache";

export default async function ClientServicesPage() {
	const clientServices = await getClientServices();

	return (
		<div className="container py-4">
			<PageHeader title="Client Services">
				<Button asChild>
					<Link href="/admin/data-types/client-services/new">Add New Client Service</Link>
				</Button>
			</PageHeader>

			<ClientServicesTable items={clientServices} />
		</div>
	);
}

const cachedClientServices = unstable_cache(
	async () => {
		console.log("Fetching from clientServices from DB (not cache):");
		return await db
			.select({
				id: service.id,
				name: service.name,
				description: service.description,
				dispersesFunds: service.dispersesFunds,
				createdAt: service.createdAt,
				updatedAt: service.updatedAt,
			})
			.from(service)
			.where(isNull(service.deletedAt))
			.orderBy(desc(service.createdAt));
	},
	["getClientServices"],
	{ tags: [getClientServiceGlobalTag()] }
);

// TODO: Setup the caching for this
async function getClientServices() {
	return cachedClientServices();
}
