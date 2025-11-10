import { getAllUsers, getUserSites } from "@/userInteractions/db";
import { clientColumns } from "./ClientsColumns";
import { User } from "@/drizzle/types";
import PageHeader from "../PageHeader";
import { Button } from "../ui/button";
import Link from "next/link";
import DataTable from "./DataTable";

export default async function Clients() {
	const sites = await getUserSites();
	const users = await getAllUsers();
	const clients = users.filter((user) => user.role === "client" && user.accepted);
	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Clients" className="mb-0">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={clients as Partial<User>[]} sites={sites} />
		</div>
	);
}
