import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export default function PageHeader({
	title,
	role,
	children,
	className,
}: {
	title: string;
	role?: string;
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("mb-8 flex gap-4 items-center justify-between", className)}>
			<h1 className="text-2xl font-semibold flex items-center gap-2">
				{title}
				{role && <Badge className="bg-black hover:bg-black">{role}</Badge>}
			</h1>
			{children && <div>{children}</div>}
		</div>
	);
}
