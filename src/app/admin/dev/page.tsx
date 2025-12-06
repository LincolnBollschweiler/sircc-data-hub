// @ts-nocheck
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createNewTheme } from "@/utils/createNewTheme";
import {
	deleteAllContacts,
	deleteAllCity,
	deleteAllLocation,
	deleteAllReentryChecklistItem,
	deleteAllReferralSource,
	deleteAllReferredOut,
	deleteAllService,
	deleteAllUser,
	deleteAllVisit,
	deleteAllVolunteerTypes,
	insertClerkUserDev,
	createCity,
	createLocation,
	createReferralSource,
	createReferredOut,
	createService,
	createVisit,
	createVolunteerType,
	createUser,
	addClientService,
	deleteAllClientService,
	deleteAllClient,
	createReentryChecklistItem,
	insertContact,
} from "@/tableInteractions/adminActions";
import { revalidatAllCaches } from "@/tableInteractions/cache";
import Papa from "papaparse";
import { queryUserById } from "@/userInteractions/actions";

export default function Dev() {
	const iamsajidThemeInputText = `
        :root {
  /* hsl (fallback color) */
  --bg-dark: hsl(216 24% 1%);
  --bg: hsl(214 15% 5%);
  --bg-light: hsl(214 8% 9%);
  --text: hsl(214 47% 95%);
  --text-muted: hsl(214 7% 70%);
  --highlight: hsl(214 5% 39%);
  --border: hsl(214 6% 28%);
  --border-muted: hsl(214 9% 18%);
  --primary: hsl(214 78% 73%);
  --secondary: hsl(35 58% 62%);
  --danger: hsl(9 26% 64%);
  --warning: hsl(52 19% 57%);
  --success: hsl(146 17% 59%);
  --info: hsl(217 28% 65%);
  /* oklch */
  --bg-dark: oklch(0.1 0.005 255);
  --bg: oklch(0.15 0.005 255);
  --bg-light: oklch(0.2 0.005 255);
  --text: oklch(0.96 0.01 255);
  --text-muted: oklch(0.76 0.01 255);
  --highlight: oklch(0.5 0.01 255);
  --border: oklch(0.4 0.01 255);
  --border-muted: oklch(0.3 0.01 255);
  --primary: oklch(0.76 0.1 255);
  --secondary: oklch(0.76 0.1 75);
  --danger: oklch(0.7 0.05 30);
  --warning: oklch(0.7 0.05 100);
  --success: oklch(0.7 0.05 160);
  --info: oklch(0.7 0.05 260);
}
body.light {
  /* hsl (fallback color) */
  --bg-dark: hsl(214 11% 90%);
  --bg: hsl(214 22% 95%);
  --bg-light: hsl(214 100% 100%);
  --text: hsl(214 29% 5%);
  --text-muted: hsl(214 6% 28%);
  --highlight: hsl(214 100% 100%);
  --border: hsl(214 4% 51%);
  --border-muted: hsl(214 5% 63%);
  --primary: hsl(213 62% 30%);
  --secondary: hsl(40 100% 16%);
  --danger: hsl(9 21% 41%);
  --warning: hsl(52 23% 34%);
  --success: hsl(147 19% 36%);
  --info: hsl(217 22% 41%);
  /* oklch */
  --bg-dark: oklch(0.92 0.005 255);
  --bg: oklch(0.96 0.005 255);
  --bg-light: oklch(1 0.005 255);
  --text: oklch(0.15 0.01 255);
  --text-muted: oklch(0.4 0.01 255);
  --highlight: oklch(1 0.01 255);
  --border: oklch(0.6 0.01 255);
  --border-muted: oklch(0.7 0.01 255);
  --primary: oklch(0.4 0.1 255);
  --secondary: oklch(0.4 0.1 75);
  --danger: oklch(0.5 0.05 30);
  --warning: oklch(0.5 0.05 100);
  --success: oklch(0.5 0.05 160);
  --info: oklch(0.5 0.05 260);
}`;

	const process = () => createNewTheme(iamsajidThemeInputText);

	const loadInClients = async () => await loadClients();
	const loadInContacts = async () => await loadContacts();
	const loadOther = async () => await loadNonClientPageData();
	const revalidate = async () => await revalidateAllPages();

	return (
		<main className="container py-6">
			<h1 className="text-3xl font-bold mb-4">Developer Page</h1>
			<p>Welcome to the developer admin page. Here you can access developer-specific tools and settings.</p>
			<hr className="my-6" />
			<section>
				<h2 className="text-2xl font-semibold mb-2">Developer Tools</h2>
				<section className="m-4">
					<h3 className="text-xl font-semibold">Create New shadcn Tailwind Theme</h3>
					<div className="mb-2">(You must be running the code from a localhost dev session.)</div>
					<div>
						<span className="font-semibold">Step 1: </span>
						<span>Go to </span>
						<Link
							className="text-blue-500 underline"
							href="https://www.iamsajid.com/ui-colors"
							target="_blank"
							rel="noreferrer"
						>
							https://www.iamsajid.com/ui-colors/
						</Link>
					</div>
					<div>
						<span className="font-semibold">Step 2: </span>
						<span>Generate a new shadcn tailwind theme by using the UI interface.</span>
					</div>
					<div>
						<span className="font-semibold">Step 3: </span>
						<span>Click &apos;Show Code&apos;, change dropdown to &apos;Theme&apos;, and copy.</span>
					</div>
					<div>
						<span className="font-semibold">Step 4: </span>
						<span>
							Go to the file src\app\admin\dev\page.tsx and paste the ouput into the
							&quot;iamsajidThemeInputText&quot; variable.
						</span>
					</div>
					<div>
						<span className="font-semibold">Step 5: </span>
						<Button onClick={process}>Create shadcn Tailwind theme</Button>
					</div>
					<div>
						<span className="font-semibold">Step 6: </span>Check the devTools console log for the output.
					</div>
					<div>
						<span className="font-semibold">Step 7: </span>Copy the light and dark theme outputs into the
						src/app/globals.css file under the :root and .dark sections respectively.
					</div>
				</section>
			</section>
			<section>
				<h2 className="text-2xl font-semibold mb-2">Parse CSV</h2>
				<Button onClick={loadInClients}>Load in Clients and Client Data Types</Button>
			</section>
			<section>
				<h2 className="text-2xl font-semibold mb-2">Parse CSV</h2>
				<Button onClick={loadInContacts}>Load in Contacts</Button>
			</section>
			<section>
				<h2 className="text-2xl font-semibold mb-2">Load Non-Client Page Data</h2>
				<Button onClick={loadOther}>Load in Non-Client Page Data</Button>
			</section>
			<section>
				<h2 className="text-2xl font-semibold mb-2">Revalidate</h2>
				<Button onClick={revalidate}>Revalidate All Pages</Button>
			</section>
		</main>
	);
}

