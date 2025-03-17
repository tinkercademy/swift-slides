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
          "Learn the basics of Keynote to kickstart your app design journey using your very own app design journal.",
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
        title: "Planning your UI",
        idDisplay: "Unit 03",
        subtitle: "Sketch and organize your app's user interface.",
        description:
          "This unit guides you through planning your app’s user interface using sketches and wireframes. You'll learn the principles of good UI design, how to structure your app's layout logically, and the importance of clarity and ease of use in creating compelling app experiences.",
        markdownId: "uiplanning",
      },
      {
        id: "unit_04",
        title: "Inclusive Design",
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
        title: "Intro to Freeform",
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
        description:
          "In this foundational unit, we'll explore basic Swift programming by learning about commands, loops, and conditional statements. You'll start by mastering fundamental commands to interact with characters on-screen, then progress to controlling repetitive tasks using loops. Conditional statements will enable you to execute specific blocks of code based on defined criteria, adding complexity and interactivity to your programs. By the end of this unit, you'll have the foundational knowledge required to write clear and logical Swift code.",
        markdownId: "basicCommands",
      },
      {
        id: "unit_02",
        title: "Logic and Variable Types",
        idDisplay: "Unit 02",
        subtitle: "Discover logic, variables, and Swift data types.",
        description:
          "In this unit, you'll delve deeper into essential programming concepts including logic structures, variable declarations, and data types in Swift. We'll cover how to use Boolean logic to control the flow of your programs and explore various Swift data types such as integers, strings, and arrays. You'll practice storing, manipulating, and retrieving data efficiently, which is fundamental to all programming tasks. This unit ensures you gain confidence in handling different kinds of data, an essential skill for any Swift programmer.",
        markdownId: "logic-variables",
        disabled: true,
      },
      {
        id: "unit_03",
        title: "Initialisation, Function, Parameters",
        idDisplay: "Unit 03",
        subtitle:
          "Learn to initialize variables, define functions, and use parameters.",
        description:
          "This unit introduces more advanced programming concepts including the initialization of variables, defining reusable functions, and working effectively with parameters. You'll learn to create functions that perform specific tasks, accept inputs, and return outputs, greatly enhancing your code's efficiency and readability. We'll also discuss how proper initialization and parameter management contribute to robust and error-free code. By mastering these concepts, you'll take an important step forward in writing maintainable and scalable Swift programs.",
        markdownId: "initialisation-func-parameters",
        disabled: true,
      },
      {
        id: "unit_04",
        title: "Getting Started With Code",
        idDisplay: "Unit 04",
        subtitle: "Introduction to building apps with SwiftUI.",
        description:
          "In this unit, we transition from basic Swift programming to applying these skills within SwiftUI for app development. You'll explore SwiftUI fundamentals, understand how SwiftUI interacts with underlying Swift code, and start building simple, interactive apps. This introduction to SwiftUI sets the stage for creating dynamic interfaces and responsive apps, bridging the gap between programming fundamentals and real-world app development.",
        markdownId: "initialisation-func-parameters",
        disabled: true,
      },
      {
        id: "unit_05",
        title: "About me App",
        idDisplay: "Unit 05",
        subtitle: "Customize an interactive personal app.",
        description:
          "In this culminating unit, you'll apply your accumulated Swift programming and SwiftUI knowledge to create a personalized 'About Me' app. You will utilize various SwiftUI components, structure the app interface, manage user interactions, and integrate data effectively. By developing this app, you'll consolidate your programming skills, gain valuable experience in designing user-centric interfaces, and showcase your ability to create interactive, engaging applications.",
        markdownId: "about-me-app",
        disabled: true,
      },
    ],
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
        subtitle:
          "Get started coding with Swift on your iPad using Swift Playgrounds.",
        description:
          "In this introductory unit, we will familiarize ourselves with Swift Playgrounds, the interactive coding environment designed specifically for iPad. You'll learn the basics of the Swift programming language, including variables, constants, functions, and simple data types. Hands-on activities will help you navigate Swift Playgrounds effectively, enabling you to write your first Swift programs directly on your iPad. This foundational unit sets the stage for more advanced topics and ensures you have the confidence and skills needed for subsequent app development units.",
        markdownId: "introduction",
      },
      {
        id: "unit_01",
        title: "Name Card",
        idDisplay: "Unit 01",
        subtitle:
          "Build a personal Name Card app using basic SwiftUI views and modifiers.",
        description:
          "In this unit, we will dive into the essentials of SwiftUI by developing a personalized Name Card app. You’ll explore basic SwiftUI views such as Text, Image, and VStack, along with modifiers that enhance their appearance and functionality. We will structure content effectively, apply styling, and customize interactions. By creating a simple yet polished Name Card app, you'll gain a practical understanding of how SwiftUI components fit together to form interactive and visually appealing user interfaces.",
        markdownId: "namecard",
      },
      {
        id: "unit_01A",
        title: "Stacks and Shapes",
        idDisplay: "Unit 01A",
        subtitle:
          "Compose a self-portrait app using SwiftUI stacks, shapes, and colors.",
        description:
          "In this creative unit, you'll use SwiftUI stacks (HStack, VStack, and ZStack) and shapes (such as circles, rectangles, and rounded rectangles) to design a self-portrait app. You'll learn how to effectively layer, arrange, and align visual elements, and how to use colors, gradients, and shadows to bring your designs to life. This hands-on project encourages experimentation, allowing you to see how small adjustments in stacking and modifiers can significantly impact the overall visual outcome of your app.",
        markdownId: "shapes",
      },
      {
        id: "unit_02",
        title: "Counter",
        idDisplay: "Unit 02",
        subtitle:
          "Learn about Swift variables, state, and more by creating a simple counter app.",
        description:
          "In this foundational unit, you'll create a simple interactive counter app, introducing crucial Swift and SwiftUI concepts including state management, variables, and event handling. You’ll implement user interaction through buttons and use Swift's state variables to dynamically update the UI based on these interactions. This project not only teaches basic Swift programming logic but also demonstrates how state changes drive UI updates, a fundamental concept in interactive app development.",
        markdownId: "counter",
      },
      {
        id: "unit_02A",
        title: "Flag Raising",
        idDisplay: "Unit 02A",
        subtitle:
          "Enhance your Counter app with interactive buttons, stacks, and animations.",
        description:
          "Building upon your previous Counter app, this unit introduces advanced SwiftUI features such as interactive buttons, HStacks, and animations. You'll create an engaging visual experience by animating a flag raising action triggered by user interactions. Through this enhancement, you'll explore how animations and structured layout elements like stacks can significantly elevate user engagement and app functionality, reinforcing your understanding of SwiftUI's powerful interactive capabilities.",
        markdownId: "flagraising",
      },
      {
        id: "unit_03",
        title: "About Me",
        idDisplay: "Unit 03",
        subtitle:
          "Build a multi-tab app highlighting personal information and exploring advanced layouts.",
        description:
          "In this comprehensive unit, you’ll develop a multi-tabbed 'About Me' app designed to showcase personal interests, background, and skills. You'll use advanced SwiftUI techniques, including TabViews, NavigationViews, and complex layout structures to organize and present information clearly. By creating distinct sections within your app, you’ll learn how to effectively manage multiple views and transitions, creating a polished and professional-looking application.",
        markdownId: "aboutme",
      },
      {
        id: "unit_04",
        title: "Quiz App",
        idDisplay: "Unit 04",
        subtitle:
          "Combine core SwiftUI concepts in creating a basic interactive quiz app.",
        description:
          "This interactive unit involves creating a basic quiz app using foundational SwiftUI concepts. You'll integrate buttons, conditional statements, and state management to build interactive quiz functionality. Additionally, you'll handle user input and provide immediate feedback, learning to dynamically adjust your app based on user interactions. This practical application reinforces your coding skills while introducing interactive logic structures crucial for app development.",
        markdownId: "quiz_beginner",
      },
      {
        id: "unit_04A",
        title: "Arrays, Previews, and Structs",
        idDisplay: "Unit 04A",
        subtitle:
          "Dive deeper into Swift arrays, structs, and app previews to efficiently manage app data.",
        description:
          "In this advanced programming unit, you'll delve into core Swift data management structures like arrays and structs. You'll explore how to efficiently handle collections of data, use structs for organizing complex data models, and utilize SwiftUI previews to streamline your development process. Practical examples will demonstrate how these elements contribute to building scalable, organized, and maintainable apps, enhancing your data-handling capabilities significantly.",
        markdownId: "arrays",
      },
      {
        id: "unit_04B",
        title: "Jokes",
        idDisplay: "Unit 04B",
        subtitle: "Create a jokes app with alerts, structs, and arrays.",
        description:
          "In this engaging unit, you'll create a jokes app, applying your knowledge of arrays, structs, and SwiftUI's interactive elements such as alerts and sheets. You will learn to organize collections of jokes, display random selections, and manage user interactions effectively. The app will incorporate alerts to provide feedback and interactivity, enhancing your skills in handling dynamic content and user experience. This project offers an entertaining and practical way to deepen your understanding of data structures and SwiftUI functionalities.",
        markdownId: "jokes",
      },
      {
        id: "unit_04C",
        title: "Quiz v2",
        idDisplay: "Unit 04C",
        subtitle:
          "Expand the basic quiz app with advanced UI elements like progress indicators, sheets and custom buttons.",
        description:
          "In this advanced unit, you will expand upon the foundational quiz app by integrating sophisticated UI components such as progress indicators to visually track quiz progress, custom buttons for improved interactivity, and sheets for displaying additional information and feedback. You'll gain insights into managing complex user interfaces, creating reusable components, and refining the overall user experience. This unit significantly enhances your SwiftUI expertise by pushing the boundaries of interactivity and design flexibility.",
        markdownId: "quiz",
      },
      {
        id: "unit_05",
        title: "Recipe App",
        idDisplay: "Unit 05",
        subtitle:
          "Develop a fully-functional CRUD (create, read, update, delete) app for recipes, using SwiftUI lists, navigation views, and modals.",
        description:
          "In this comprehensive unit, you will build a complete recipe management application featuring CRUD (create, read, update, delete) operations. You'll leverage SwiftUI lists for managing data collections, navigation views for seamless app navigation, and modals for creating and editing recipes interactively. This project emphasizes data handling, user input management, state persistence, and advanced layout techniques, preparing you to build robust, user-friendly applications.",
        markdownId: "list",
      },
      {
        id: "unit_06",
        title: "Capstone Project",
        idDisplay: "Unit 06",
        subtitle:
          "Apply your SwiftUI skills to design and prototype your own single-feature app.",
        description:
          "In this culminating unit, you'll integrate and showcase all your learned skills by designing and prototyping your own single-feature SwiftUI app. You will follow structured app development methodologies from ideation, wireframing, and UI planning to coding and prototyping. Throughout this project, you'll employ best practices in design, usability, state management, and interactivity, ultimately delivering a polished, functional application that highlights your comprehensive understanding of SwiftUI.",
        markdownId: "project",
      },
      {
        id: "unit_07",
        title: "ChatGPT and APIs",
        idDisplay: "Project 01",
        subtitle: "Build an app integrating ChatGPT using OpenAI APIs.",
        description:
          "In this exciting advanced project, you'll integrate OpenAI's ChatGPT API into your SwiftUI app, allowing your application to interact dynamically with users. You'll learn to manage API requests, parse JSON data, and present AI-generated responses within your app. This unit covers key concepts including HTTP requests, asynchronous programming, and data handling, equipping you with the skills to enhance your apps with intelligent conversational capabilities.",
        markdownId: "chatgpt_and_apis",
        disabled: true,
      },
      {
        id: "unit_08",
        title: "Solar System",
        idDisplay: "Project 02",
        subtitle:
          "Explore the Solar System with Augmented Reality and SwiftUI.",
        description:
          "In this exciting Augmented Reality (AR) project, you will build an interactive Solar System exploration app using SwiftUI and Apple's AR frameworks. You'll create 3D models of planets, implement AR experiences to visualize celestial objects in real-world space, and add interactive gestures and animations. This unit offers a deep dive into ARKit, SwiftUI integration, spatial reasoning, and interactive visual design, preparing you to develop innovative, immersive educational applications.",
        markdownId: "",
        disabled: true,
      },
      {
        id: "unit_09",
        title: "Vision Game",
        idDisplay: "Project 03",
        subtitle:
          "Create a game using the built-in Computer Vision framework to encourage physical activity.",
        description:
          "This interactive unit guides you through creating a game leveraging Apple's built-in Computer Vision framework combined with SwiftUI. You'll learn how to track body movements, interpret gestures, and trigger game events based on real-time camera input. The game you develop will encourage physical activity by requiring users to move and interact with visual elements on the screen, bridging the gap between digital and physical experiences. Skills developed include real-time data processing, interactive design, and incorporating motion-based interactions into apps.",
        markdownId: "",
        disabled: true,
      },
      {
        id: "unit_10",
        title: "Project",
        idDisplay: "Project 04",
        subtitle: "Create a Machine Learning or Augmented Reality project.",
        description:
          "In this culminating unit, you have the option to pursue either a Machine Learning or Augmented Reality (AR) project, applying your advanced SwiftUI and programming skills. You'll select, plan, and develop your unique project, leveraging advanced concepts from Swift, SwiftUI, and Apple's frameworks for AR and ML. This project emphasizes creativity, problem-solving, and application of theoretical knowledge to practical scenarios, showcasing your comprehensive skills in app development.",
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
