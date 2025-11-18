import { getAllUsers } from "@/userInteractions/db";
import DataTable from "./DataTable";
import { User } from "@/types";
import PageHeader from "../PageHeader";
import { Button } from "../ui/button";
import Link from "next/link";

export default async function Applicants({ userType }: { userType: string }) {
	const users = await getAllUsers();

	let applicants;
	let title = "";

	if (userType === "applicant") {
		applicants = users.filter((user) => user.accepted == null);
		title = "Applicants";
	} else {
		// rejected applicant
		applicants = users.filter((user) => user.accepted === false);
		title = "Rejected Applicants";
	}

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title={title}>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={applicants as Partial<User>[]} userType={userType} />
		</div>
	);
}