const revalidateAllPages = async () => {
	revalidatAllCaches();
};

const loadNonClientPageData = async () => {
	return;
	const [reentry, volunteer] = await Promise.all([
		fetch(`/temp-load-in/reentryCheckListItem.csv`),
		fetch(`/temp-load-in/volunteeringType.csv`),
	]);

	const reentryText = await reentry.text();
	const volunteerText = await volunteer.text();

	const reentryItems = reentryText
		.split(",")
		.map((item) => item.trim())
		.sort();
	const volunteerItems = volunteerText
		.split(",")
		.map((item) => item.trim())
		.sort();

	await deleteAllFromDb("reentryCheckListItem");
	await deleteAllFromDb("volunteeringType");
	for (const item of reentryItems) {
		await addToDb("reentryCheckListItem", item);
	}
	for (const item of volunteerItems) {
		await addToDb("volunteeringType", item);
	}
};

const deleteAllFromDb = async (type: string) => {
	let deleteAction;
	switch (type) {
		case "user":
			deleteAction = deleteAllClientService;
			await deleteAction();
			deleteAction = deleteAllClient;
			await deleteAction();
			deleteAction = deleteAllUser;
			await deleteAction();
			break;
		case "city":
			deleteAction = deleteAllCity;
			await deleteAction();
			break;
		case "visit":
			deleteAction = deleteAllVisit;
			await deleteAction();
			break;
		case "location":
			deleteAction = deleteAllLocation;
			await deleteAction();
			break;
		case "service":
			deleteAction = deleteAllService;
			await deleteAction();
			break;
		case "reentryCheckListItem":
			deleteAction = deleteAllReentryChecklistItem;
			await deleteAction();
			break;
		case "referralSource":
			deleteAction = deleteAllReferralSource;
			await deleteAction();
			break;
		case "referredOut":
			deleteAction = deleteAllReferredOut;
			await deleteAction();
			break;
		case "volunteeringType":
			deleteAction = deleteAllVolunteerTypes;
			await deleteAction();
			break;
		case "contacts":
			deleteAction = deleteAllContacts;
			await deleteAction();
			break;
		default:
			console.warn(`No action defined for type: ${name}`);
			return;
	}
};

