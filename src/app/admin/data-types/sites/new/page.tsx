import PageHeader from "@/components/PageHeader";
import SitesForm from "@/components/sites/SitesForm";

export default function NewSitesPage() {
	return (
		<div className="container py-4 max-w-2xl mx-auto">
			<PageHeader title="New Site" />
			<SitesForm />
		</div>
	);
}
