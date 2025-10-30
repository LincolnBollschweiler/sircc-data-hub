import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DataTypesPage() {
	return (
		<div className="container py-4">
			<h1 className="text-2xl font-semibold">Data Types</h1>
			<div className="mt-4 flex flex-wrap gap-4 w-full max-w-[100%]">
				<Button asChild>
					<Link className="mx-auto" href={"/admin/data-types/client-services"}>
						Client Services
					</Link>
				</Button>
				<Button asChild>
					<Link className="mx-auto" href={"/admin/data-types/reentry-checklist-items"}>
						Reentry Checklist Items
					</Link>
				</Button>
				<Button asChild>
					<Link className="mx-auto" href={"/admin/data-types/volunteer-types"}>
						Volunteer Types
					</Link>
				</Button>
				<Button asChild>
					<Link className="mx-auto" href={"/admin/data-types/coach-trainings"}>
						Coach Trainings
					</Link>
				</Button>
				<Button asChild>
					<Link className="mx-auto" href={"/admin/data-types/referral-sources"}>
						Referral Sources
					</Link>
				</Button>{" "}
				<Button asChild>
					<Link className="mx-auto" href={"/admin/data-types/locations"}>
						Locations
					</Link>
				</Button>
				<Button asChild>
					<Link className="mx-auto" href={"/admin/data-types/sites"}>
						Sites
					</Link>
				</Button>
			</div>
		</div>
	);
}
