"use client";

import { Button } from "@/components/ui/button";
import { CSTables } from "@/tableInteractions/db";
import ClientServiceFormDialog from "./ClientServiceFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default function ClientServices({ clientId, csTables }: { clientId: string; csTables: CSTables }) {
	return (
		<ClientServiceFormDialog clientId={clientId} csTables={csTables}>
			<DialogTrigger asChild>
				<Button className="mr-1">Add Service</Button>
			</DialogTrigger>
		</ClientServiceFormDialog>
	);
}
