import z from "zod";
import { SortableClientServicesList } from "./SortableClientServicesList";
import { clientServiceSchema, updateSchema } from "../../tableInteractions/schemas";

export default function ClientServices({
	items,
}: {
	items: (z.infer<typeof clientServiceSchema> & z.infer<typeof updateSchema>)[];
}) {
	return (
		<div className="w-full overflow-x-auto">
			<div className="min-w-[950px] max-w-[1920px] mx-auto">
				{/* Table header */}
				<div className="grid grid-cols-[24%,31%,10%,9%,9%,17%] border-b border-gray-300 bg-background-dark/80 py-2 text-xs font-semibold text-foreground lg:text-base">
					<div className="text-center">Name</div>
					<div className="text-center">Description</div>
					<div className="text-center">Funds Required</div>
					<div className="text-center">Created</div>
					<div className="text-center">Updated</div>
					<div></div>
				</div>

				{/* Table rows */}
				<SortableClientServicesList items={items} />
			</div>
		</div>
	);
}