const addDataToDb = async (type: string, data: any) => {
	let action;
	switch (type) {
		case "user":
			action = insertClerkUserDev;
			await action(data);
			break;
		default:
			console.warn(`No action defined for type: ${name}`);
			return;
	}
};

const addToDb = async (type: string, name: string) => {
	const requiresFunding = ["Gas Voucher", "Laundry Voucher", "Phone"];
	let action;
	switch (type) {
		case "city":
			action = createCity;
			return await action({ name });
			break;
		case "visit":
			action = createVisit;
			return await action({ name });
			break;
		case "location":
			action = createLocation;
			return await action({ name, description: "" });
			break;
		case "service":
			action = createService;
			return await action({ name, description: "", requiresFunding: requiresFunding.includes(name) });
			break;
		case "referralSource":
			action = createReferralSource;
			return await action({ name, description: "" });
			break;
		case "referredOut":
			action = createReferredOut;
			return await action({ name, description: "" });
			break;
		case "volunteeringType":
			action = createVolunteerType;
			return await action({ name, description: "" });
			break;
		case "volunteeringType":
			action = createVolunteerType;
			return await action({ name, description: "" });
			break;
		case "reentryCheckListItem":
			action = createReentryChecklistItem;
			return await action({ name, description: "" });
			break;
		default:
			console.warn(`No action defined for type: ${name}`);
			return;
	}
};

const lookup = {};

/* tslint:disable */
const addUniqueColumnData = async (data) => {
	const uniqueValueColumns = ["city", "location", "referralSource", "referredOut", "visit"];
	// const uniqueValueColumns = ["city"];
	uniqueValueColumns.forEach((col) => {
		const values = data.map((row: any) => row[col]).filter((value: string) => value && value.trim().length > 0);
		const uniqueValues = Array.from(new Set(values)).sort();
		const realUnique = Array.from(new Set(uniqueValues.map((v) => v.trim()))).sort();
		deleteAllFromDb(col);
		realUnique.forEach(async (value) => {
			const id = await addToDb(col, value);
			if (!lookup[col]) {
				lookup[col] = {};
			}
			lookup[col][value] = id;
		});
	});
};

const addDuplicateColumnData = async (data) => {
	const duplicateColumns = ["requestedService", "providedService"];
	const duplicates = [];
	duplicateColumns.forEach((col) => {
		const values = data.map((row: any) => row[col]).filter((value: string) => value && value.trim().length > 0);
		const uniqueValues = Array.from(new Set(values)).sort();
		duplicates.push(uniqueValues);
	});

	const combinedDuplicates = Array.from(new Set(duplicates.flat())).sort();
	deleteAllFromDb("service");
	combinedDuplicates.forEach(async (value) => {
		const id = await addToDb("service", value);
		if (!lookup["service"]) {
			lookup["service"] = {};
		}
		lookup["service"][value] = id;
	});
};

