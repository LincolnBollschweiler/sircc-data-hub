export const createNewTheme = (iamsajidThemeInputText) => {
	const textArrayByLine = iamsajidThemeInputText.split("\n");
	const lightSectionIndex = textArrayByLine.findIndex((line) => line.includes("body.light {"));
	const lightSection = textArrayByLine.splice(lightSectionIndex + 2);
	const lightEnd = lightSection.findIndex((line) => line.includes("/* oklch */"));
	lightSection.splice(lightEnd);
	const darkSectionEnd = textArrayByLine.findIndex((line) => line.includes("/* oklch */"));
	const darkSection = textArrayByLine.slice(3, darkSectionEnd);

	const light = {};
	// convert each line to a key value pair in an object
	// example line: --bg-dark: hsl(214 11% 90%); converts to { bgDark: "214 11% 90%" }
	lightSection.forEach((line) => {
		const [key, value] = line.split(":").map((str) => str.trim());
		light[`${key?.replace("--", "")}`] = value?.replace("hsl(", "").replace(");", "");
	});

	const dark = {};
	// convert each line to a key value pair in an object
	// example line: --bg-dark: hsl(216 24% 1%); converts to { bgDark: "216 24% 1%" }
	darkSection.forEach((line) => {
		const [key, value] = line.split(":").map((str) => str.trim());
		dark[`${key?.replace("--", "")}`] = value?.replace("hsl(", "").replace(");", "");
	});

	const lightObj = {
		background: light["bg"],
		"background-dark": light["bg-dark"],
		"background-light": light["bg-light"],
		foreground: light["text"],
		primary: light["primary"],
		"primary-foreground": dark["text"],
		secondary: light["secondary"],
		"secondary-foreground": dark["text"],
		muted: light["text-muted"],
		"muted-foreground": dark["text-muted"],
		accent: light["highlight"],
		"accent-foreground": dark["highlight"],
		border: light["border"],
		"border-muted": light["border-muted"],
	};
	const darkObj = {
		background: dark["bg"],
		"background-dark": dark["bg-dark"],
		"background-light": dark["bg-light"],
		foreground: dark["text"],
		primary: dark["primary"],
		"primary-foreground": light["text"],
		secondary: dark["secondary"],
		"secondary-foreground": light["text"],
		muted: dark["text-muted"],
		"muted-foreground": light["text-muted"],
		accent: dark["highlight"],
		"accent-foreground": light["highlight"],
		border: dark["border"],
		"border-muted": dark["border-muted"],
	};

	const lightDefaults = `
--card: 0 0% 100%;
--card-foreground: 0 0% 3.9%;
--popover: 0 0% 100%;
--popover-foreground: 0 0% 3.9%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 0 0% 98%;
--input: 0 0% 89.8%;
--ring: 0 0% 3.9%;
--chart-1: 12 76% 61%;
--chart-2: 173 58% 39%;
--chart-3: 197 37% 24%;
--chart-4: 43 74% 66%;
--chart-5: 27 87% 67%;
--radius: 0.5rem;
`;

	const darkDefaults = `
--card: 0 0% 3.9%;
--card-foreground: 0 0% 98%;
--popover: 0 0% 3.9%;
--popover-foreground: 0 0% 98%;
--destructive: 0 62.8% 30.6%;
--destructive-foreground: 0 0% 98%;
--input: 0 0% 14.9%;
--ring: 0 0% 83.1%;
--chart-1: 220 70% 50%;
--chart-2: 160 60% 45%;
--chart-3: 30 80% 55%;
--chart-4: 280 65% 60%;
--chart-5: 340 75% 55%;
--chart-5: 340 75% 55%;
`;

	let lightOutput = "Light Theme:\n Paste into src/app/globals.css\n";
	Object.entries(lightObj).forEach(([key, value]) => {
		lightOutput += `--${key}: ${value};\n`;
	});
	lightOutput += lightDefaults;

	let darkOutput = "Dark Theme:\n Paste into src/app/globals.css\n";
	Object.entries(darkObj).forEach(([key, value]) => {
		darkOutput += `--${key}: ${value};\n`;
	});
	darkOutput += darkDefaults;

	return { lightOutput, darkOutput };
};
