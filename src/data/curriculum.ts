import { TrackCurriculumEntry } from "../app/tracks/track";

export const tracks: TrackCurriculumEntry[] = [
    {    
        id: "track_a",
        title: "App Design and Prototyping with Keynote and Swift",
        subtitle: "Track A",
        description: "Learn to design and prototype apps with Keynote on iPad, and get started with coding puzzles in Swift.",
        imgURL: "/covers/track_a.png",
        pageURL: "",
        units: [
            {
                id: "unit_01",
                title: "Introduction to Keynote and the App Design Journal",
                subtitle: "Unit 01",
                description: "Getting Started!",
                imgURL: "/covers/track_a/unit_01.png",
                pageURL: "/covers/keynoteIntro",
				markdownId: "keynoteIntro"
            },
        ]
        // <a href="presentation.html?deck=keynoteIntro" class="card">
		// 	<img src="">
		// 	<h3>Unit 1</h3>
		// 	<h2></h2>
		// 	<p></p>
		// </a>
		// <a href="presentation.html?deck=brainstorm" class="card">
		// 	<img src="./assets/02 Brainstorm.png">
		// 	<h3>Unit 2</h3>
		// 	<h2>Brainstorming</h2>
		// 	<p>Brainstorming for your app!</p>
		// </a>
		// <a href="presentation.html?deck=uiplanning" class="card">
		// 	<img src="./assets/03 Planning.png">
		// 	<h3>Unit 3</h3>
		// 	<h2>Planning your UI</h2>
		// 	<p>Planning your user interface</p>
		// </a>
		// <a href="presentation.html?deck=appdesign" class="card">
		// 	<img src="./assets/04 Inclusive Design.png">
		// 	<h3>Unit 4</h3>
		// 	<h2>Inclusive Design</h2>
		// 	<p>Designing for all</p>
		// </a>
		// <a href="presentation.html?deck=ipad-design" class="card">
		// 	<img src="./assets/05 Designing with iPadOS.png">
		// 	<h3>Unit 4A</h3>
		// 	<h2>Designing with iPadOS</h2>
		// 	<p>Supercharge Your App for iPad</p>
		// </a>
		// <a href="presentation.html?deck=freeformIntro" class="card">
		// 	<img src="./assets/06. Intro to Prototyping n Freeform.png">
		// 	<h3>Unit 5</h3>
		// 	<h2>Intro to Freeform</h2>
		// 	<p>Introduction to Freeform and its tools</p>
		// </a>

		// <a href="presentation.html?deck=storyboard" class="card">
		// 	<img src="./assets/6A. Storyboarding.png">
		// 	<h3>Unit 5A</h3>
		// 	<h2>Storyboarding</h2>
		// 	<p>Design an app that flows</p>
		// </a>
		// <a href="presentation.html?deck=prototyping" class="card">
		// 	<img src="./assets/07. Prototyping w Keynote.png">
		// 	<h3>Unit 6</h3>
		// 	<h2>Prototyping</h2>
		// 	<p>Making a high-fidelity prototype on Keynote</p>
		// </a>
		// <a href="presentation.html?deck=apple-keynote" class="card">
		// 	<img src="./assets/7A Keynote Prototyping Slides.png">
		// 	<h3>Unit 6A</h3>
		// 	<h2>Design a Simple App</h2>
		// 	<p>Making high-fidelity prototype on Keynote</p>
		// </a>
		// <a href="presentation.html?deck=get-started-with-code" class="card">
		// 	<img src="./assets/08 Get Started w Code.png">
		// 	<h3>Unit 7</h3>
		// 	<h2>Get Started with Code</h2>
		// 	<p>Basic</p>
		// </a>
    },
    {
        id: "track_b",
        title: "App Development with Swift - Getting Started",
        subtitle: "Track B",
        description: "Get started with SwiftUI and Swift Playgrounds! Learn to compose Views and build apps on iPad.",
        imgURL: "/covers/track_b.png",
        pageURL: "",
        units: []
    },
    {
        id: "track_c",
        title: "App Development with Swift - Intermediate",
        subtitle: "Track C",
        description: "Go further with SwiftUI! Explore technologies like Augmented Reality amd Machine Learning in Swift.",
        imgURL: "/covers/track_c.png",
        pageURL: "",
        units: []
    },
    {
        id: "track_x",
        title: "Get Started with Swift!",
        subtitle: "Track X",
        description: "Work in progress...",
        imgURL: "/covers/track_c.png",
        pageURL: "",
        units: []
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