const addUserData = async (data) => {
	// filter out any entries without firstName, createdAt, and providedService or success
	data = data.filter((row: any) => row.firstName && row.createdAt && (row.providedService || row.success));
	// set any missing lastName to "Unknown"
	data.forEach((row: any) => {
		if (!row.lastName || row.lastName.trim().length === 0) {
			row.lastName = "Unknown";
		}
	});
	// sort by lastName, firstName, phone
	data.sort((a: any, b: any) => {
		if (a.lastName < b.lastName) return -1;
		if (a.lastName > b.lastName) return 1;
		if (a.firstName < b.firstName) return -1;
		if (a.firstName > b.firstName) return 1;
		if (a.phone < b.phone) return -1;
		if (a.phone > b.phone) return 1;
		return 0;
	});

	// create new array that groups by lastName, firstName, phone
	const groupedClients: any[] = [];
	let currentGroup: any[] = [];
	let lastLastName = "";
	let lastFirstName = "";
	let lastPhone = "";
	data.forEach((row: any) => {
		if (row.lastName !== lastLastName || row.firstName !== lastFirstName || row.phone !== lastPhone) {
			if (currentGroup.length > 0) {
				groupedClients.push(currentGroup);
			}
			currentGroup = [];
		}
		currentGroup.push(row);
		lastLastName = row.lastName;
		lastFirstName = row.firstName;
		lastPhone = row.phone;
	});

	if (currentGroup.length > 0) {
		groupedClients.push(currentGroup);
	}

	// pull out the existing coach and admin user IDs to save and push back later
	const saveUserIds = ["e2240b07-2d12-4cb6-af1a-1c936a1d8e2e"];

	const getUserAction = queryUserById.bind(null);
	const savedUsers = await Promise.all(saveUserIds.map((id) => getUserAction(id)));

	await deleteAllFromDb("user");

	// const savedUsers = [
	// 	{
	// 		id: "71b7ebe9-9497-4a8f-91b4-f3b930ebeec5",
	// 		clerkUserId: "user_35PAF0563ZcQcwyyYhhXHkMxDjP",
	// 		firstName: "Linc",
	// 		lastName: "Star",
	// 		role: "coach",
	// 		desiredRole: "coach",
	// 		email: "lincstar182@hotmail.com",
	// 		photoUrl:
	// 			"https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zNExnYjg0UVBpRmttNnpubnFxb2JzOEpmWjciLCJyaWQiOiJ1c2VyXzM1UEFGMDU2M1pjUWN3eXlZaGhYSGtNeERqUCIsImluaXRpYWxzIjoiTFMifQ",
	// 		siteId: null,
	// 		phone: "+12083405365",
	// 		address1: "",
	// 		address2: "",
	// 		city: "Nampa",
	// 		state: "",
	// 		zip: "",
	// 		birthMonth: 10,
	// 		birthDay: 11,
	// 		accepted: true,
	// 		notes: "I'd like to be a coach",
	// 		themePreference: "dark",
	// 		deletedAt: null,
	// 	},
	// 	{
	// 		id: "bb01ccbe-2a86-4401-b70e-7464520cda40",
	// 		clerkUserId: "user_35OkgFuAhI6FEATxUAKsnFYLDMS",
	// 		firstName: "Lincoln",
	// 		lastName: "Bollschweiler",
	// 		role: "admin",
	// 		desiredRole: null,
	// 		email: "lincolnbollschweiler@gmail.com",
	// 		photoUrl:
	// 			"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zNU9rZ0ZPcTE2cjUzYnh0aWk1N3NueXVGMVgifQ",
	// 		siteId: null,
	// 		phone: "+12083405367",
	// 		address1: "10768 Cloudless Ct",
	// 		address2: "line 2",
	// 		city: "Nampa",
	// 		state: "ID",
	// 		zip: "83687",
	// 		birthMonth: null,
	// 		birthDay: null,
	// 		accepted: true,
	// 		notes: "Setting up the DB",
	// 		themePreference: "dark",
	// 		deletedAt: null,
	// 	},
	// 	{
	// 		id: "cbc7caf3-776c-4bd9-99aa-22a983fb4f3e",
	// 		clerkUserId: "user_35OlPKfcndCAZvLnx4yxDngjxsV",
	// 		firstName: "George",
	// 		lastName: "Bollschweiler",
	// 		role: "coach",
	// 		desiredRole: "client",
	// 		email: "georgebollschweiler@gmail.com",
	// 		photoUrl:
	// 			"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18zNU9sUFBBRWdYOXRNT0pNQXBzYm45Y2FsdzQifQ",
	// 		siteId: "a9ca9828-d427-4a12-b824-9a09933009a2",
	// 		phone: "+12083405367",
	// 		address1: "10768 Cloudless Ct",
	// 		address2: "",
	// 		city: "Nampa",
	// 		state: "ID",
	// 		zip: "83687",
	// 		birthMonth: 12,
	// 		birthDay: 21,
	// 		accepted: true,
	// 		notes: "Help me!",
	// 		themePreference: "system",
	// 		deletedAt: null,
	// 	},
	// ];

	savedUsers.forEach(async (user) => {
		delete user?.createdAt;
		delete user?.updatedAt;
		await addDataToDb("user", user);
	});

	groupedClients.forEach(async (group) => {
		await addClientToDb(group);
	});
};

