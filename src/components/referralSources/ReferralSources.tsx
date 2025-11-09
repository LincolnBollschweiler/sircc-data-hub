import { generalSchema, updateSchema } from "@/tableInteractions/schemas";
import { SortableReferralSourcesList } from "./SortableReferralSourcesList";
import z from "zod";

export default function ReferralSources({
	items,
}: {
	items: (z.infer<typeof generalSchema> & z.infer<typeof updateSchema>)[];
}) {
	return (
		<div className="w-full overflow-x-auto">
			<div className="min-w-[950px] max-w-[1920px] mx-auto">
				{/* Table header */}
				<div className="grid grid-cols-[30%,38%,9%,9%,14%] data-types-header">
					<div className="pl-4">Name</div>
					<div className="px-1">Description</div>
					<div className="text-center">Created</div>
					<div className="text-center">Updated</div>
					<div></div>
				</div>

				{/* Table rows */}
				<SortableReferralSourcesList items={items} />
			</div>
		</div>
	);
}
