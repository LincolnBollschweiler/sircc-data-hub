"use client";

import { Button } from "@/components/ui/button";
import { City, ClientService, Location, ReferralSource, ReferredOut, Visit } from "@/tableInteractions/db";
import ClientServiceFormDialog from "./ClientServiceFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default function ClientServices({
	clientId,
	newServiceProps,
}: {
	clientId: string;
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
			<ClientServiceFormDialog clientId={clientId} newServiceProps={newServiceProps}>
				<DialogTrigger asChild>
					<Button>Add Service</Button>
				</DialogTrigger>
			</ClientServiceFormDialog>
		</div>
	);
}
