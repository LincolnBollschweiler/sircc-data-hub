import { z } from "zod";
import { SortableServicesList } from "./SortableServicesList";
import { servicesSchema, updateSchema } from "../../../tableInteractions/schemas";

export default function Services({
	items,
}: {
	items: (z.infer<typeof servicesSchema> & z.infer<typeof updateSchema>)[];
}) {
	return (
		<div className="overflow-x-auto text-center">
			<div className="inline-block min-w-[950px] sm:min-w-[1150px] text-left">
				{/* Table header */}
				<div className="grid grid-cols-[24%,31%,10%,9%,9%,17%] data-types-header">
					<div className="pl-4">Name</div>
					<div className="px-1">Description</div>
					<div className="text-center">Funds Required</div>
					<div className="text-center">Created</div>
					<div className="text-center">Updated</div>
					<div></div>
				</div>

				{/* Table rows */}
				<SortableServicesList items={items} />
			</div>
		</div>
	);
}
