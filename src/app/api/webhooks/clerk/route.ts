import { env } from "@/data/env/server";
import { deleteUser, insertUser, updateUser } from "@/userInteractions/db";
import { syncClerkUserMetadata } from "@/services/clerk";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
	const headerPayload = await headers();
	const svixId = headerPayload.get("svix-id");
	const svixTimestamp = headerPayload.get("svix-timestamp");
	const svixSignature = headerPayload.get("svix-signature");

	if (!svixId || !svixTimestamp || !svixSignature) {
		return new Response("Error occurred -- no svix headers", {
			status: 400,
		});
	}

	const payload = await req.json();
	const body = JSON.stringify(payload);

	const webHook = new Webhook(env.CLERK_WEBHOOK_SECRET);
	let event: WebhookEvent;

	try {
		event = webHook.verify(body, {
			"svix-id": svixId,
			"svix-timestamp": svixTimestamp,
			"svix-signature": svixSignature,
		}) as WebhookEvent;
	} catch {
		return new Response("Error occurred", {
			status: 400,
		});
	}

	switch (event.type) {
		case "user.created":
		case "user.updated": {
			const email = event.data.email_addresses.find(
				(email) => email.id === event.data.primary_email_address_id
			)?.email_address;
			const firstName = `${event.data.first_name}`.trim();
			const lastName = `${event.data.last_name}`.trim();

			if (email == null) return new Response("No email", { status: 400 });
			if (firstName === "") return new Response("No first name", { status: 400 });
			if (lastName === "") return new Response("No last name", { status: 400 });

			if (event.type === "user.created") {
				// console.log("User created webhook received for:", email);
				const user = await insertUser({
					clerkUserId: event.data.id,
					firstName,
					lastName,
					email,
					photoUrl: event.data.image_url ?? "",
					role: "client",
				});

				await syncClerkUserMetadata(user);
			} else {
				// console.log("User updated webhook received for:", email);
				await updateUser(
					{ clerkUserId: event.data.id },
					{
						email,
						firstName,
						lastName,
						photoUrl: event.data.image_url ?? "",
						role: event.data.public_metadata.role,
					}
				);
			}
			break;
		}
		case "user.deleted": {
			// console.log("User deleted webhook received for:", event.data.id);
			if (event.data.id != null) {
				await deleteUser({ clerkUserId: event.data.id });
			}
			break;
		}
	}

	return new Response("", { status: 200 });
}
