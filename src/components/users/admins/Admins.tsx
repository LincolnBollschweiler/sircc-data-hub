import { Admins, getAllAdmins } from "@/userInteractions/db";
import DataTable from "../DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AllAdmins() {
	const admins = await getAllAdmins();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Admins">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={admins as Admins[]} userType="admin" />
		</div>
	);
}
