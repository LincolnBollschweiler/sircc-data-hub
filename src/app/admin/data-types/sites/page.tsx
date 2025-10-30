import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { getSites } from "@/tableInteractions/db";
import Sites from "@/components/sites/Sites";

export default async function SitesPage() {
	const sites = await getSites();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Sites">
				<Button asChild>
					<Link href="/admin/data-types/sites/new">Add New Site</Link>
				</Button>
			</PageHeader>

			<Sites items={sites} />
		</div>
	);
}
