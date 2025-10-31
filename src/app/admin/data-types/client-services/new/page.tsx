import PageHeader from "@/components/PageHeader";
import ClientServiceForm from "@/components/clientServices/ClientServiceForm";

export default function NewClientServicesPage() {
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="New Client Service" />
			<ClientServiceForm />
		</div>
	);
}