const loadContacts = async () => {
	const response = await fetch(`/temp-load-in/businessContacts.csv`);
	const csvText = await response.text();
	debugger;

	const parsed = Papa.parse(csvText, {
		header: true, // use first row as keys
		skipEmptyLines: true,
	});

	await deleteAllFromDb("contacts");

	for (const contactInfo of parsed.data) {
		let phone = null;
		if (contactInfo.phone && contactInfo.phone.trim().length > 0) {
			phone = `+1${contactInfo.phone.trim().replace(/\D/g, "")}`;
		}
		if (contactInfo.phone && phone?.length !== 12) {
			debugger;
			phone = null;
		}

		let contactPhone = null;
		if (contactInfo.contactPhone && contactInfo.contactPhone.trim().length > 0) {
			contactPhone = `+1${contactInfo.contactPhone.trim().replace(/\D/g, "")}`;
		}
		if (contactInfo.contactPhone && contactPhone?.length !== 12) {
			debugger;
			contactPhone = null;
		}

		let secondContactPhone = null;
		if (contactInfo.secondContactPhone && contactInfo.secondContactPhone.trim().length > 0) {
			secondContactPhone = `+1${contactInfo.secondContactPhone.trim().replace(/\D/g, "")}`;
		}
		if (contactInfo.secondContactPhone && secondContactPhone?.length !== 12) {
			debugger;
			secondContactPhone = null;
		}

		const sanitizedUser = {
			name: contactInfo.name ? contactInfo.name.trim() : null,
			typeOfService: contactInfo.typeOfService ? contactInfo.typeOfService.trim() : null,
			phone,
			phoneExt: contactInfo.phoneExt ? contactInfo.phoneExt.trim() : null,
			email: contactInfo.email ? contactInfo.email.trim() : null,
			contactName: contactInfo.contactName ? contactInfo.contactName.trim() : null,
			contactPhone,
			contactEmail: contactInfo.contactEmail ? contactInfo.contactEmail.trim() : null,
			secondContactPhone,
			secondContactPhoneExt: contactInfo.secondContactPhoneExt ? contactInfo.secondContactPhoneExt.trim() : null,
			secondContactEmail: contactInfo.secondContactEmail ? contactInfo.secondContactEmail.trim() : null,
			address1: contactInfo.address1 ? contactInfo.address1.trim() : null,
			city: contactInfo.city ? contactInfo.city.trim() : null,
			state: contactInfo.state ? contactInfo.state.trim() : null,
			zip: contactInfo.zip ? contactInfo.zip.trim() : null,
			notes: contactInfo.notes ? contactInfo.notes.trim() : null,
		};

		const action = insertContact.bind(null);
		await action(sanitizedUser);
	}

	debugger;
};

