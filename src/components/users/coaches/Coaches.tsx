import { CoachList, getAllCoaches } from "@/userInteractions/db";
import DataTable from "../DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Coaches() {
	const coaches = await getAllCoaches();
	// console.log(coaches);

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Coaches">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={coaches as CoachList[]} userType="coach" />
		</div>
	);
}
