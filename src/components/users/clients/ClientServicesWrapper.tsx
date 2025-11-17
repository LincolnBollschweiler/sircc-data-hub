import {
	City,
	Service,
	Location,
	ReferralSource,
	ReferredOut,
	Visit,
	getCities,
	getServices,
	getLocations,
	getReferralSources,
	getReferredOut,
	getVisits,
} from "@/tableInteractions/db";
import ClientServices from "./ClientServices";

export default async function ClientServicesWrapper({ clientId }: { clientId: string }) {
	const services = await getServices();
	const locations = await getLocations();
	const referralSources = await getReferralSources();
	const referredOut = await getReferredOut();
	const visits = await getVisits();
	const cities = await getCities();
	// const sites = await getSites();

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
		<ClientServices
			clientId={clientId}
			newServiceProps={newServiceProps}
			// sites={sites as Site[]}
		/>
	);
}
