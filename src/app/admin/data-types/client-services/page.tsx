import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function ClientServicesPage() {
	return (
		<div className="container py-4">
			<PageHeader title="Client Services">
				<Button asChild>
					<Link href="/admin/data-types/client-services/new">Add New Client Service</Link>
				</Button>
			</PageHeader>
		</div>
	);
}
