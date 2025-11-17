"use client";

import { Button } from "@/components/ui/button";
import { City, Service, Location, ReferralSource, ReferredOut, Visit } from "@/tableInteractions/db";
import ClientServiceFormDialog from "./ClientServiceFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default function ClientServices({
	clientId,
	newServiceProps,
}: {
	clientId: string;
	newServiceProps: {
		services: Service[];
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
