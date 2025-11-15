import {
	ClientService,
	Location,
	ReferralSource,
	Site,
	getClientServices,
	getLocations,
	getReferralSources,
	getSites,
} from "@/tableInteractions/db";
import ClientServices from "./ClientServices";
import { ClientFull } from "@/userInteractions/db";

export default async function ClientServicesWrapper({ client }: { client: ClientFull["client"] }) {
	const services = await getClientServices();
	const locations = await getLocations();
	const referralSources = await getReferralSources();
	const sites = await getSites();

	return (
		<ClientServices
			client={client}
			services={services as ClientService[]}
			locations={locations as Location[]}
			referralSources={referralSources as ReferralSource[]}
			sites={sites as Site[]}
		/>
	);
}
