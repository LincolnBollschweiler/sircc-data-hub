import { getAllStaff, Staff } from "@/userInteractions/db";
import DataTable from "../DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AllStaff() {
	const staff = await getAllStaff();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Staff">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={staff as Staff[]} userType="staff" />
		</div>
	);
}
