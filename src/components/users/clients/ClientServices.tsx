"use client";

import { ClientFull } from "@/userInteractions/db";
import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { ClientService, Location, ReferralSource, ReferredOut, Site, Visit } from "@/tableInteractions/db";
import { City, ClientService, Location, ReferralSource, ReferredOut, Visit } from "@/tableInteractions/db";
import { ClientCombobox } from "./ClientCombobox";

export default function ClientServices({
	client,
	// clientServices,
	services,
	locations,
	referralSources,
	referredOut,
	visits,
	cities,
}: // sites,
{
	client: ClientFull["client"];
	// clientServices: ClientFull["clientService"][];
	services: ClientService[];
	locations: Location[];
	referralSources: ReferralSource[];
	referredOut: ReferredOut[];
	visits: Visit[];
	cities: City[];
	// sites: Site[];
}) {
	const [serviceValue, setServiceValue] = useState<string | null>(null);
	const [locationValue, setLocationValue] = useState<string | null>(null);
	const [cityValue, setCityValue] = useState<string | null>(null);
	const [referralSourceValue, setReferralSourceValue] = useState<string | null>(null);
	const [referredOutValue, setReferredOutValue] = useState<string | null>(null);
	const [visitValue, setVisitValue] = useState<string | null>(null);
	// const [siteValue, setSiteValue] = useState<string | null>(null);

	const [newServiceVisible, setNewServiceVisible] = useState(false);

	const handleAddService = () => {
		setNewServiceVisible(!newServiceVisible);
	};

	return (
		<div className="mt-6">
			{client && <h2 className="text-2xl font-semibold mb-4">Services for Client ID: {client.id}</h2>}
			<Button onClick={handleAddService}>Add Service</Button>
			{newServiceVisible && (
				<div>
					<p>Service addition form goes here.</p>

					<ClientCombobox
						label="Select Service"
						items={services}
						value={serviceValue}
						onChange={setServiceValue}
					/>
					<ClientCombobox label="Select City" items={cities} value={cityValue} onChange={setCityValue} />
					<ClientCombobox
						label="Select Location"
						items={locations}
						value={locationValue}
						onChange={setLocationValue}
					/>
					<ClientCombobox
						label="Select Referral Source"
						items={referralSources}
						value={referralSourceValue}
						onChange={setReferralSourceValue}
					/>
					<ClientCombobox
						label="Select Referred Out"
						items={referredOut}
						value={referredOutValue}
						onChange={setReferredOutValue}
					/>
					<ClientCombobox label="Select Visit" items={visits} value={visitValue} onChange={setVisitValue} />
					{/* <ClientCombobox label="Select Site" items={sites} value={siteValue} onChange={setSiteValue} /> */}
				</div>
			)}
		</div>
	);
}
