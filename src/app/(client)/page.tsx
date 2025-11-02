import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Profile from "@/components/users/Profile";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
	return (
		<SignedIn>
			<div className="container flex gap-3">
				<Profile />
				<div className="flex-grow flex-shrink container mt-4 py-4 px-6 bg-background-light rounded-md shadow-md">
					<PageHeader title="Your Client Services">
						<Button asChild>
							<Link href="/request-client-services">Request</Link>
						</Button>
					</PageHeader>
					<p>Welcome to your client services page!</p>
				</div>
			</div>
		</SignedIn>
	);
}
