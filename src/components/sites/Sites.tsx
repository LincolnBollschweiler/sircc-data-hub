import { SortableSitesList } from "./SortableSitesList";

export default function Sites({
	items,
}: {
	items: {
		id: string;
		name: string;
		address: string;
		phone: string;
		createdAt: Date;
		updatedAt: Date;
	}[];
}) {
	return (
		<div className="w-full overflow-x-auto">
			<div className="min-w-[950px] max-w-[1920px] mx-auto">
				{/* Table header */}
				<div className="grid grid-cols-[24%,36%,8%,9%,9%,14%] items-end border-b border-gray-300 bg-gray-100 py-2 text-xs font-semibold text-gray-700 lg:text-base">
					<div className="text-center">Name</div>
					<div className="text-center">Address</div>
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
