import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import ReentryCheckListWrapper from "@/components/users/clients/ReentryCheckListWrapper";
import DataTable from "@/components/users/DataTable";
import { UserDetails } from "@/components/users/UserDetails";
import { getAllClientServiceTables } from "@/tableInteractions/db";
import { getClientById, getAllCoaches, ClientServiceFull } from "@/userInteractions/db";
import Link from "next/link";

export default async function ViewClientPage({ params }: { params: Promise<{ clientId: string }> }) {
	const { clientId } = await params;
	const fullClient = await getClientById(clientId);
	if (!fullClient) {
		return <div>Client not found</div>;
	}

	const allCoaches = await getAllCoaches();
	const csTables = await getAllClientServiceTables();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title={`View Client`}>
				<Button asChild>
					<Link href="/admin/clients">Back to Clients</Link>
				</Button>
			</PageHeader>
			{fullClient && <UserDetails user={fullClient.user} client={fullClient.client} allCoaches={allCoaches} />}
			{fullClient && fullClient.client.isReentryClient && <ReentryCheckListWrapper clientId={clientId} />}
			{fullClient && (
				<DataTable
					data={fullClient.clientServices as ClientServiceFull[] & { siteId?: string | null }[]}
					userType="single-client"
					csTables={csTables}
					clientId={clientId}
				/>
			)}
		</div>
	);
}
