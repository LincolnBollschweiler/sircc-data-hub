import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

export default function CoachesPage() {
	return (
		<div className="container py-4">
			<PageHeader title="Coaches">
				<Button asChild>
					<Link href="/admin/coaches/new">Add New Coach</Link>
				</Button>
			</PageHeader>
		</div>
	);
}
