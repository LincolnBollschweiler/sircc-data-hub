import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Services from "@/components/data-types/clientServices/Services";
import { getServices } from "@/tableInteractions/db";
import ServiceFormDialog from "@/components/data-types/clientServices/ServiceFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";

export default async function ServicesPage() {
	const services = await getServices();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Client Services">
				<ServiceFormDialog>
					<DialogTrigger asChild>
						<Button>Add New Client Service</Button>
					</DialogTrigger>
				</ServiceFormDialog>
			</PageHeader>
			<Services items={services} />
		</div>
	);
}
