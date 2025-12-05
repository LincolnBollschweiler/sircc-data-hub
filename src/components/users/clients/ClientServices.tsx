"use client";

import { Button } from "@/components/ui/button";
import { CSTables, Service } from "@/tableInteractions/db";
import ClientServicesDialog from "./ClientServicesDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import ClientServiceDialog from "./ClientServiceDialog";

export const ClientServices = ({ clientId, csTables }: { clientId: string; csTables: CSTables }) => {
	return (
		<ClientServicesDialog clientId={clientId} csTables={csTables}>
			<DialogTrigger asChild>
				<Button className="mr-1 inline">Add Service</Button>
			</DialogTrigger>
		</ClientServicesDialog>
	);
};

export const NewClientService = ({ clientId, services }: { clientId: string; services: Service[] }) => {
	return (
		<ClientServiceDialog clientId={clientId} services={services}>
			<DialogTrigger asChild>
				<Button className="mr-1">Request a Service</Button>
			</DialogTrigger>
		</ClientServiceDialog>
	);
};
