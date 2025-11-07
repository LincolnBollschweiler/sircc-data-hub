import { getAllUsers, getUserSites } from "@/userInteractions/db";
import { User } from "@/drizzle/types";

export default async function AdminPage() {
	const sites = await getUserSites();
	const users = await getAllUsers();

	return (
		<div className="container py-4">
			<h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
			<p>
				Welcome to the admin dashboard. Use the navigation above to manage coaches, clients, volunteers, and
				data types.
			</p>
			<div className="mt-6">
				{users.length} users and {sites.length} sites in the system.
			</div>
			<NewUsers users={users} />
		</div>
	);
}

const NewUsers = ({ users }: { users: User[] }) => {
	return (
		<div>
			<h2 className="text-xl font-bold mb-2">New Users</h2>
			<ul>
				{users.map((user) => (
					<li key={user.id}>{user.email}</li>
				))}
			</ul>
		</div>
	);
};
