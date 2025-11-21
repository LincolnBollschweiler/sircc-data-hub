import { CoachList, getAllCoaches } from "@/userInteractions/db";
import DataTable from "../DataTable";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTrainings } from "@/tableInteractions/db";

export default async function Coaches() {
	const [coaches, trainingsCount] = await Promise.all([
		getAllCoaches(),
		getTrainings().then((trainings) => trainings.length),
	]);

	return (
		<div className="container py-4 mx-auto">
			<PageHeader title="Coaches">
				<Button asChild>
					<Link href="/admin">Admin Dashboard</Link>
				</Button>
			</PageHeader>
			<DataTable data={coaches as CoachList[]} userType="coach" trainingsCount={trainingsCount} />
		</div>
	);
}
