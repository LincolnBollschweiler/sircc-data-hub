import { DialogTrigger } from "@/components/ui/dialog";
import UserFormDialog from "@/components/users/assignRole/UserFormDialog";

export default async function AdminPage() {
	return (
		<div className="container py-4">
			<h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
			<p>
				Welcome to the admin dashboard. Use the navigation above to manage coaches, clients, volunteers, and
				data types.
			</p>
			<UserFormDialog>
				<DialogTrigger asChild>
					<button className="btn-primary">Add New User</button>
				</DialogTrigger>
			</UserFormDialog>
		</div>
	);
}
