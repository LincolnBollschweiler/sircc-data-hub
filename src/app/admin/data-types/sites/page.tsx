import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getSites } from "@/tableInteractions/db";
import Sites from "@/components/data-types/sites/Sites";
import SitesFormDialog from "@/components/data-types/sites/SitesFormDialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default async function SitesPage() {
	const sites = await getSites();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Sites">
				<SitesFormDialog>
					<DialogTrigger asChild>
						<Button>Add New Site</Button>
					</DialogTrigger>
				</SitesFormDialog>
			</PageHeader>

			<Sites items={sites} />
		</div>
	);
}
