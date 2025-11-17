import { generalSchema, updateSchema } from "@/tableInteractions/schemas";
import { SortableVolunteerTypesList } from "./SortableVolunteerTypesList";
import { z } from "zod";

export default function VolunteerTypes({
	items,
}: {
	items: (z.infer<typeof generalSchema> & z.infer<typeof updateSchema>)[];
}) {
	return (
		<div className="overflow-x-auto text-center">
			<div className="inline-block min-w-[950px] sm:min-w-[1150px] text-left">
				{/* Table header */}
				<div className="grid grid-cols-[30%,38%,9%,9%,14%] data-types-header">
					<div className="pl-4">Name</div>
					<div className="px-1">Description</div>
					<div className="text-center">Created</div>
					<div className="text-center">Updated</div>
					<div></div>
				</div>

				{/* Table rows */}
				<SortableVolunteerTypesList items={items} />
			</div>
		</div>
	);
}
