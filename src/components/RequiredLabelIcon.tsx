import { AsteriskIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export default function RequiredLabelIcon({ className, ...props }: ComponentPropsWithoutRef<typeof AsteriskIcon>) {
	return <AsteriskIcon className={cn("text-destructive size-3 align-top inline", className)} {...props} />;
}
