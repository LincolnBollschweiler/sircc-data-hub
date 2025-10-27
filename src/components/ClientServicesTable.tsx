import Link from "next/link";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { FilePenLineIcon, Trash2Icon } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { removeClientService } from "@/tableInteractions/actions";

export default function ClientServicesTable({
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
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Description</TableHead>
					<TableHead>Disperses Funds</TableHead>
					<TableHead>Created</TableHead>
					<TableHead>Updated</TableHead>
					<TableHead></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{items.map((item) => (
					<TableRow key={item.id}>
						<TableCell>{item.name}</TableCell>
						<TableCell>{item.description}</TableCell>
						<TableCell>{item.dispersesFunds ? "Yes" : "No"}</TableCell>
						<TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
						<TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
						<TableCell>
							<div className="flex gap-2">
								<Button asChild className="w-fit text-center">
									<Link href={`/admin/data-types/client-services/${item.id}/edit`} className="w-full">
										<FilePenLineIcon />
										<span className="sr-only">Edit</span>
									</Link>
								</Button>
								<ActionButton
									variant={"destructiveOutline"}
									action={removeClientService.bind(null, item.id)}
									requireAreYouSure={true}
								>
									<Trash2Icon />
									<span className="sr-only">Delete</span>
								</ActionButton>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
