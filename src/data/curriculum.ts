import { TrackEntry } from "../app/tracks/track";

// Helper regex to export legacy HTML to JS objects: https://regex101.com/r/ubkvhV/4
export const tracks: TrackEntry[] = [
	{
		id: "track_a",
		title: "App Design and Prototyping with Keynote and Swift",
		subtitle: "Track A",
		description: "Learn to design and prototype apps with Keynote on iPad, and get started with coding puzzles in Swift.",
		units: [
			{
				id: "unit_01",
				title: "Introduction to Keynote and the App Design Journal",
				subtitle: "Unit 01",
				description: "Getting Started!",
				markdownId: "keynoteIntro"
			},
			{
				id: "unit_02",
				title: "Brainstorming",
				subtitle: "Unit 02",
				description: "Brainstorming for your app!",
				markdownId: "brainstorm"
			},
			{
				id: "unit_03",
				title: "Planning your UI",
				subtitle: "Unit 03",
				description: "Planning your user interface",
				markdownId: "uiplanning"
			},
			{
				id: "unit_04",
				title: "Inclusive Design",
				subtitle: "Unit 04",
				description: "Designing for all",
				markdownId: "appdesign"
			},
			{
				id: "unit_04A",
				title: "Designing with iPadOS",
				subtitle: "Unit 04A",
				description: "Supercharge Your App for iPad",
				markdownId: "ipad-design"
			},
			{
				id: "unit_05",
				title: "Intro to Freeform",
				subtitle: "Unit 05",
				description: "Introduction to Freeform and its tools",
				markdownId: "freeformIntro"
			},
			{
				id: "unit_05A",
				title: "Storyboarding",
				subtitle: "Unit 05A",
				description: "Design an app that flows",
				markdownId: "storyboard"
			},
			{
				id: "unit_06",
				title: "Prototyping",
				subtitle: "Unit 06",
				description: "Making a high-fidelity prototype on Keynote",
				markdownId: "prototyping"
			},
			{
				id: "unit_06A",
				title: "Design a Simple App",
				subtitle: "Unit 06A",
				description: "Making high-fidelity prototype on Keynote",
				markdownId: "apple-keynote"
			},
			{
				id: "unit_07",
				title: "Get Started with Code",
				subtitle: "Unit 07",
				description: "Basic",
				markdownId: "get-started-with-code"
			},
		]

	},
	{
		id: "track_b",
		title: "App Development with Swift - Getting Started",
		subtitle: "Track B",
		description: "Get started with SwiftUI and Swift Playgrounds! Learn to compose Views and build apps on iPad.",
		units: [
			{
				id: "unit_00",
				title: "iPad and Swift",
				subtitle: "Unit 00",
				description: "Intro to iPad and Swift",
				markdownId: "introduction"
			},
			{
				id: "unit_01",
				title: "Name Card",
				subtitle: "Unit 01",
				description: "Swift Playgrounds, Views and Modifiers",
				markdownId: "namecard"
			},
			{
				id: "unit_01A",
				title: "Stacks and Shapes",
				subtitle: "Unit 01A",
				description: "Self portrait using stacks, shapes, and modifiers.",
				markdownId: "shapes"
			},
			{
				id: "unit_02",
				title: "Counter",
				subtitle: "Unit 02",
				description: "In this basic interactive SwiftUI app, you'll learn about variables, types, state, conditions, and string interpolation.",
				markdownId: "counter"
			},
			{
				id: "unit_02A",
				title: "Flag Raising",
				subtitle: "Unit 02A",
				description: "This extension to the Counter app explores Buttons, HStacks, and animations.",
				markdownId: "flagraising"
			},
			{
				id: "unit_03",
				title: "About Me",
				subtitle: "Unit 03",
				description: "In this built-in tutorial in Swift Playgrounds, you'll create a tab-based app with various screens, and get more practice with layouts and views.",
				markdownId: "aboutme"
			},
			{
				id: "unit_04",
				title: "Quiz App",
				subtitle: "Unit 04",
				description: "Explore and combine key coding and SwiftUI concepts to create a quiz app!",
				markdownId: "quiz_beginner"
			},
			{
				id: "unit_04A",
				title: "Optional: Array, Structs, and Previews",
				subtitle: "Unit 04A",
				description: "This advanced unit can be considered optional. Learn some core concepts of Swift: arrays and structs.",
				markdownId: "arrays"
			},
			{
				id: "unit_04B",
				title: "Optional: Jokes",
				subtitle: "Unit 04B",
				description: "In this advanced unit, you'll make a Jokes app and implement structs and arrays, as well as create Alerts.",
				markdownId: "jokes"
			},
			{
				id: "unit_04C",
				title: "Optional: Quiz v2",
				subtitle: "Unit 04C",
				description: "For this advanced version of the Quiz app, you'll use a Progress Indicator, Sheets, and create a Custom Button.",
				markdownId: "quiz"
			},
			{
				id: "unit_05",
				title: "Recipe App",
				subtitle: "Unit 05",
				description: 'This is the quintessential "list app" with CRUD (create, read, update, delete) functionality. Learn about intermediate and advanced features such as Lists, modals, navigation views, and more.',
				markdownId: "list"
			},
			{
				id: "unit_06",
				title: "Project",
				subtitle: "Unit 06",
				description: "In this unit, we'll summarise what we've learned and provide you some resources on where to learn more. Do keep an eye on our youtube channel for more tutorials!",
				markdownId: "project"
			},
		]
	},
	{
		id: "track_c",
		title: "App Development with Swift - Intermediate",
		subtitle: "Track C",
		description: "Go further with SwiftUI! Explore technologies like Augmented Reality amd Machine Learning in Swift.",
		disabled: true,
		units: [
			{
				id: "unit_01",
				title: "ChatGPT and APIs",
				subtitle: "Project 01",
				description: "Imagine pitching your next amazing app idea to a Singaporean uncle, now you can with this GPT-powered virtual overly critical uncle.",
				markdownId: "chatgpt_and_apis"
			},
			{
				id: "unit_02",
				title: "Solar System",
				subtitle: "Project 02",
				description: "Explore the Solar System with Augmented Reality and SwiftUI.<br>Not to scale. For a scaled model, look around you.",
				markdownId: ""
			},
			{
				id: "unit_03",
				title: "Vision Game",
				subtitle: "Project 03",
				description: "Use the built-in Computer Vision framework to create a simple game.<br>This is also an attempt to get developers to exercise.",
				markdownId: ""
			},
			{
				id: "unit_04",
				title: "Project",
				subtitle: "Project 04",
				description: "Create a Machine Learning / Augmented Reality project.",
				markdownId: ""
			},
		]
	},
	{
		id: "track_x",
		title: "Get Started with Swift!",
		subtitle: "Track X",
		description: "Basics to Swift & Mini Project! Work in Progress...",
		units: [
			{
				id: "unit_01",
				title: "Commands, For Loops and Conditionals",
				subtitle: "Unit 01",
				description: "Getting Started fr fr!",
				markdownId: "basicCommands"
			},
			{
				id: "unit_02",
				title: "Logic and Variable Types",
				subtitle: "Unit 02",
				description: "Progressing more!",
				markdownId: "logic-variables",
				disabled: true,
			},
			{
				id: "unit_03",
				title: "Initialisation, Function, Parameters",
				subtitle: "Unit 03",
				description: "Moving furher!",
				markdownId: "initialisation-func-parameters",
				disabled: true,
			},
			{
				id: "unit_04",
				title: "Getting Started With Code",
				subtitle: "Unit 04",
				description: "Progressing furher!",
				markdownId: "initialisation-func-parameters",
				disabled: true,
			},
			{
				id: "unit_05",
				title: "About me App",
				subtitle: "Unit 05",
				description: "Woah you are DONE",
				markdownId: "about-me-app",
				disabled: true,
			},
		]
	},
	// {
	//     id: "sap",
	//     title: "Swift Accelerator Programme",
	//     subtitle: "Special Programme",
	//     description: "An intensive 8-month long talent development programme for secondary school students.",
	//     imgURL: "/covers/sap-hero.svg",
	//     pageURL: "",
	//    units: []
	// }
]