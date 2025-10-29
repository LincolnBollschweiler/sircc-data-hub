import { cn } from "@/lib/utils";

export default function PageHeader({
	title,
	children,
	className,
}: {
	title: string;
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("mb-8 flex gap-4 items-center justify-between", className)}>
			<h1 className="text-2xl font-semibold">{title}</h1>
			{children && <div className="mt-2">{children}</div>}
		</div>
	);
}
