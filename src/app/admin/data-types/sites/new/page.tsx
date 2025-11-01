import PageHeader from "@/components/PageHeader";
import SitesForm from "@/components/sites/SitesForm";

export default function NewSitesPage() {
	return (
		<div className="container mt-4 py-4 px-6 max-w-2xl mx-auto bg-background-light rounded-md shadow-md">
			<PageHeader title="New Site" />
			<SitesForm />
		</div>
	);
}
