import PageHeader from "@/components/PageHeader";
import ClientServiceForm from "@/components/ClientServiceForm";

export default function NewClientServicesPage() {
	return (
		<div className="container py-4">
			<PageHeader title="New Client Service" />
			<ClientServiceForm />
		</div>
	);
}
