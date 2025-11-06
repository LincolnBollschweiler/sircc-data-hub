import z from "zod";
import { SortableCoachTrainingsList } from "./SortableCoachTrainingsList";
import { generalSchema, updateSchema } from "@/tableInteractions/schemas";

export default function CoachTrainings({
	items,
}: {
	items: (z.infer<typeof generalSchema> & z.infer<typeof updateSchema>)[];
}) {
	return (
		<div className="w-full overflow-x-auto">
			<div className="min-w-[950px] max-w-[1920px] mx-auto">
				{/* Table header */}
				<div className="grid grid-cols-[30%,38%,9%,9%,14%] border-b border-gray-300 bg-background-dark/80 py-2 text-xs font-semibold text-foreground lg:text-base">
					<div className="text-center">Name</div>
					<div className="text-center">Description</div>
					<div className="text-center">Created</div>
					<div className="text-center">Updated</div>
					<div></div>
				</div>
				<SortableCoachTrainingsList items={items} />
			</div>
		</div>
	);
}