const loadClients = async () => {
	return;
	const response = await fetch(`/temp-load-in/clients.csv`);
	const csvText = await response.text();

	const parsed = Papa.parse(csvText, {
		header: true, // use first row as keys
		skipEmptyLines: true,
	});

	await addUniqueColumnData(parsed.data);
	await addDuplicateColumnData(parsed.data);
	await addUserData(parsed.data);

	return;
};

const createClientServideInDb = async (clientServiceInfo: any) => {
	const action = addClientService;
	return await action(clientServiceInfo);
};

const createClientInDb = async (userInfo: any, clientInfo: any) => {
	const action = createUser;
	return await action(userInfo, clientInfo);
};

const clientService = (clientId, client, funds) => {
	return {
		clientId,
		requestedServiceId: lookup["service"]?.[client.requestedService?.trim()] || null,
		providedServiceId: lookup["service"]?.[client.providedService?.trim()] || null,
		visitId: lookup["visit"]?.[client.visit?.trim()] || null,
		cityId: lookup["city"]?.[client.city?.trim()] || null,
		locationId: lookup["location"]?.[client.location?.trim()] || null,
		referralSourceId: lookup["referralSource"]?.[client.referralSource?.trim()] || null,
		referredOutId: lookup["referredOut"]?.[client.referredOut?.trim()] || null,
		funds,
		notes: client.followUpNotes ? client.followUpNotes.trim() : null,
		createdAt: new Date(client.createdAt),
		updatedAt: new Date(client.createdAt),
	};
};

const addClientToDb = async (group: any[]) => {
	const client = group[0];
	let phone = null;
	if (client.phone && client.phone.trim().length > 0) {
		phone = `+1${client.phone.trim().replace(/\D/g, "")}`;
	}
	if (client.phone && phone?.length !== 12) {
		// debugger;
		phone = null;
	}
	const sanitizedUser = {
		firstName: client.firstName.trim(),
		lastName: client.lastName.trim(),
		role: "client",
		email: client.email ? client.email.trim() : null,
		phone,
		accepted: true,
		createdAt: new Date(client.createdAt),
		updatedAt: new Date(client.createdAt),
	};

	const followUpNeeded = client.followUpNeeded?.toLowerCase() === "yes";
	const sanitizedClient = {
		followUpNeeded: followUpNeeded,
		followUpDate: followUpNeeded ? (client.followUpDate ? new Date(client.followUpDate) : new Date()) : null,
		followUpNotes: client.followUpNotes ? client.followUpNotes.trim() : null,
		createdAt: new Date(client.createdAt),
		updatedAt: new Date(client.createdAt),
	};
	const clientId = await createClientInDb(sanitizedUser, sanitizedClient);

	const fundingIds = ["Gas Voucher", "Laundry Voucher", "Phone"];
	let funds;

	if (fundingIds.includes(client.providedService)) {
		funds = 20;

		if (new Date(client.createdAt) < new Date("2025-03-01")) {
			// console.log("Reducing funds for date:", client.createdAt, client.firstName, client.lastName);
			funds = 15;
		}
	}

	const clientServiceData = clientService(clientId, client, funds);
	await createClientServideInDb(clientServiceData);

	const extraVisits = group.slice(1);
	if (extraVisits.length === 0) return;
	for (const visitInfo of extraVisits) {
		const clientServiceData = clientService(clientId, visitInfo, funds);
		await createClientServideInDb(clientServiceData);
	}
};
