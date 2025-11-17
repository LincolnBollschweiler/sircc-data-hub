import { generalSchema, updateSchema } from "@/tableInteractions/schemas";
import { z } from "zod";
import { SortableCitiesList } from "./SortableCitiesList";

export default function Cities({ items }: { items: (z.infer<typeof generalSchema> & z.infer<typeof updateSchema>)[] }) {
	return (
		<div className="overflow-x-auto text-center">
			<div className="inline-block min-w-[700px] text-left">
				{/* Table header */}
				<div className="grid grid-cols-[50%,14%,14%,20%] data-types-header">
					<div className="pl-4">Name</div>
					<div className="text-center">Created</div>
					<div className="text-center">Updated</div>
					<div></div>
				</div>

				{/* Table rows */}
				<SortableCitiesList items={items} />
			</div>
		</div>
	);
}
