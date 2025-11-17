"use client";

import { Button } from "@/components/ui/button";
import { CSTables } from "@/tableInteractions/db";
import ClientServiceFormDialog from "./ClientServiceFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default function ClientServices({ clientId, csTables }: { clientId: string; csTables: CSTables }) {
	return (
		<div className="mt-6">
			<ClientServiceFormDialog clientId={clientId} csTables={csTables}>
				<DialogTrigger asChild>
					<Button>Add Service</Button>
				</DialogTrigger>
			</ClientServiceFormDialog>
		</div>
	);
}
