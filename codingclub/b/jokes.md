<div style="text-align: left">
    <img src="/assets/tinkercademy.png" alt="Tinkercademy Logo" height="128px">
    <img src="https://raw.githubusercontent.com/swiftinsg/branding/main/logos/icons/png/coloured%20-%20dark%20background.png" alt="Swiftinsg Logo" height="128px" style="margin-left: 64px;">
</div>

## Track B: Unit 4B

# Jokes

---

# Laying out Jokes

## Set up those `VStack`s, `HStack`s, `Button`s, `Text`s and all that fun stuff.

---vertical---

## Create a Playground App

<div style="display: flex; ">
    <ol>
        <li>Press the <img style="margin-bottom: -8px;" src="./assets/new-project-button.png" alt="New Project Button"> icon to create a new App</li>
        <li>Hold down on the newly created app and tap <strong>Rename</strong></li>
        <li>Name it <strong>"Jokes"</strong></li>
        <li>Tap on the app to open it</li>
    </ol>
    <img src="./assets/new-project.png">
</div>

---vertical---

## This is how it should look like

<img height="800" src="./assets/jokes-new-app-ss.PNG">

---vertical---

## Jokes layout

<img height="800" src="./assets/jokes-layout.png">

---vertical---

<img height="800" src="./assets/jokes-layout2.png">

---vertical---

## Nothing too new here.

<img height="800" src="./assets/jokes-starter.png">

---vertical---

## What's going on here

<img height="800" src="./assets/jokes-starter-explained.png">

---vertical---

## **What??** _Tell me!!_

