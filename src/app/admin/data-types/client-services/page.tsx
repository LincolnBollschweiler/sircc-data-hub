import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import ClientServicesTable from "@/components/ClientServicesTable";
import { getClientServices } from "@/tableInteractions/db";

export default async function ClientServicesPage() {
	const clientServices = await getClientServices();

	return (
		<div className="container py-4 w-fit mx-auto">
			<PageHeader title="Client Services">
				<Button asChild>
					<Link href="/admin/data-types/client-services/new">Add New Client Service</Link>
				</Button>
			</PageHeader>

			<ClientServicesTable items={clientServices} />
		</div>
	);
}
