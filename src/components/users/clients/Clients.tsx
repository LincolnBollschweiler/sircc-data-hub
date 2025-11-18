import { ClientList, getAllClients } from "@/userInteractions/db";
import DataTable from "../DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Clients() {
	const clients = await getAllClients();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Clients">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={clients as ClientList[] & { siteId?: string | null }[]} userType="client" />
		</div>
	);
}
