// import { getAllUsers, getUserSites } from "@/userInteractions/db";
// import NewUsers from "@/components/users/NewUsers";

export default async function AdminPage() {
	return (
		<div className="container py-4">
			<h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
			<p>
				Welcome to the admin dashboard. Use the navigation above to manage coaches, clients, volunteers, and
				data types.
			</p>
			{/* <div className="mb-4">
				{newUsers.length} new users pending acceptance and {sites.length} sites in the system. //{" "}
			</div> */}
		</div>
	);
}
