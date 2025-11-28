import { getAllVolunteers, VolunteerList } from "@/userInteractions/db";
import DataTable from "../DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Volunteers() {
	const volunteers = await getAllVolunteers();

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Volunteers">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={volunteers as VolunteerList[]} userType="volunteer" />
		</div>
	);
}
