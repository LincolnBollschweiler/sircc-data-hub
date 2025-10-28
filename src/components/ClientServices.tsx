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
				<div className="grid grid-cols-[40px,27%,32%,7%,8%,8%,18%] items-center gap-3 border-b border-gray-300 bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 lg:text-base">
					<div className="text-center"></div>
					<div>Name</div>
					<div>Description</div>
					<div>Funds</div>
					<div>Created</div>
					<div>Updated</div>
					<div className="text-right"></div>
				</div>

				{/* Table rows */}
				<SortableClientServicesList items={items} />
			</div>
		</div>
	);
}
