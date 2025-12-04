import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { getVisits } from "@/tableInteractions/db";
import { DialogTrigger } from "@/components/ui/dialog";
import VisitsFormDialog from "@/components/data-types/visits/VisitsFormDialog";
import Visits from "@/components/data-types/visits/Visits";
import Link from "next/link";

export default async function VisitsPage() {
	const visits = await getVisits();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Visit Types">
				<VisitsFormDialog>
					<DialogTrigger asChild>
						<Button className="mr-2">Add New Visit Type</Button>
					</DialogTrigger>
				</VisitsFormDialog>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<Visits items={visits} />
		</div>
	);
}
