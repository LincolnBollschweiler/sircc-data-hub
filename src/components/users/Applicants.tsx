import { getAllUsers, getUserSites } from "@/userInteractions/db";
import { applicantsColumns } from "./ApplicantsColumns";
import DataTable from "./DataTable";
import { User } from "@/drizzle/types";
import PageHeader from "../PageHeader";
import { Button } from "../ui/button";
import Link from "next/link";

export default async function Applicants() {
	const sites = await getUserSites();
	const users = await getAllUsers();
	let applicants = users.filter((user) => !user.accepted);
	applicants = [...applicants, ...applicants, ...applicants, ...applicants]; // temp hack to show more data in table
	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Applicants">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable columns={applicantsColumns} data={applicants as Partial<User>[]} sites={sites} />
		</div>
	);
}
