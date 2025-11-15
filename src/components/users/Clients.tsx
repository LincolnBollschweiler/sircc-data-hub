import { ClientList, getAllClients, getUserSites } from "@/userInteractions/db";
import DataTable from "./DataTable";
import PageHeader from "../PageHeader";
import { Button } from "../ui/button";
import Link from "next/link";

export default async function Clients() {
	const sites = await getUserSites();
	const clients = await getAllClients();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Clients">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={clients as ClientList[] & { siteId?: string | null }[]} sites={sites} userType="client" />
		</div>
	);
}
