"use client";

import { ClientFull } from "@/userInteractions/db";
import { Button } from "@/components/ui/button";
import { City, ClientService, Location, ReferralSource, ReferredOut, Visit } from "@/tableInteractions/db";
import ClientServiceFormDialog from "./ClientServiceFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default function ClientServices({
	client,
	// clientServices,
	newServiceProps,
}: // sites,
{
	client: ClientFull["client"];
	// clientServices: ClientFull["clientService"][];
	newServiceProps: {
		services: ClientService[];
		locations: Location[];
		referralSources: ReferralSource[];
		referredOut: ReferredOut[];
		visits: Visit[];
		cities: City[];
	};
}) {
	return (
		<div className="mt-6">
			<ClientServiceFormDialog clientId={client?.id ? client.id : null} newServiceProps={newServiceProps}>
				<DialogTrigger asChild>
					<Button>Add Service</Button>
				</DialogTrigger>
			</ClientServiceFormDialog>
		</div>
	);
}
