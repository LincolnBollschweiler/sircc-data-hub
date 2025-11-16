import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ClientCoach } from "@/components/users/clients/ClientCoach";
import ClientServicesWrapper from "@/components/users/clients/ClientServicesWrapper";
import DataTable from "@/components/users/DataTable";
import { UserDetails } from "@/components/users/UserDetails";
import { ClientServiceFull, getAllCoaches, getClientById, getUserSites } from "@/userInteractions/db";
import Link from "next/link";

export default async function ViewClientPage({ params }: { params: Promise<{ clientId: string }> }) {
	const { clientId } = await params;
	const fullClient = await getClientById(clientId);
	const allCoaches = await getAllCoaches();
	const sites = await getUserSites();

	// const services = await getClientServices();

	// console.dir(fullClient, { depth: null });

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
				/>
			)}
			{fullClient && <UserDetails client={fullClient.user} />}
			{fullClient && <ClientCoach client={fullClient.client} allCoaches={allCoaches} />}
			{fullClient && <ClientServicesWrapper client={fullClient.client} />}
			{/* {fullClient && (
				<ClientServices
					client={fullClient.client}
					clientServices={fullClient.clientService}
					services={services}
				/>
			)} */}
		</div>
	);
}
