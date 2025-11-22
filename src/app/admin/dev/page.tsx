"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createNewTheme } from "@/utils/createNewTheme";
import {
	createCity,
	createLocation,
	createReentryChecklistItem,
	createReferralSource,
	createReferredOut,
	createService,
	createVisit,
	createVolunteerType,
} from "@/tableInteractions/actions";
import {
	deleteAllCity,
	deleteAllLocation,
	deleteAllReentryChecklistItem,
	deleteAllReferralSource,
	deleteAllReferredOut,
	deleteAllService,
	deleteAllVisit,
	deleteAllVolunteerTypes,
} from "@/tableInteractions/adminActions";

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

	const process = () => {
		createNewTheme(iamsajidThemeInputText);
		// const { lightOutput, darkOutput } = createNewTheme(iamsajidThemeInputText);
		// console.log(lightOutput, "\n\n", darkOutput);
	};

	const loadDataTypeValues = async () => {
		await loadGeneral("");
		// await loadGeneral("city");
		// await loadGeneral("visit");
		// await loadGeneral("location");
		// await loadGeneral("service");
		// await loadGeneral("reentryCheckListItem");
		// await loadGeneral("referralSource");
		// await loadGeneral("referredOut");
		// await loadGeneral("volunteeringType");
	};

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
				<Button onClick={loadDataTypeValues}>Load in Data Types</Button>
			</section>
		</main>
	);
}

const addToDb = async (type: string, name: string) => {
	let action;
	let deleteAction;
	switch (type) {
		case "city":
			deleteAction = deleteAllCity;
			await deleteAction();
			action = createCity;
			await action({ name });
			break;
		case "visit":
			deleteAction = deleteAllVisit;
			await deleteAction();
			action = createVisit;
			await action({ name });
			break;
		case "location":
			deleteAction = deleteAllLocation;
			await deleteAction();
			action = createLocation;
			await action({ name, description: "" });
			break;
		case "service":
			deleteAction = deleteAllService;
			await deleteAction();
			action = createService;
			await action({ name, description: "", requiresFunding: false });
			break;
		case "reentryCheckListItem":
			deleteAction = deleteAllReentryChecklistItem;
			await deleteAction();
			action = createReentryChecklistItem;
			await action({ name, description: "" });
			break;
		case "referralSource":
			deleteAction = deleteAllReferralSource;
			await deleteAction();
			action = createReferralSource;
			await action({ name, description: "" });
			break;
		case "referredOut":
			deleteAction = deleteAllReferredOut;
			await deleteAction();
			action = createReferredOut;
			await action({ name, description: "" });
			break;
		case "volunteeringType":
			deleteAction = deleteAllVolunteerTypes;
			await deleteAction();
			action = createVolunteerType;
			await action({ name, description: "" });
			break;
		default:
			console.warn(`No action defined for type: ${name}`);
			return;
	}
};

const loadGeneral = async (type: string) => {
	if (type === "") return;
	const response = await fetch(`/temp-load-in/${type}.csv`);
	const csvText = await response.text();
	const valuesSet = new Set<string>(csvText.split(",").map((value) => value.trim()));
	const valuesArray = Array.from(valuesSet).filter((value) => value.length > 0);
	valuesArray.sort();
	console.log(`Parsed ${type}:`, valuesArray);
	valuesArray.forEach((value) => addToDb(type, value)); // Example function to insert value into database
};
