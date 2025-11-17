import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ClientCoach } from "@/components/users/clients/ClientCoach";
import ClientServicesWrapper from "@/components/users/clients/ClientServicesWrapper";
import DataTable from "@/components/users/DataTable";
import { UserDetails } from "@/components/users/UserDetails";
import {
	Location,
	City,
	getCities,
	getLocations,
	getReferralSources,
	getReferredOut,
	getServices,
	getVisits,
	ReferralSource,
	ReferredOut,
	Service,
	Visit,
} from "@/tableInteractions/db";
import { ClientServiceFull, getAllCoaches, getClientById, getUserSites } from "@/userInteractions/db";
import Link from "next/link";

export default async function ViewClientPage({ params }: { params: Promise<{ clientId: string }> }) {
	const { clientId } = await params;
	const fullClient = await getClientById(clientId);
	if (!fullClient) {
		return <div>Client not found</div>;
	}

	const allCoaches = await getAllCoaches();
	const sites = await getUserSites();
	const services = await getServices();
	const locations = await getLocations();
	const referralSources = await getReferralSources();
	const referredOut = await getReferredOut();
	const visits = await getVisits();
	const cities = await getCities();

	const newServiceProps = {
		services: services as Service[],
		locations: locations as Location[],
		referralSources: referralSources as ReferralSource[],
		referredOut: referredOut as ReferredOut[],
		visits: visits as Visit[],
		cities: cities as City[],
		// sites: sites as Site[],
	};

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
					newServiceProps={newServiceProps}
				/>
			)}
			{fullClient && <UserDetails client={fullClient.user} />}
			{fullClient && <ClientCoach client={fullClient.client} allCoaches={allCoaches} />}
			{fullClient && <ClientServicesWrapper clientId={clientId} />}
		</div>
	);
}