Here’s a fun feature in Text — if you add `**` around parts of your string, you get bold text; if you surround your text with `_`, you get italics. This is a markup format called Markdown, which you may have seen in WhatsApp, Telegram and other messaging apps. [Read more here.](https://www.markdownguide.org/)

```swift
Text("What?? **_Tell me_!!**”)
```

---

# Adding Jokes

## Store Jokes in structs, store the structs in an array.

---vertical---

## Create a new Swift File

<div style="display: flex; ">
<ul>

- Tap on <img style="margin-bottom: -4px" height="32px" src="/assets/icons/sidebar.left.svg">
- Press <img style="margin-bottom: -4px" height="40px" src="/assets/icons/doc.badge.plus.svg"  >
- Choose Swift File <img style="margin-bottom: -4px" height="32px" src="/assets/swift-logo.svg">
- Name it Joke
  - Uppercase (not joke)
  - Singular (not Jokes)

</ul>
<img src="./assets/jokes-new-file.png">
</div>

---vertical---

## Creating Jokes

```swift[3-6]
import SwiftUI

struct Joke {
    var setup: String
    var punchline: String
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Adding Jokes

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[3-14]
struct ContentView: View {

    var jokes = [Joke(setup: "Why did the chicken cross the road?",
                      punchline: "To get to the other side!"),
                 Joke(setup: "Why couldn't the bicycle stand up?",
                      punchline: "It was two tired!"),
                 Joke(setup: "Is this pool safe for diving?",
                      punchline: "It deep ends"),
                 Joke(setup: "Where do you learn to make ice cream?",
                      punchline: "Sunday School"),
                 Joke(setup: "Did you hear about the cheese factory that exploded in France?",
                      punchline: "There was nothing left but de Brie"),
                 Joke(setup: "Dad, can you put my shoes on?",
                      punchline: "I dont think they'll fit me")]

    var body: some View {
        VStack {
            ...
```

---vertical---

## Show First Joke

<img height="800" src="./assets/jokes-using-structs.png">

---

## Showing and Hiding Punchline

### We can't show punchline immediately, it ruins the joke.

---vertical---

## What we want

- When the user launches the app, they see the first joke’s setup
  - The punchline, and tap to continue `Text`, are hidden
- When the user taps on What? `Button`, they see the punchline and tap to continue `Text`.

---vertical---

## Declare State Variable

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[5]
struct ContentView: View {

    var jokes = [...]

    @State var showPunchline = false

    var body: some View {
        VStack {
            Text(jokes[0].setup)
                .padding()

            Button {
                print("Button tapped!!")
            } label: {
                Text("What?")
                    .padding()
                    .background(Color.blue)
...
```

---vertical---

## Hide the punchline!

<img height="800" src="./assets/jokes-hide-punchline.png">

---vertical---

## Show Punchline when What? tapped

<img height="800" src="./assets/jokes-show-punchline.png">

---

## More Jokes, More `@State` vars

### Advance to the next joke, and the next joke, and the next joke, and the next joke, and the next joke, and the next joke. But not too many, because it’ll crash.

---vertical---

## What we need to do

- What to do?
  - When the user taps the background,
    - Show next joke
    - Hide punchline
  - Out of jokes? Loop back.
- How we’re going to do it
  - Create a `@State` variable to keep track of the current joke
  - On tap, increment said variable
  - Use modulo `%` to make it loop back!
  - Hide the punchline

---vertical---

## Declare State Variable

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[5-6]
struct ContentView: View {

    var jokes = […]

    @State var showPunchline = false
    @State var currentJoke = 0

    var body: some View {
        VStack {
            Text(jokes[0].setup)
                .padding()

            Button {
                print("Button tapped!!")
                showPunchline = true
            } label: {
                Text("What?")
                    .padding()
                    .background(Color.blue)
...
```

---vertical---

## Implementing currentJoke

<img height="800" src="./assets/jokes-currentJoke.png">

---vertical---

## Embed in ZStack

- The goal is to have the entire background tappable
- If we attach the tap gesture recogniser to the `VStack`, only a space around the middle is tappable
- That's not ideal
- We can instead create a `ZStack` with a `Color.clear` and attach a tap gesture recogniser to it.

---vertical---

## Embed VStack in ZStack

- Create an empty ZStack above the VStack
- See the little handle at the `}`?
- Drag it to encompass the VStack

---vertical---

## Tap Gesture Recogniser

```swift
.onTapGesture {
    // do something
}
```

- An invisible `Button`, attached to a View
- Listens and runs an action when the View is tapped
- For this app, we want to use a Tap Gesture Recogniser on the background to advance to the next joke.

---vertical---

<img height="900" src="./assets/jokes-zstack.png">

---

<img height="1000" src="./assets/crashed.png">

---vertical---

## What does this mean?

<img src="./assets/jokes-indexoutofrange.png">

- This just means we ran out of jokes
- Swift doesn't know what to do now because there are no more jokes to show the user.
- Possible solutions
  - Stop the user from seeing more jokes after we're out of jokes
  - Assume the user has a memory of a goldfish and loop back, hoping they don't notice the jokes have looped.
    - We'll go for this option.

---vertical---

## 2 Approaches

- Reset `currentJoke` every time we hit the number of items in jokes
- Loop around!
  - To do this, we’ll get the remainder when the `currentJoke` is divided by the number of items in `jokes`
  - We'll go with this one.

---vertical---

<img height="900" src="./assets/jokes-resetindex1.png">

---

# Jokes App Pro Max

## Designed for professional jokers.

---vertical---

## Unit overview

```[7-11]
- Jokes App
    - Layout
    - Structs
    - Show/Hide Punchline
    - Looping back

- Jokes App Pro Max
    - Presenting Alert
    - Presenting Sheet
    - Importing Images
    - Further Animations
```

---vertical---

## Alerts

### A pop-up that your user has to dismiss. Fun!

---vertical---

## What? Why alert?

<div style="display: flex; ">
<ul>

- After each joke, ask the user what they thought of it.
- We don’t really do much with the response.
  - It gives the user the illusion that we care about their feelings.
  - More importantly, it lets us show you how to use alerts.

</ul>
<img src="./assets/jokes-alert-ss.jpeg">
</div>

---vertical---

## More States

```swift[5-8]
struct ContentView: View {

    var jokes = […]

    @State var showPunchline = false
    @State var currentJoke = 0
    @State var isFeedbackPresented = false

    var body: some View {
        ZStack {
            ...
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Adding Alert

```swift[5-8]
var body: some View {
    ZStack {
        ...
    }
    .alert("Did you like the last joke?",
           isPresented: $isFeedbackPresented) {
            // Buttons go here
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Creating an Alert

```swift[2-7]
.alert("Did you like the last joke?", isPresented: $isFeedbackPresented) {
    Button("😍") {
        print("good")
    }
    Button("🤮") {
        print("you're a terrible person")
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Present Alert

```swift[8]
var body: some View {
    ZStack {
        Color(.systemBackground)
            .onTapGesture {
                if showPunchline {
                    currentJoke += 1
                    showPunchline = false
                    isFeedbackPresented = true
                }
            }
...
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

<div style="display: flex;justify-content: center; align-items: center;">
<div style="flex: 1;text-align: center;">    
<h2>Run your code!!</h2>
<ul>

- An alert shows up!!!!
- Messages get printed out to your console!!
- We're not exactly making the user experience any better with an alert appearing after every joke but… who cares?

</ul>
</div>
<div style="flex: 1;text-align: center;">
<iframe width="1400" height="600" src="./assets/jokes-alert-demo.mp4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
</div>

---vertical---

## How does the alert work?

- Note how we made the alert work!
  - We set up a `@State` variable, a `Bool`, to determine whether the alert shows up. This variable starts off as `false`, i.e. “don’t show the alert”.
  - When we want the alert to show up, we change that variable to `true`, i.e. “show the alert”.
  - We pass this variable to the `.alert` modifier as a binding (the `$` sign), so that when it’s dismissed, the modifier can set it back to `false`.
- This is a form of _declarative_ programming. More on this later.

---vertical---

## Alert Extensions

### More alerty stuff

---vertical---

## Button Roles

- **`.destructive`**: If an alert button results in a destructive action, like deleting content, specify the destructive button style to help people recognize it.
- **`.cancel`**: A Cancel button provides a clear, safe way to avoid a destructive action. Cancel buttons are default buttons so that people must intentionally choose a button other than the default to continue with the destructive action.

<img height="250" src="./assets/jokes-alert-deletefiles.png">

---vertical---

```swift
.alert("Are you sure you want to delete all files?",
       isPresented: $isAlertPresented) {
    Button("Delete", role: .destructive) {
        print("Files deleted!")
    }
    Button("Cancel", role: .cancel) {
        print("Crisis averted")
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Alert Messages

- Only add an alert message if it is needed
- Add a short succinct message to provide the user with additional context and information.

<img height="250" src="./assets/jokes-alert-description.png">

---vertical---

```swift[9-11]
.alert("Are you sure you want to delete all files?",
       isPresented: $isFeedbackPresented) {
    Button("Delete", role: .destructive) {
        print("good")
    }
    Button("Cancel", role: .cancel) {
        print("you're a terrible person")
    }
} message: {
    Text("Here's an alert description but I can't think of one")
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---

# Sheets

### Now, let’s show an entire new screen over the current screen! This is a modal sheet, where we want the user to focus on what’s this new screen.

---vertical---

## What are Sheets?

<div style="display: flex;justify-content: center; align-items: center;">
<div style="flex: 1;text-align: center;">    
<ul>

- Sheets are screens presented on top of the current screen that makes the current screen inactive
- Essentially, creating new screens on top of the current screen
- We’ll put this screen in a separate file, and call it `FeedbackResponseView`

</ul>
</div>
<div style="flex: 1;text-align: center;">

<img src="./assets/jokes-sheet-1-ss.jpeg">

</div>
</div>

---vertical---

## Aim of `FeedbackResponseView`

- We’ll need this to show either a happy cat and positive message (good feedback), or angry cat and negative message (bad feedback)
- Instead of having two separate `View`s, we’ll have a single `View` that shows a different image and text based on feedback
- Think of the `View` as a function, which has to…
  - Take in a `Bool` to indicate if the feedback is positive or negative
  - Update the a `Text` and `Image` with new content

---vertical---

## Importing Images into Swift Playground

### Adding images to the assets catalogue

---vertical---

## Preparing Assets

- Find some cat images and save them to your iPad’s Photos.
  - You can search for some of them online
  - Make sure to use png, jpeg, jpg or gif (however gifs aren’t animated)

---vertical---

## Importing Images

<div style="display: flex;justify-content: center; align-items: center;">
<div style="flex: 1;text-align: center; width:60%">    
<ul>

- Open the **Sidebar** <img style="margin-bottom: -4px" height="32px" src="/assets/icons/sidebar.left.svg" alt="Left Sidebar Icon">
- Tap on the **Add File** button <img style="margin-bottom: -4px" height="40px" src="/assets/icons/doc.badge.plus.svg" >
- Select Photo --------------------------------------------------->
- Select a photo from your Photos!
- You’ll see your image in the **Assets** section
- Hold down on it’s name and select Rename
- Name it **“happy”**!
- Repeat this for the second image and name it **“sad”**.

</ul>
</div>
<div style="text-align: center;height:450px">

<img height="200" src="./assets/photo-dropbar.png">

</div>
<div style="flex: 1;text-align: center;">

<img height="800" src="./assets/jokes-add-images.png">

</div>
</div>

---vertical---

## Back to Sheets

### or, fancy pop-ups. But first, let’s set up the image and text!

---vertical---

## Create a new `View`

- Tap on <img style="margin-bottom: -4px" height="32px" src="/assets/icons/sidebar.left.svg" alt="Left Sidebar Icon">
- Press <img style="margin-bottom: -4px" height="40px" src="/assets/icons/doc.badge.plus.svg" >
- Choose **Swift File** <img style="margin-bottom: -4px" height="32px" src="/assets/swift-logo.svg">
- Name it **FeedbackResponseView**
- Copy the code from [tk.sg/swiftNewView](https://tk.sg/swiftNewView)
- Paste it in!

---vertical---

<img height="900" src="./assets/jokes-new-view-ss.png">

---vertical---

## Updating your code.

- Replace all instances of the _`MyView`_ with your _`FeedbackResponseView`_.

<img height="700" src="./assets/jokes-new-view-renamed-ss.png">

---vertical---

<img height="900" src="./assets/jokes-model-view-explained.png">

---vertical---

## Positive Feedback

<img src="./assets/jokes-feedbackview1.png">

---vertical---

## Receiving input in our `View`

- Instead of creating 2 separate views to show response to positive and negative feedback, we modify the contents of this one view
- In this case, we pass in a boolean value to indicate whether it is positive feedback or not
  - This doesn’t need to be a `@State` variable. Can you figure out why?
- We’ll the use a ~~cool people’s if statement~~ **ternary operator** to decide which image to show

---vertical---

## Ternary Operators

- Ternary operators are single-line if-else statements ~~that make you feel cool using them.~~

<img src="./assets/Ternary-Operators.png">

---vertical---

## Receiving Feedback Data

The `isPositive` variable will be passed in _(or injected)_ when the View is created

<img src="./assets/jokes-2-previews.png">

---vertical---

## Updating Content using isPositive

<img src="./assets/jokes-isPositive.png">

---vertical---

## Presenting a Sheet

- Sheets are controlled by a `@State` variable that can be set to `true` to present the modal
  - Similar to the alert!
  - Actually, alerts, like sheets, present a new View.
- In this case, we will be creating a sheet to show a response to the user’s feedback
- Think of this `@State` variable as a “barrier” for the sheet to show up from the bottom of the screen. When true, we’re letting it pop up!

---vertical---

<img src="./assets/jokes-feedback-presentation-contentview.png">

---vertical---

## Present the sheet!!

```swift[8-10]
var body: some View {
    ZStack {
      ...
    }
    .alert("...", isPresented: $isFeedbackPresented) {
       ...
    }
    .sheet(isPresented: $isFeedbackResponsePresented) {
        FeedbackResponseView(isPositive: isFeedbackPositive)
    }
}
```

---vertical---

## Present the sheet!!

```swift[9-10,14-15]
var body: some View {
    ZStack {
       ...
    }
    .alert("Did you like the last joke?",
           isPresented: $isFeedbackPresented) {
        Button("😍") {
            print("good")
            isFeedbackPositive = true
            isFeedbackResponsePresented = true
        }
        Button("🤮") {
            print("you're a terrible person")
            isFeedbackPositive = false
            isFeedbackResponsePresented = true
        }
    }
    .sheet(isPresented: $isFeedbackResponsePresented) {
        FeedbackResponseView(isPositive: isFeedbackPositive)
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

<div style="display: flex;justify-content: center; align-items: center;">
<div style="flex: 1;text-align: center;">    
<h2>Run your code!!</h2>
<ul>

- An alert shows up!!!!
- A sheet shows up after the alert!!
- The sheet changes based on whether the user liked it or not.

</ul>
</div>
<div style="flex: 1;text-align: center;">
<iframe width="1400 " height="600" src="./assets/jokes-demo-alerts-working.mp4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
</div>

---

## Further Animations

<div>
<h3 style="height:100px">

<span style="font-size:24px">Scale</span>
<span style="transform: rotate(180deg);display: inline-block;">Rotated</span>
<span style="position:relative;top:25px">Offset</span>
<span style="opacity: 0.5;">Opacity</span>

</h3>
</div>

---vertical---

<div style="display: flex;justify-content: center; align-items: center;">
<div style="flex: 1;text-align: center;">    
<h2>What we’ll build</h2>
<ul>

- What happens when the user clicks **What**?
  - Move the setup Text up
  - The punchline Text expands, fades and spins into view
  - The Tap to Continue Text scales and moves up
- Not very aesthetic, but lots to do and learn!
  - We’ll implement these one by one.

</ul>
</div>
<div style="flex: 1;text-align: center;">
<iframe width="1400" height="600" src="./assets/jokes-animation-demo.mp4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
</div>

---vertical---

## Automatic animation with withAnimation

###### english has died

```swift[7-9]
VStack {
    Text(jokes[currentJoke % jokes.count].setup)
        .padding()

    Button {
        print("Button tapped!!")
        withAnimation {
            showPunchline = true
        }
    } label: {
        Text("What?")
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
    }
    .padding()
...
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Scaling - Create a State var

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[13]
struct ContentView: View {

    var jokes = [...]

    @State var showPunchline = false
    @State var currentJoke = 0
    @State var isFeedbackPresented = false

    @State var isFeedbackResponsePresented = false

    @State var isFeedbackPositive = false

    @State var punchlineSize: CGFloat = 0.1

    var body: some View {
        ZStack {
            Color(.systemBackground)
                .onTapGesture {
                    if showPunchline {
                        currentJoke += 1
                        showPunchline = false
                    }
                }
            ...

```

---vertical---

## Scaling - Connecting State var

```swift[4]
if showPunchline {
    Text(jokes[currentJoke].punchline % jokes.count)
        .padding()
        .scaleEffect(punchlineSize)

    Text("Tap to continue")
        .italic()
        .padding()
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Scaling - Adding Animation

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[5-12]
if showPunchline {
    Text(jokes[currentJoke].punchline % jokes.count))
        .padding()
        .scaleEffect(punchlineSize)
        .onAppear {
            withAnimation(.easeInOut(duration: 0.5)) {
                punchlineSize = 1
            }
        }
        .onDisappear {
            punchlineSize = 0.1
        }

        Text("Tap to continue")
            .italic()
            .padding()
        }
    }
    ...
}
```

---vertical---

<h2>
<span style="transform: rotate(-15deg);display: inline-block;">Rotation</span>
<span> - Create a State var</span>
</h2>

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[13]
struct ContentView: View {

    var jokes = [...]

    @State var showPunchline = false
    @State var currentJoke = 0
    @State var isFeedbackPresented = false

    @State var isFeedbackResponsePresented = false
    @State var isFeedbackPositive = false

    @State var punchlineSize: CGFloat = 0.1
    @State var punchlineRotation: Angle = .zero

    var body: some View {
        ZStack {
            ...
```

---vertical---

<h2 style="padding-bottom:20px;">
<span style="transform: rotate(-30deg);display: inline-block;">Rotation</span>
<span> - Create a State var</span>
</h2>

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[4]
if showPunchline {
    Text(jokes[currentJoke].punchline)
        .padding()
        .scaleEffect(punchlineSize)
        .rotationEffect(punchlineRotation)
        .onAppear {
            withAnimation(.easeInOut(duration: 0.5)) {
                punchlineSize = 1
            }
        }
        .onDisappear {
            punchlineSize = 0.1
        }
    ...
}
```

---vertical---

<h2 style="padding-bottom:50px;">
<span style="transform: rotate(-45deg);display: inline-block;">Rotation</span>
<span> - Adding Animation</span>
</h2>

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[9,14]
if showPunchline {
    Text(jokes[currentJoke].punchline)
        .padding()
        .scaleEffect(punchlineSize)
        .rotationEffect(punchlineRotation)
        .onAppear {
            withAnimation(.easeInOut(duration: 0.5)) {
                punchlineSize = 1
                punchlineRotation = Angle(degrees: 360 * 2)
            }
        }
        .onDisappear {
            punchlineSize = 0.1
            punchlineRotation = .zero
        }

        Text("Tap to continue")
            .italic()
            .padding()
    }
    ...
}
```

---vertical---

<h2>
<span style="opacity:0.7;">Opacity</span>
<span> - Create a State var</span>
</h2>

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[15]
struct ContentView: View {

    var jokes = [...]

    @State var showPunchline = false
    @State var currentJoke = 0
    @State var isFeedbackPresented = false

    @State var isFeedbackResponsePresented = false

    @State var isFeedbackPositive = false

    @State var punchlineSize: CGFloat = 0.1
    @State var punchlineRotation: Angle = .zero
    @State var opacity: Double = 0

    var body: some View {
        ZStack {
            ...
```

---vertical---

<h2>
<span style="opacity:0.5;">Opacity</span>
<span> - Connecting State var</span>
</h2>

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[6,20]
if showPunchline {
    Text(jokes[currentJoke].punchline)
        .padding()
        .scaleEffect(punchlineSize)
        .rotationEffect(punchlineRotation)
        .opacity(opacity)
        .onAppear {
            withAnimation(.easeInOut(duration: 0.5)) {
                punchlineSize = 1
                punchlineRotation = Angle(degrees: 360 * 2)
            }
        }
        .onDisappear {
            punchlineSize = 0.1
            punchlineRotation = .zero
        }
    Text("Tap to continue")
        .italic()
        .padding()
        .opacity(opacity)
}

```

---vertical---

<h2>
<span style="opacity:0.2;">Opacity</span>
<span> - Adding Animation</span>
</h2>

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[11,17]
if showPunchline {
    Text(jokes[currentJoke].punchline)
        .padding()
        .scaleEffect(punchlineSize)
        .rotationEffect(punchlineRotation)
        .opacity(opacity)
        .onAppear {
            withAnimation(.easeInOut(duration: 0.5)) {
                punchlineSize = 1
                punchlineRotation = Angle(degrees: 360 * 2)
                opacity = 1
            }
        }
        .onDisappear {
            punchlineSize = 0.1
            punchlineRotation = .zero
            opacity = 0
        }
    Text("Tap to continue")
        .italic()
        .padding()
        .opacity(opacity)
}

```

---vertical---

<h2>
<span style="position:relative;bottom:20px">Offset</span>
<span> - Create a State var</span>
</h2>

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>


```swift[16]
struct ContentView: View {
    
    var jokes = [...]
    
    @State var showPunchline = false
    @State var currentJoke = 0
    @State var isFeedbackPresented = false
    
    @State var isFeedbackResponsePresented = false
    
    @State var isFeedbackPositive = false
    
    @State var punchlineSize: CGFloat = 0.1
    @State var punchlineRotation: Angle = .zero
    @State var opacity: Double = 0
    @State var tapToContinueOffset: CGFloat = 50
   
    var body: some View {
        ZStack {
            ...
```


---vertical---



<h2>
<span style="position:relative;bottom:35px">Offset</span>
<span> - Connecting State var</span>
</h2>

```swift[5]
...
Text("Tap to continue")
        .italic()
        .padding()
        .opacity(opacity)
        .offset(y: tapToContinueOffset)
...
```

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

<h2>
<span style="position:relative;bottom:50px;">Offset</span>
<span> - Adding Animation</span>
</h2>

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[11,18]
Text(jokes[currentJoke].punchline)
        .padding()
        .scaleEffect(punchlineSize)
        .rotationEffect(punchlineRotation)
        .opacity(opacity)
        .onAppear {
            withAnimation(.easeInOut(duration: 0.5)) {
                punchlineSize = 1 
                punchlineRotation = Angle(degrees: 360 * 2)
                opacity = 1
                tapToContinueOffset = 0
            }
        }
        .onDisappear {
            punchlineSize = 0.1
            punchlineRotation = .zero
            opacity = 0
            tapToContinueOffset = 50
        }
```


---vertical---

## Run your code!!

<video width="1000" controls>
  <source  src="./assets/jokes-animation-demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---

# Full code for Jokes app

---vertical---

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift
import SwiftUI

struct ContentView: View {
    
    var jokes = [Joke(setup: "Why did the chicken cross the road?", 
                      punchline: "To get to the other side!"),
                 Joke(setup: "Why couldn't the bicycle stand up?", 
                      punchline: "It was two tired!"),
                 Joke(setup: "Is this pool safe for diving?", 
                      punchline: "It deep ends"),
                 Joke(setup: "Where do you learn to make ice cream?", 
                      punchline: "Sunday School"),
                 Joke(setup: "Did you hear about the cheese factory that exploded in France?",                       
                      punchline: "There was nothing left but de Brie"),
                 Joke(setup: "Dad, can you put my shoes one?", 
                      punchline: "I dont think they'll fit me")]
    
    @State var showPunchline = false
    @State var currentJoke = 0
    @State var isFeedbackPresented = false
    
    @State var isFeedbackResponsePresented = false
    @State var isFeedbackPositive = false
    
    @State var punchlineSize: CGFloat = 0.1
    @State var punchlineRotation: Angle = .zero
    @State var opacity: Double = 0
    @State var tapToContinueOffset: CGFloat = 50
    
    var body: some View {
        ZStack {
            Color(.systemBackground)
                .onTapGesture {
                    if showPunchline {
                        currentJoke += 1
                        showPunchline = false
                        isFeedbackPresented = true
                    }
                }
            VStack {
                Text(jokes[currentJoke % jokes.count].setup)
                    .padding()
                
                Button {
                    print("Button tapped!!")
                    withAnimation { 
                        showPunchline = true
                    }
                } label: {
                    Text("What?")
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                }
                .padding()
                
                if showPunchline {
                    Text(jokes[currentJoke % jokes.count].punchline)
                        .padding()
                        .scaleEffect(punchlineSize)
                        .rotationEffect(punchlineRotation)
                        .opacity(opacity)
                        .onAppear { 
                            withAnimation(.easeInOut(duration: 0.5)) { 
                                punchlineSize = 1
                                punchlineRotation = .degrees(360 * 2)
                                opacity = 1
                                tapToContinueOffset = 0
                            }
                        }
                        .onDisappear { 
                            punchlineSize = 0.1
                            punchlineRotation = .zero
                            opacity = 0
                            tapToContinueOffset = 50
                        }
                    
                    Text("Tap to continue")
                        .italic()
                        .padding()
                        .opacity(opacity)
                        .offset(y: tapToContinueOffset)
                }
            }
        }
        .alert("Did you like the last joke?", isPresented: $isFeedbackPresented) {
            Button("😍") {
                print("good")
                isFeedbackPositive = true
                isFeedbackResponsePresented = true
            }
            Button("🤮") {
                print("you're a terrible person")
                isFeedbackPositive = false
                isFeedbackResponsePresented = true
            }
        }
        .sheet(isPresented: $isFeedbackResponsePresented) {
            FeedbackResponseView(isPositive: isFeedbackPositive)
        }
    }
}
```


---vertical---

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> FeedbackResponseView.swift</p>

```swift
import SwiftUI

struct FeedbackResponseView: View {
    
    var isPositive: Bool
    
    var body: some View {
        VStack {
            Image(isPositive ? "happy" : "sad")
                .resizable()
                .scaledToFit()
            
            Text(isPositive ? "Thanks, here's a cookie 🍪!" : "Very mean. I will bite you.")
                .padding()
        }
    }
}

#Preview {
    FeedbackResponseView(isPositive: true)
    FeedbackResponseView(isPositive: false)
}

```

---vertical---

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> Joke.swift</p>

```swift
import SwiftUI

struct Joke {
    var setup: String
    var punchline: String
}
```

---

# Extensions
- Make the animations more ridiculous??? 
    - I'm not sure how, but go ahead!
- Add animations to the cat?
    - Maybe slowly zoom in on the cat if you say you didn't like the joke to scare the user into liking it
- Display the current joke number on the screen, so your users know when they’re done with the fun and laughter.

---

# And that's it!

---

### 🤡 Jokes App

# Full Code

[Download Completed Project](https://github.com/tinkercademy/swift-demo-projects/raw/main/Jokes.zip/)
