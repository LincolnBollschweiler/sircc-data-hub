import { siteSchema, updateSchema } from "@/tableInteractions/schemas";
import { SortableSitesList } from "./SortableSitesList";
import z from "zod";

export default function Sites({ items }: { items: (z.infer<typeof siteSchema> & z.infer<typeof updateSchema>)[] }) {
	return (
		<div className="overflow-x-auto text-center">
			<div className="inline-block min-w-[950px] sm:min-w-[1150px] text-left">
				{/* Table header */}
				<div className="grid grid-cols-[20%,36%,12%,9%,9%,14%] data-types-header">
					<div className="pl-4">Name</div>
					<div className="px-1">Address</div>
					<div className="text-center">Phone</div>
					<div className="text-center">Created</div>
					<div className="text-center">Updated</div>
					<div></div>
				</div>

				{/* Table rows */}
				<SortableSitesList items={items} />
			</div>
		</div>
	);
}
