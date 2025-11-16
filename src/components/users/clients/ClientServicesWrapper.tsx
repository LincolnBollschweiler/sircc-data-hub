import {
	City,
	ClientService,
	Location,
	ReferralSource,
	ReferredOut,
	Visit,
	getCities,
	getClientServices,
	getLocations,
	getReferralSources,
	getReferredOut,
	getVisits,
} from "@/tableInteractions/db";
// import {
// 	ClientService,
// 	Location,
// 	ReferralSource,
// 	ReferredOut,
// 	Site,
// 	Visit,
// 	getClientServices,
// 	getLocations,
// 	getReferralSources,
// 	getReferredOut,
// 	getSites,
// 	getVisits,
// } from "@/tableInteractions/db";
import ClientServices from "./ClientServices";
import { ClientFull } from "@/userInteractions/db";

export default async function ClientServicesWrapper({ client }: { client: ClientFull["client"] }) {
	const services = await getClientServices();
	const locations = await getLocations();
	const referralSources = await getReferralSources();
	const referredOut = await getReferredOut();
	const visits = await getVisits();
	const cities = await getCities();
	// const sites = await getSites();

	return (
		<ClientServices
			client={client}
			services={services as ClientService[]}
			locations={locations as Location[]}
			referralSources={referralSources as ReferralSource[]}
			referredOut={referredOut as ReferredOut[]}
			visits={visits as Visit[]}
			cities={cities as City[]}
			// sites={sites as Site[]}
		/>
	);
}
