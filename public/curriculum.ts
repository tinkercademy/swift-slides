import { TrackEntry } from "@/app/tracks/track";

// Helper regex to export legacy HTML to JS objects: https://regex101.com/r/ubkvhV/4
export const tracks: TrackEntry[] = [
  {
    id: "track_a",
    title: "App Design and Prototyping",
    idDisplay: "Design Track",
    subtitle:
      "Learn to master app design and prototyping skills with Keynote and Freeform, creating engaging and accessible user experiences specifically tailored for iPad.",
    description:
      "In this track, we will dive deeply into app design and prototyping using Keynote and Freeform on iPad. Starting with foundational skills in Keynote, you'll learn how to brainstorm app ideas, plan intuitive user interfaces, and incorporate inclusive design principles to ensure accessibility for all users. You'll gain proficiency in leveraging specific features of iPadOS to enhance user interactions and visual appeal. Using Freeform, you'll collaboratively sketch ideas, storyboard your app's user experience, and then progress to creating detailed, interactive prototypes. Finally, you'll bridge the gap from design to development by learning the basics of coding, setting a solid foundation for advanced app creation.",
    units: [
      {
        id: "unit_01",
        title: "Introduction to Keynote",
        idDisplay: "Unit 01",
        subtitle:
          "Learn the basics of Keynote to kickstart your app design journey.",
        description:
          "In this unit, we'll introduce Keynote's fundamental tools and interface, helping you to understand how to use it for app design effectively. You'll create your first design journal, document initial ideas, and prepare assets, laying a solid foundation for designing interactive and visually appealing apps.",
        markdownId: "keynoteIntro",
      },
      {
        id: "unit_02",
        title: "Brainstorming",
        idDisplay: "Unit 02",
        subtitle: "Generate innovative app ideas with guided activities.",
        description:
          "In this unit, we focus on creative brainstorming techniques to generate innovative and engaging app ideas. Guided activities will help you ideate effectively, harness creative thinking, and document a range of concepts, ultimately leading you to a well-developed, user-focused app idea.",
        markdownId: "brainstorm",
      },
      {
        id: "unit_03",
        title: "Planning your User Interface",
        idDisplay: "Unit 03",
        subtitle: "Sketch and organize your app's user interface.",
        description:
          "This unit guides you through planning your app's user interface using sketches and wireframes. You'll learn the principles of good UI design, how to structure your app's layout logically, and the importance of clarity and ease of use in creating compelling app experiences.",
        markdownId: "uiplanning",
      },
      {
        id: "unit_04",
        title: "Inclusive App Design",
        idDisplay: "Unit 04",
        subtitle: "Create apps accessible to everyone.",
        description:
          "We'll focus on inclusive design principles, ensuring your app meets diverse user needs. You'll learn about accessibility standards, consider different user needs, and implement design choices that make your app usable and enjoyable for the widest possible audience.",
        markdownId: "appdesign",
      },
      {
        id: "unit_04A",
        title: "Designing with iPadOS",
        idDisplay: "Unit 04A",
        subtitle: "Supercharge your app for iPad.",
        description:
          "This unit guides you in optimizing your app specifically for iPadOS, leveraging platform-specific features such as multitasking, gestures, and adaptive layouts. You'll learn best practices to create intuitive and immersive experiences tailored explicitly to iPad users.",
        markdownId: "ipad-design",
      },
      {
        id: "unit_05",
        title: "Introduction to Freeform",
        idDisplay: "Unit 05",
        subtitle: "Explore creative tools in Freeform.",
        description:
          "Discover the creative capabilities of Freeform. You'll learn how to sketch, annotate, collaborate, and organize ideas visually. This unit will equip you with essential skills to effectively leverage Freeform in your app design process.",
        markdownId: "freeformIntro",
      },
      {
        id: "unit_05A",
        title: "Storyboarding",
        idDisplay: "Unit 05A",
        subtitle: "Visualize and plan your app flow.",
        description:
          "You'll learn to storyboard effectively, planning each screen and interaction of your app. This visual mapping helps identify user journeys, interaction points, and potential enhancements, streamlining your prototyping process.",
        markdownId: "storyboard",
      },
      {
        id: "unit_06",
        title: "Prototyping",
        idDisplay: "Unit 06",
        subtitle:
          "Develop high-fidelity interactive app prototypes on Keynote.",
        description:
          "We'll create high-fidelity, interactive app prototypes in Keynote. You'll use advanced features to simulate realistic interactions and animations, test app usability, refine interfaces, and prepare your prototype for user testing and feedback.",
        markdownId: "prototyping",
      },
      {
        id: "unit_06A",
        title: "Design a Simple App",
        idDisplay: "Unit 06A",
        subtitle: "Prototype a simple, polished app step-by-step.",
        description:
          "This unit offers step-by-step guidance to prototype a simple, polished app from start to finish, consolidating all the skills learned. You will focus on refining your design, ensuring usability, and achieving a professional-level prototype presentation.",
        markdownId: "apple-keynote",
      },
      {
        id: "unit_07",
        title: "Get Started with Code",
        idDisplay: "Unit 07",
        subtitle: "Transition from prototyping to basic coding.",
        description:
          "Transition smoothly from design and prototyping to basic coding. You will learn core coding principles and explore introductory programming concepts, setting a solid foundation to further develop interactive apps.",
        markdownId: "get-started-with-code",
      },
    ],
  },
  {
    id: "track_x",
    title: "Get Started with Swift!",
    idDisplay: "Swift Track",
    subtitle:
      "Start your coding journey by mastering fundamental Swift concepts such as commands, loops, logic, and variables, enabling you to build interactive and dynamic apps.",
    description:
      "In this introductory Swift programming track, you'll begin your coding adventure by learning essential Swift concepts. We'll start with basic commands, loops, and conditionals, giving you the tools to control simple program flows and logic structures. Next, you'll explore logic, variable types, and data structures essential for organizing and manipulating information efficiently. This track also covers initialization, functions, and parameters, crucial for structuring reusable and maintainable code. By the end of this track, you'll have foundational skills in Swift that enable you to develop interactive and dynamic apps, setting a solid foundation for more advanced programming and app development skills.",
    units: [
      {
        id: "unit_01",
        title: "Commands, For Loops and Conditionals",
        idDisplay: "Unit 01",
        subtitle: "Control Byte with Swift commands, loops, and conditionals.",
        description: "In this unit, you'll guide Byte through puzzles by learning foundational Swift concepts like commands, loops, and conditionals. Practice decision-making and repetition through interactive challenges, building a strong coding foundation in an enjoyable way.",
        markdownId: "basicCommands"
      },
      {
        id: "unit_02",
        title: "Logic and Variable Types",
        idDisplay: "Unit 02",
        subtitle: "Discover logic, variables, and Swift data types.",
        description: "In this unit, you'll explore logic structures and data management in Swift. Learn about variables, integers, strings, and arrays, practicing how to store and manipulate information crucial for creating responsive and interactive apps.",
        markdownId: "logic-variables",
        disabled: true
      },
      {
        id: "unit_03",
        title: "Initialisation, Function, Parameters",
        idDisplay: "Unit 03",
        subtitle: "Learn to initialize variables, define functions, and use parameters.",
        description: "In this unit, you'll learn to organize your code efficiently by initializing variables, defining reusable functions, and using parameters. Mastering these concepts will help keep your programs clear, maintainable, and scalable for future projects.",
        markdownId: "initialisation-func-parameters",
        disabled: true
      },
      {
        id: "unit_04",
        title: "Getting Started With Code",
        idDisplay: "Unit 04",
        subtitle: "Introduction to building apps with SwiftUI.",
        description: "In this unit, you'll start building apps using SwiftUI. You'll learn how to design intuitive user interfaces and connect your Swift code, gaining practical experience in developing interactive and functional app elements.",
        markdownId: "initialisation-func-parameters",
        disabled: true
      },
      {
        id: "unit_05",
        title: "About me App",
        idDisplay: "Unit 05",
        subtitle: "Customize an interactive personal app.",
        description: "In this unit, you'll create a personalized 'About Me' app, applying your Swift and SwiftUI skills. Design interactive elements, handle user input, and effectively present your personal information in an engaging and dynamic format.",
        markdownId: "about-me-app",
        disabled: true
      }
    ]
  },
  {
    id: "track_b",
    title: "App Development with Swift",
    idDisplay: "SwiftUI Track",
    subtitle:
      "Dive into app development with SwiftUI using Swift Playgrounds! Create polished interactive apps, exploring SwiftUI views, modifiers, state management, animations, and advanced Swift programming techniques directly on your iPad.",
    description:
      "In this track, you'll embark on an exciting journey into app development using SwiftUI within Swift Playgrounds directly on your iPad. You'll start by learning essential Swift programming concepts and quickly move to mastering SwiftUI to create interactive and visually appealing apps. Through step-by-step guidance, you'll explore views, layouts, modifiers, animations, state management, and data handling. Advanced topics include arrays, structs, and integrating APIs, which allow you to develop rich, interactive experiences. Each project enhances your understanding and culminates in a personal capstone app, reflecting your newly gained skills in designing, coding, and prototyping apps using SwiftUI.",
    units: [
      {
        id: "unit_00",
        title: "iPad and Swift",
        idDisplay: "Unit 00",
        subtitle: "Get started coding with Swift on your iPad using Swift Playgrounds.",
        description: "In this unit, you'll begin coding with Swift using your iPad. You'll explore Swift Playgrounds, familiarize yourself with its user-friendly interface, and write your first basic Swift programs, preparing for more advanced app-building tasks.",
        markdownId: "introduction"
      },
      {
        id: "unit_01",
        title: "Name Card",
        idDisplay: "Unit 01",
        subtitle: "Build a personal Name Card app using basic SwiftUI views and modifiers.",
        description: "In this unit, you'll design and build a personalized Name Card app. You'll practice using essential SwiftUI views, apply basic modifiers, and understand how to organize layouts to create a simple but effective app interface.",
        markdownId: "namecard"
      },
      {
        id: "unit_01A",
        title: "Stacks and Shapes",
        idDisplay: "Unit 01A",
        subtitle: "Compose a self-portrait app using SwiftUI stacks, shapes, and colors.",
        description: "In this unit, you'll creatively use SwiftUI stacks and shapes to build a self-portrait app. You'll learn to position and style shapes, combining colors and layout principles to create visually engaging and organized designs.",
        markdownId: "shapes"
      },
      {
        id: "unit_02",
        title: "Counter",
        idDisplay: "Unit 02",
        subtitle: "Learn about Swift variables, state, and more by creating a simple counter app.",
        description: "In this unit, you'll build a functional counter app using SwiftUI. You'll grasp core programming concepts such as variables, state management, and interactive UI elements, developing a foundation for responsive and interactive apps.",
        markdownId: "counter"
      },
      {
        id: "unit_02A",
        title: "Flag Raising",
        idDisplay: "Unit 02A",
        subtitle: "Enhance your Counter app with interactive buttons, stacks, and animations.",
        description: "In this unit, you'll enhance your counter app with interactive buttons, dynamic animations, and stack layouts. You'll practice creating responsive visual feedback, significantly improving user interaction and engagement within your app.",
        markdownId: "flagraising"
      },
      {
        id: "unit_03",
        title: "About Me",
        idDisplay: "Unit 03",
        subtitle: "Build a multi-tab app highlighting personal information and exploring advanced layouts.",
        description: "In this unit, you'll build an 'About Me' app with multiple tabs. You'll use advanced SwiftUI techniques, mastering navigation and layout organization to effectively present detailed personal content in a structured, engaging interface.",
        markdownId: "aboutme"
      },
      {
        id: "unit_04",
        title: "Quiz App",
        idDisplay: "Unit 04",
        subtitle: "Combine core SwiftUI concepts in creating a basic interactive quiz app.",
        description: "In this unit, you'll create an interactive quiz app. You'll integrate fundamental SwiftUI elements like buttons, state management, and conditional logic to provide a seamless and engaging interactive experience for users.",
        markdownId: "quiz_beginner"
      },
      {
        id: "unit_04A",
        title: "Arrays, Previews, and Structs",
        idDisplay: "Unit 04A",
        subtitle: "Dive deeper into Swift arrays, structs, and app previews to efficiently manage app data.",
        description: "In this unit, you'll explore arrays, structs, and SwiftUI previews. You'll learn to efficiently handle data organization, preview app components, and enhance your development workflow, boosting your app-building proficiency significantly.",
        markdownId: "arrays"
      },
      {
        id: "unit_04B",
        title: "Jokes",
        idDisplay: "Unit 04B",
        subtitle: "Create a jokes app with alerts, structs, and arrays.",
        description: "In this unit, you'll develop a jokes app incorporating alerts, structs, and arrays. You'll manage dynamic content effectively, provide interactive user feedback, and design interfaces that offer engaging user experiences and entertainment.",
        markdownId: "jokes"
      },
      {
        id: "unit_04C",
        title: "Quiz v2",
        idDisplay: "Unit 04C",
        subtitle: "Expand the basic quiz app with advanced UI elements like progress indicators, sheets and custom buttons.",
        description: "In this unit, you'll upgrade your quiz app using progress indicators, sheets, and custom buttons. These advanced UI elements will significantly improve the user experience by providing clear navigation and interactive enhancements.",
        markdownId: "quiz"
      },
      {
        id: "unit_05",
        title: "Recipe App",
        idDisplay: "Unit 05",
        subtitle: "Develop a fully-functional CRUD (create, read, update, delete) app for recipes, using SwiftUI lists, navigation views, and modals.",
        description: "In this unit, you'll create a complete recipe app with full CRUD capabilities. You'll effectively manage recipe data using SwiftUI lists, modals, and navigation views, delivering an organized and intuitive user interface.",
        markdownId: "list"
      },
      {
        id: "unit_06",
        title: "Capstone Project",
        idDisplay: "Unit 06",
        subtitle: "Apply your SwiftUI skills to design and prototype your own single-feature app.",
        description: "In this final unit, you'll showcase your SwiftUI skills by developing a personalized single-feature app. You'll integrate all previously learned techniques to create a polished, interactive prototype that demonstrates your full app-development capabilities.",
        markdownId: "project"
      },
      {
        id: "unit_07",
        title: "ChatGPT and APIs",
        idDisplay: "Project 01",
        subtitle: "Build an app integrating ChatGPT using OpenAI APIs.",
        description: "In this unit, you'll integrate ChatGPT into your SwiftUI app using OpenAI APIs. You'll practice managing API requests, handling JSON data, and incorporating interactive conversational features to enhance user experiences within your apps.",
        markdownId: "chatgpt_and_apis",
        disabled: true
      },
      {
        id: "unit_08",
        title: "Solar System",
        idDisplay: "Project 02",
        subtitle: "Explore the Solar System with Augmented Reality and SwiftUI.",
        description: "In this unit, you'll create an interactive Solar System app using Augmented Reality and SwiftUI. You'll learn to display 3D models, implement gestures, and build engaging AR experiences, bringing planets and space exploration vividly to life.",
        markdownId: "",
        disabled: true
      },
      {
        id: "unit_09",
        title: "Vision Game",
        idDisplay: "Project 03",
        subtitle: "Create a game using the built-in Computer Vision framework to encourage physical activity.",
        description: "In this unit, you'll develop a game that uses Apple's Computer Vision framework. You'll learn to detect and interpret physical movements, creating an interactive experience that encourages users to move and engage physically with your app.",
        markdownId: "",
        disabled: true
      },
      {
        id: "unit_10",
        title: "Project",
        idDisplay: "Project 04",
        subtitle: "Create a Machine Learning or Augmented Reality project.",
        description: "In this final project, you'll apply your advanced skills by creating an app focused on Machine Learning or Augmented Reality. You'll independently design, develop, and prototype an innovative application, showcasing your full coding capabilities.",
        markdownId: "",
        disabled: true
      }
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
