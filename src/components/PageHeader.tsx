import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export default function PageHeader({
	title,
	role,
	accepted,
	coachAuthorized,
	className,
	children,
}: {
	title: string;
	role?: string;
	accepted?: boolean | null;
	coachAuthorized?: boolean | null;
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<>
			{" "}
			<div className={cn("mb-8 flex gap-4 items-center justify-between", className)}>
				<h1 className="text-2xl font-semibold flex items-center gap-2">
					{title}
					{role && <Badge className="bg-black hover:bg-black">{role}</Badge>}
					{role && (accepted ? "" : <span className="text-sm text-muted">(Acceptance Pending ...)</span>)}
				</h1>
				{children && <div>{children}</div>}
			</div>
			<div>
				{role !== "Coach" ? (
					""
				) : (
					<div className="text-sm text-muted">
						{coachAuthorized ? "Authorized Coach" : "Not Yet Authorized"}
					</div>
				)}
			</div>
		</>
	);
}
