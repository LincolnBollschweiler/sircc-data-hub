import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export default function GeneralTable({ items }: { items: any[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Description</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((item) => (
					<TableRow key={item.id}>
						<TableCell>{item.name}</TableCell>
						<TableCell>{item.description}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
