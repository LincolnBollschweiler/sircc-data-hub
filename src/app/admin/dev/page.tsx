"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createNewTheme } from "@/utils/createNewTheme";

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
		</main>
	);
}
