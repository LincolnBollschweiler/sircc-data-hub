import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import ClientServices from "@/components/clientServices/ClientServices";
import { getClientServices } from "@/tableInteractions/db";
import ClientServiceFormDialog from "@/components/clientServices/ClientServiceFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default async function ClientServicesPage() {
	const clientServices = await getClientServices();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Client Services">
				<ClientServiceFormDialog>
					<DialogTrigger asChild>
						<Button>Add New Client Service</Button>
					</DialogTrigger>
				</ClientServiceFormDialog>
			</PageHeader>
			<ClientServices items={clientServices} />
		</div>
	);
}
