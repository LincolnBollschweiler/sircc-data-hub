import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Services from "@/components/data-types/clientServices/Services";
import { getServices } from "@/tableInteractions/db";
import ServiceFormDialog from "@/components/data-types/clientServices/ServiceFormDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

export default async function ServicesPage() {
	const services = await getServices();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Client Services">
				<ServiceFormDialog>
					<DialogTrigger asChild>
						<Button className="mr-2">Add New Client Service</Button>
					</DialogTrigger>
				</ServiceFormDialog>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<Services items={services} />
		</div>
	);
}
