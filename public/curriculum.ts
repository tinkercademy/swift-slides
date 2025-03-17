import { TrackEntry } from "@/app/tracks/track";

// Helper regex to export legacy HTML to JS objects: https://regex101.com/r/ubkvhV/4
export const tracks: TrackEntry[] = [
  {
    id: "track_a",
    title: "App Design and Prototyping",
    subtitle: "Design Track",
    description:
      "Learn to master app design and prototyping skills with Keynote and Freeform, creating engaging and accessible user experiences specifically tailored for iPad.",
    units: [
      {
        id: "unit_01",
        title: "Introduction to Keynote",
        subtitle: "Unit 01",
        description:
          "Learn the basics of Keynote to kickstart your app design journey.",
        markdownId: "keynoteIntro",
      },
      {
        id: "unit_02",
        title: "Brainstorming",
        subtitle: "Unit 02",
        description: "Generate innovative app ideas with guided activities.",
        markdownId: "brainstorm",
      },
      {
        id: "unit_03",
        title: "Planning your UI",
        subtitle: "Unit 03",
        description: "Sketch and organize your app's user interface.",
        markdownId: "uiplanning",
      },
      {
        id: "unit_04",
        title: "Inclusive Design",
        subtitle: "Unit 04",
        description: "Create apps accessible to everyone.",
        markdownId: "appdesign",
      },
      {
        id: "unit_04A",
        title: "Designing with iPadOS",
        subtitle: "Unit 04A",
        description: "Supercharge your app for iPad.",
        markdownId: "ipad-design",
      },
      {
        id: "unit_05",
        title: "Intro to Freeform",
        subtitle: "Unit 05",
        description: "Explore creative tools in Freeform.",
        markdownId: "freeformIntro",
      },
      {
        id: "unit_05A",
        title: "Storyboarding",
        subtitle: "Unit 05A",
        description: "Visualize and plan your app flow.",
        markdownId: "storyboard",
      },
      {
        id: "unit_06",
        title: "Prototyping",
        subtitle: "Unit 06",
        description:
          "Develop high-fidelity interactive app prototypes on Keynote.",
        markdownId: "prototyping",
      },
      {
        id: "unit_06A",
        title: "Design a Simple App",
        subtitle: "Unit 06A",
        description: "Prototype a simple, polished app step-by-step.",
        markdownId: "apple-keynote",
      },
      {
        id: "unit_07",
        title: "Get Started with Code",
        subtitle: "Unit 07",
        description: "Transition from prototyping to basic coding.",
        markdownId: "get-started-with-code",
      },
    ],
  },
  {
    id: "track_x",
    title: "Get Started with Swift!",
    subtitle: "Swift Track",
    description:
      "Start your coding journey by mastering fundamental Swift concepts such as commands, loops, logic, and variables, enabling you to build interactive and dynamic apps.",
    units: [
      {
        id: "unit_01",
        title: "Commands, For Loops and Conditionals",
        subtitle: "Unit 01",
        description:
          "Control Byte with Swift commands, loops, and conditionals.",
        markdownId: "basicCommands",
      },
      {
        id: "unit_02",
        title: "Logic and Variable Types",
        subtitle: "Unit 02",
        description: "Discover logic, variables, and Swift data types.",
        markdownId: "logic-variables",
        disabled: true,
      },
      {
        id: "unit_03",
        title: "Initialisation, Function, Parameters",
        subtitle: "Unit 03",
        description:
          "Learn to initialize variables, define functions, and use parameters.",
        markdownId: "initialisation-func-parameters",
        disabled: true,
      },
      {
        id: "unit_04",
        title: "Getting Started With Code",
        subtitle: "Unit 04",
        description: "Introduction to building apps with SwiftUI.",
        markdownId: "initialisation-func-parameters",
        disabled: true,
      },
      {
        id: "unit_05",
        title: "About me App",
        subtitle: "Unit 05",
        description: "Customize an interactive personal app.",
        markdownId: "about-me-app",
        disabled: true,
      },
    ],
  },
  {
    id: "track_b",
    title: "App Development with Swift",
    subtitle: "SwiftUI Track",
    description:
      "Dive into app development with SwiftUI using Swift Playgrounds! Create polished interactive apps, exploring SwiftUI views, modifiers, state management, animations, and advanced Swift programming techniques directly on your iPad.",
    units: [
      {
        id: "unit_00",
        title: "iPad and Swift",
        subtitle: "Unit 00",
        description:
          "Get started coding with Swift on your iPad using Swift Playgrounds.",
        markdownId: "introduction",
      },
      {
        id: "unit_01",
        title: "Name Card",
        subtitle: "Unit 01",
        description:
          "Build a personal Name Card app using basic SwiftUI views and modifiers.",
        markdownId: "namecard",
      },
      {
        id: "unit_01A",
        title: "Stacks and Shapes",
        subtitle: "Unit 01A",
        description:
          "Compose a self-portrait app using SwiftUI stacks, shapes, and colors.",
        markdownId: "shapes",
      },
      {
        id: "unit_02",
        title: "Counter",
        subtitle: "Unit 02",
        description:
          "Learn about Swift variables, state, and more by creating a simple counter app.",
        markdownId: "counter",
      },
      {
        id: "unit_02A",
        title: "Flag Raising",
        subtitle: "Unit 02A",
        description:
          "Enhance your Counter app with interactive buttons, stacks, and animations.",
        markdownId: "flagraising",
      },
      {
        id: "unit_03",
        title: "About Me",
        subtitle: "Unit 03",
        description:
          "Build a multi-tab app highlighting personal information and exploring advanced layouts.",
        markdownId: "aboutme",
      },
      {
        id: "unit_04",
        title: "Quiz App",
        subtitle: "Unit 04",
        description:
          "Combine core SwiftUI concepts in creating a basic interactive quiz app.",
        markdownId: "quiz_beginner",
      },
      {
        id: "unit_04A",
        title: "Arrays, Previews, and Structs",
        subtitle: "Unit 04A",
        description:
          "Dive deeper into Swift arrays, structs, and app previews to efficiently manage app data.",
        markdownId: "arrays",
      },
      {
        id: "unit_04B",
        title: "Jokes",
        subtitle: "Unit 04B",
        description:
          "Create a fun joke app implementing arrays, structs, and interactive alerts.",
        markdownId: "jokes",
      },
      {
        id: "unit_04C",
        title: "Quiz v2",
        subtitle: "Unit 04C",
        description:
          "Expand the basic quiz app with advanced UI elements like progress indicators, sheets and custom buttons.",
        markdownId: "quiz",
      },
      {
        id: "unit_05",
        title: "Recipe App",
        subtitle: "Unit 05",
        description:
          "Develop a fully-functional CRUD (create, read, update, delete) app for recipes, using SwiftUI lists, navigation views, and modals.",
        markdownId: "list",
      },
      {
        id: "unit_06",
        title: "Capstone Project",
        subtitle: "Unit 06",
        description:
          "Apply your SwiftUI skills to design and prototype your own single-feature app.",
        markdownId: "project",
      },
      {
        id: "unit_07",
        title: "ChatGPT and APIs",
        subtitle: "Project 01",
        description: "Build an app integrating ChatGPT using OpenAI APIs.",
        markdownId: "chatgpt_and_apis",
        disabled: true,
      },
      {
        id: "unit_08",
        title: "Solar System",
        subtitle: "Project 02",
        description:
          "Explore the Solar System with Augmented Reality and SwiftUI.",
        markdownId: "",
        disabled: true,
      },
      {
        id: "unit_09",
        title: "Vision Game",
        subtitle: "Project 03",
        description:
          "Create a game using the built-in Computer Vision framework to encourage physical activity.",
        markdownId: "",
        disabled: true,
      },
      {
        id: "unit_10",
        title: "Project",
        subtitle: "Project 04",
        description: "Create a Machine Learning or Augmented Reality project.",
        markdownId: "",
        disabled: true,
      },
    ],
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
];
