import { SortableClientServicesList } from "./SortableClientServicesList";

export default function ClientServices({
	items,
}: {
	items: {
		id: string;
		name: string;
		description: string | null;
		dispersesFunds: boolean | null;
		createdAt: Date;
		updatedAt: Date;
	}[];
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
