import { getAllUsers, getUserSites } from "@/userInteractions/db";
import DataTable from "./DataTable";
import { User } from "@/drizzle/types";
import PageHeader from "../PageHeader";
import { Button } from "../ui/button";
import Link from "next/link";

export default async function Applicants({ userType }: { userType?: string }) {
	const sites = await getUserSites();
	const users = await getAllUsers();
	const applicants = users.filter((user) => (!userType ? user.accepted == null : user.accepted === false));
	console.log("Applicants found:", applicants.length);

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title={userType === "rejected" ? "Rejected Applicants" : "Applicants"}>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={applicants as Partial<User>[]} sites={sites} userType={userType} />
		</div>
	);
}
