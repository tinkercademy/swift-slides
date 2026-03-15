# Laying out Jokes

## Set up those `VStack`s, `HStack`s, `Button`s, `Text`s and all that fun stuff.

---

<!-- .slide: class="layout-steps-media" -->
## Create a Playground App

1. Press the ![New Project Button](/markdown/track_b/assets/new-project-button.png) icon to create a new App
2. Hold down on the newly created app and tap **Rename**
3. Name it **"Jokes"**
4. Tap on the app to open it

![New Project](/markdown/track_b/assets/new-project.png)

---

<!-- .slide: class="layout-media-centre" -->
## This is how it should look like

![New app screenshot](/markdown/track_b/assets/jokes-new-app-ss.PNG)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## Jokes layout

![Jokes layout](/markdown/track_b/assets/jokes-layout.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->

![Jokes layout 2](/markdown/track_b/assets/jokes-layout2.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## Nothing too new here.

![Jokes starter](/markdown/track_b/assets/jokes-starter.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## What's going on here

![Jokes starter explained](/markdown/track_b/assets/jokes-starter-explained.png)
<!-- .element: class="r-stretch" -->

---

## **What??** _Tell me!!_

Here's a fun feature in Text — if you add `**` around parts of your string, you get bold text; if you surround your text with `_`, you get italics. This is a markup format called Markdown, which you may have seen in WhatsApp, Telegram and other messaging apps. [Read more here.](https://www.markdownguide.org/)

```swift
Text("What?? **_Tell me_!!**")
```

---

# Adding Jokes

## Store Jokes in structs, store the structs in an array.

---

<!-- .slide: class="layout-steps-media" -->
## Create a new Swift File

- Tap on ![Left Sidebar Icon](/assets/icons/sidebar.left.svg)
- Press ![New Document Icon](/assets/icons/doc.badge.plus.svg)
- Choose Swift File ![Swift](/assets/swift-logo.svg)
- Name it Joke
  - Uppercase (not joke)
  - Singular (not Jokes)

![New file](/markdown/track_b/assets/jokes-new-file.png)

---

<!-- .slide: class="layout-code-focus" -->
## Creating Jokes

```swift[3-6]
import SwiftUI

struct Joke {
    var setup: String
    var punchline: String
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Adding Jokes

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-media-centre" -->
## Show First Joke

![Using structs](/markdown/track_b/assets/jokes-using-structs.png)
<!-- .element: class="r-stretch" -->

---

## Showing and Hiding Punchline

### We can't show punchline immediately, it ruins the joke.

---

## What we want

- When the user launches the app, they see the first joke's setup
  - The punchline, and tap to continue `Text`, are hidden
- When the user taps on What? `Button`, they see the punchline and tap to continue `Text`.

---

<!-- .slide: class="layout-code-focus" -->
## Declare State Variable

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-media-centre" -->
## Hide the punchline!

![Hide punchline](/markdown/track_b/assets/jokes-hide-punchline.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## Show Punchline when What? tapped

![Show punchline](/markdown/track_b/assets/jokes-show-punchline.png)
<!-- .element: class="r-stretch" -->

---

## More Jokes, More `@State` vars

### Advance to the next joke, and the next joke, and the next joke, and the next joke, and the next joke, and the next joke. But not too many, because it'll crash.

---

## What we need to do

- What to do?
  - When the user taps the background,
    - Show next joke
    - Hide punchline
  - Out of jokes? Loop back.
- How we're going to do it
  - Create a `@State` variable to keep track of the current joke
  - On tap, increment said variable
  - Use modulo `%` to make it loop back!
  - Hide the punchline

---

<!-- .slide: class="layout-code-focus" -->
## Declare State Variable

```swift[5-6]
struct ContentView: View {

    var jokes = [...]

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-media-centre" -->
## Implementing currentJoke

![Implementing currentJoke](/markdown/track_b/assets/jokes-currentJoke.png)
<!-- .element: class="r-stretch" -->

---

## Embed in ZStack

- The goal is to have the entire background tappable
- If we attach the tap gesture recogniser to the `VStack`, only a space around the middle is tappable
- That's not ideal
- We can instead create a `ZStack` with a `Color.clear` and attach a tap gesture recogniser to it.

---

## Embed VStack in ZStack

- Create an empty ZStack above the VStack
- See the little handle at the `}`?
- Drag it to encompass the VStack

---

## Tap Gesture Recogniser

```swift
.onTapGesture {
    // do something
}
```

- An invisible `Button`, attached to a View
- Listens and runs an action when the View is tapped
- For this app, we want to use a Tap Gesture Recogniser on the background to advance to the next joke.

---

<!-- .slide: class="layout-media-centre" -->

![ZStack implementation](/markdown/track_b/assets/jokes-zstack.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->

![Crashed](/markdown/track_b/assets/crashed.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-steps-media" -->
## What does this mean?

- This just means we ran out of jokes
- Swift doesn't know what to do now because there are no more jokes to show the user.
- Possible solutions
  - Stop the user from seeing more jokes after we're out of jokes
  - Assume the user has a memory of a goldfish and loop back, hoping they don't notice the jokes have looped.
    - We'll go for this option.

![Index out of range](/markdown/track_b/assets/jokes-indexoutofrange.png)

---

## 2 Approaches

- Reset `currentJoke` every time we hit the number of items in jokes
- Loop around!
  - To do this, we'll get the remainder when the `currentJoke` is divided by the number of items in `jokes`
  - We'll go with this one.

---

<!-- .slide: class="layout-media-centre" -->

![Reset index](/markdown/track_b/assets/jokes-resetindex1.png)
<!-- .element: class="r-stretch" -->

---

# Jokes App Pro Max

## Designed for professional jokers.

---

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

---

## Alerts

### A pop-up that your user has to dismiss. Fun!

---

<!-- .slide: class="layout-steps-media" -->
## What? Why alert?

- After each joke, ask the user what they thought of it.
- We don't really do much with the response.
  - It gives the user the illusion that we care about their feelings.
  - More importantly, it lets us show you how to use alerts.

![Alert screenshot](/markdown/track_b/assets/jokes-alert-ss.jpeg)

---

<!-- .slide: class="layout-code-focus" -->
## More States

```swift[5-8]
struct ContentView: View {

    var jokes = [...]

    @State var showPunchline = false
    @State var currentJoke = 0
    @State var isFeedbackPresented = false

    var body: some View {
        ZStack {
            ...
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-steps-media" -->
## Run your code!!

- An alert shows up!!!!
- Messages get printed out to your console!!
- We're not exactly making the user experience any better with an alert appearing after every joke but… who cares?

<video controls>
  <source src="/markdown/track_b/assets/jokes-alert-demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---

## How does the alert work?

- Note how we made the alert work!
  - We set up a `@State` variable, a `Bool`, to determine whether the alert shows up. This variable starts off as `false`, i.e. "don't show the alert".
  - When we want the alert to show up, we change that variable to `true`, i.e. "show the alert".
  - We pass this variable to the `.alert` modifier as a binding (the `$` sign), so that when it's dismissed, the modifier can set it back to `false`.
- This is a form of _declarative_ programming. More on this later.

---

## Alert Extensions

### More alerty stuff

---

<!-- .slide: class="layout-steps-media" -->
## Button Roles

- **`.destructive`**: If an alert button results in a destructive action, like deleting content, specify the destructive button style to help people recognize it.
- **`.cancel`**: A Cancel button provides a clear, safe way to avoid a destructive action. Cancel buttons are default buttons so that people must intentionally choose a button other than the default to continue with the destructive action.

![Delete files alert](/markdown/track_b/assets/jokes-alert-deletefiles.png)

---

<!-- .slide: class="layout-code-focus" -->

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-steps-media" -->
## Alert Messages

- Only add an alert message if it is needed
- Add a short succinct message to provide the user with additional context and information.

![Alert description](/markdown/track_b/assets/jokes-alert-description.png)

---

<!-- .slide: class="layout-code-focus" -->

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

# Sheets

### Now, let's show an entire new screen over the current screen! This is a modal sheet, where we want the user to focus on what's this new screen.

---

<!-- .slide: class="layout-steps-media" -->
## What are Sheets?

- Sheets are screens presented on top of the current screen that makes the current screen inactive
- Essentially, creating new screens on top of the current screen
- We'll put this screen in a separate file, and call it `FeedbackResponseView`

![Sheet screenshot](/markdown/track_b/assets/jokes-sheet-1-ss.jpeg)

---

## Aim of `FeedbackResponseView`

- We'll need this to show either a happy cat and positive message (good feedback), or angry cat and negative message (bad feedback)
- Instead of having two separate `View`s, we'll have a single `View` that shows a different image and text based on feedback
- Think of the `View` as a function, which has to…
  - Take in a `Bool` to indicate if the feedback is positive or negative
  - Update the a `Text` and `Image` with new content

---

## Importing Images into Swift Playground

### Adding images to the assets catalogue

---

## Preparing Assets

- Find some cat images and save them to your iPad's Photos.
  - You can search for some of them online
  - Make sure to use png, jpeg, jpg or gif (however gifs aren't animated)

---

<!-- .slide: class="layout-steps-media" -->
## Importing Images

- Open the **Sidebar** ![Left Sidebar Icon](/assets/icons/sidebar.left.svg)
- Tap on the **Add File** button ![New Document Icon](/assets/icons/doc.badge.plus.svg)
- Select Photo ![Photo dropbar](/markdown/track_b/assets/photo-dropbar.png)
- Select a photo from your Photos!
- You'll see your image in the **Assets** section
- Hold down on it's name and select Rename
- Name it **"happy"**!
- Repeat this for the second image and name it **"sad"**.

![Adding images](/markdown/track_b/assets/jokes-add-images.png)

---

## Back to Sheets

### or, fancy pop-ups. But first, let's set up the image and text!

---

## Create a new `View`

- Tap on ![Left Sidebar Icon](/assets/icons/sidebar.left.svg)
- Press ![New Document Icon](/assets/icons/doc.badge.plus.svg)
- Choose **Swift File** ![Swift](/assets/swift-logo.svg)
- Name it **FeedbackResponseView**
- Copy the code from [tk.sg/swiftNewView](https://tk.sg/swiftNewView)
- Paste it in!

---

<!-- .slide: class="layout-media-centre" -->

![New view screenshot](/markdown/track_b/assets/jokes-new-view-ss.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-steps-media" -->
## Updating your code.

- Replace all instances of the _`MyView`_ with your _`FeedbackResponseView`_.

![New view renamed](/markdown/track_b/assets/jokes-new-view-renamed-ss.png)

---

<!-- .slide: class="layout-media-centre" -->

![Model view explained](/markdown/track_b/assets/jokes-model-view-explained.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## Positive Feedback

![Feedback view](/markdown/track_b/assets/jokes-feedbackview1.png)
<!-- .element: class="r-stretch" -->

---

## Receiving input in our `View`

- Instead of creating 2 separate views to show response to positive and negative feedback, we modify the contents of this one view
- In this case, we pass in a boolean value to indicate whether it is positive feedback or not
  - This doesn't need to be a `@State` variable. Can you figure out why?
- We'll the use a ~~cool people's if statement~~ **ternary operator** to decide which image to show

---

<!-- .slide: class="layout-steps-media" -->
## Ternary Operators

- Ternary operators are single-line if-else statements ~~that make you feel cool using them.~~

![Ternary Operators](/markdown/track_b/assets/Ternary-Operators.png)

---

<!-- .slide: class="layout-media-centre" -->
## Receiving Feedback Data

The `isPositive` variable will be passed in _(or injected)_ when the View is created

![Two previews](/markdown/track_b/assets/jokes-2-previews.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## Updating Content using isPositive

![isPositive](/markdown/track_b/assets/jokes-isPositive.png)
<!-- .element: class="r-stretch" -->

---

## Presenting a Sheet

- Sheets are controlled by a `@State` variable that can be set to `true` to present the modal
  - Similar to the alert!
  - Actually, alerts, like sheets, present a new View.
- In this case, we will be creating a sheet to show a response to the user's feedback
- Think of this `@State` variable as a "barrier" for the sheet to show up from the bottom of the screen. When true, we're letting it pop up!

---

<!-- .slide: class="layout-media-centre" -->

![Feedback presentation in ContentView](/markdown/track_b/assets/jokes-feedback-presentation-contentview.png)
<!-- .element: class="r-stretch" -->

---

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

---

<!-- .slide: class="layout-code-focus" -->
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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-steps-media" -->
## Run your code!!

- An alert shows up!!!!
- A sheet shows up after the alert!!
- The sheet changes based on whether the user liked it or not.

<video controls>
  <source src="/markdown/track_b/assets/jokes-demo-alerts-working.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---

## Further Animations

### Scale · Rotated · Offset · Opacity

---

<!-- .slide: class="layout-steps-media" -->
## What we'll build

- What happens when the user clicks **What**?
  - Move the setup Text up
  - The punchline Text expands, fades and spins into view
  - The Tap to Continue Text scales and moves up
- Not very aesthetic, but lots to do and learn!
  - We'll implement these one by one.

<video controls>
  <source src="/markdown/track_b/assets/jokes-animation-demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---

<!-- .slide: class="layout-code-focus" -->
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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Scaling - Create a State var

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Scaling - Adding Animation

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Rotation - Create a State var

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Rotation - Create a State var

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Rotation - Adding Animation

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Opacity - Create a State var

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Opacity - Connecting State var

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Opacity - Adding Animation

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Offset - Create a State var

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Offset - Connecting State var

```swift[5]
...
Text("Tap to continue")
        .italic()
        .padding()
        .opacity(opacity)
        .offset(y: tapToContinueOffset)
...
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->
## Offset - Adding Animation

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

## Run your code!!

<video width="1000" controls>
  <source  src="/markdown/track_b/assets/jokes-animation-demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

---

# Full code for Jokes app

---

<!-- .slide: class="layout-code-focus" -->

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

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-code-focus" -->

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

![Swift](/assets/swift-logo.svg) FeedbackResponseView.swift

---

<!-- .slide: class="layout-code-focus" -->

```swift
import SwiftUI

struct Joke {
    var setup: String
    var punchline: String
}
```

![Swift](/assets/swift-logo.svg) Joke.swift

---

# Extensions
- Make the animations more ridiculous??? 
    - I'm not sure how, but go ahead!
- Add animations to the cat?
    - Maybe slowly zoom in on the cat if you say you didn't like the joke to scare the user into liking it
- Display the current joke number on the screen, so your users know when they're done with the fun and laughter.

---

# And that's it!

---

### 🤡 Jokes App

# Full Code

[Download Completed Project](https://github.com/tinkercademy/swift-demo-projects/raw/main/Jokes.zip/)
