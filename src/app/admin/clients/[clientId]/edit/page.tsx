import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ClientCoach } from "@/components/users/clients/ClientCoach";
import ClientServices from "@/components/users/clients/ClientServices";
import DataTable from "@/components/users/DataTable";
import { UserDetails } from "@/components/users/UserDetails";
import { getAllClientServiceTables } from "@/tableInteractions/db";
import { getClientById, getAllCoaches, ClientServiceFull, getUserSites } from "@/userInteractions/db";
import Link from "next/link";

export default async function ViewClientPage({ params }: { params: Promise<{ clientId: string }> }) {
	const { clientId } = await params;
	const fullClient = await getClientById(clientId);
	if (!fullClient) {
		return <div>Client not found</div>;
	}

	const sites = await getUserSites();
	const allCoaches = await getAllCoaches();
	const csTables = await getAllClientServiceTables();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title={`View Client`}>
				<Button asChild>
					<Link href="/admin/clients">Back to Clients</Link>
				</Button>
			</PageHeader>
			{fullClient && (
				<DataTable
					data={fullClient.clientServices as ClientServiceFull[] & { siteId?: string | null }[]}
					sites={sites}
					userType="single-client"
					csTables={csTables}
				/>
			)}
			{fullClient && <UserDetails client={fullClient.user} />}
			{fullClient && <ClientCoach client={fullClient.client} allCoaches={allCoaches} />}
			{fullClient && <ClientServices clientId={clientId} csTables={csTables} />}
		</div>
	);
}
