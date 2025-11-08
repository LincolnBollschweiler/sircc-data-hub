import { getAllUsers, getUserSites } from "@/userInteractions/db";
import { newUserColumns } from "./NewUserColumns";
import DataTable from "./DataTable";
import { User } from "@/drizzle/types";
import PageHeader from "../PageHeader";
import { Button } from "../ui/button";
import Link from "next/link";

export default async function NewUsers() {
	const sites = await getUserSites();
	const users = await getAllUsers();
	let newUsers = users.filter((user) => !user.accepted);
	newUsers = [...newUsers, ...newUsers, ...newUsers, ...newUsers]; // temp hack to show more data in table
	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Applicants">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable columns={newUserColumns} data={newUsers as Partial<User>[]} sites={sites} />
		</div>
	);
}
