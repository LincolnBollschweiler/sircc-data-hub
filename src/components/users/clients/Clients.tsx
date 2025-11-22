import { ClientList, getAllClients } from "@/userInteractions/db";
import DataTable from "../DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getReentryChecklistItems } from "@/tableInteractions/db";

export default async function Clients() {
	const [clients, checkListCount] = await Promise.all([
		getAllClients(),
		getReentryChecklistItems().then((items) => items.length),
	]);

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Clients">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={clients as ClientList[]} userType="client" checkListCount={checkListCount} />
		</div>
	);
}
