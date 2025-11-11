import { getAllUsers, getUserSites } from "@/userInteractions/db";
import DataTable from "./DataTable";
import { User } from "@/drizzle/types";
import PageHeader from "../PageHeader";
import { Button } from "../ui/button";
import Link from "next/link";

export default async function Applicants({ userType }: { userType: string }) {
	const sites = await getUserSites();
	const users = await getAllUsers();

	let applicants;
	let title = "";
	switch (userType) {
		case "applicant":
			applicants = users.filter((user) => user.accepted == null);
			title = "Applicants";
			break;
		case "rejected":
			applicants = users.filter((user) => user.accepted === false);
			title = "Rejected Applicants";
			break;
		case "client":
			applicants = users.filter(
				(user) => (user.role === "client" || user.role === "client-volunteer") && user.accepted
			);
			title = "Clients";
			break;
		case "volunteer":
			applicants = users.filter(
				(user) => (user.role === "volunteer" || user.role === "client-volunteer") && user.accepted
			);
			title = "Volunteers";
			break;
		// case "staff": applicants = users.filter((user) => user.role === "staff" && user.accepted); break;
		case "coach":
			applicants = users.filter((user) => user.role === "coach" && user.accepted);
			title = "Coaches";
			break;
		case "admin":
			applicants = users.filter((user) => user.role === "admin" && user.accepted);
			title = "Admins";
			break;
		default:
			applicants = users;
	}

	console.log(`${userType} found:`, applicants.length);

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title={title}>
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={applicants as Partial<User>[]} sites={sites} userType={userType} />
		</div>
	);
}
