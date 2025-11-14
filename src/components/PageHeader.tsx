import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export default function PageHeader({
	title,
	role,
	accepted,
	className,
	children,
}: {
	title: string;
	role?: string;
	accepted?: boolean | null;
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<>
			<div className={cn("mb-8 flex gap-4 items-center justify-between", className)}>
				<h1 className="text-2xl font-semibold flex items-center gap-2">
					{title}
					{role && (
						<Badge className="bg-foreground text-background-dark  hover:bg-foreground h-5">{role}</Badge>
					)}
					{role &&
						(accepted ? (
							""
						) : (
							<span className="text-xs sm:text-sm text-muted">(Acceptance Pending ...)</span>
						))}
				</h1>
				{children && <div>{children}</div>}
			</div>
		</>
	);
}
