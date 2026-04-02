## Unit Overview

- [Getting started with Playgrounds](#getting-started)
- [Introduction to SwiftUI](#swiftui)
  - [Texts](#text) • [Images](#image) • [View Modifiers](#view-modifiers) • [Layouts](#layout-with-stacks)
- [More Modifiers](#more-modifiers)
  - [Text Modifiers](#text-modifiers) • [Colours & Padding](#colours--padding) • [Sizing](#sizing) • [Masking](#masking) • [Clip Shapes](#clip-shapes)
- [Links & SF Symbols](#links--sf-symbols)
- [Tips & Tricks](#tips--tricks)

---

# Getting Started

---

<!-- .slide: class="layout-steps-media" -->
## Create a Playground App

1. Press the ![New Project Button](/markdown/track_b/assets/new-project-button.png) icon to create a new app.
2. Hold down on the newly created app and tap **Rename**.
3. Name it **Name Card**.
4. Tap on the app to open it.

![A screenshot of the New Project screen in Swift Playgrounds.](/markdown/track_b/assets/new-project.png)

---

<!-- .slide: class="layout-media-centre" -->
![A screenshot of an empty Playgrounds project with ContentView open.](/markdown/track_b/assets/playgrounds-empty-project.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
![An annotated Playgrounds screenshot pointing out the sidebar, toolbar, tab bar, editor, and console.](/markdown/track_b/assets/annotated-playgrounds-interface.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## What's in the Toolbar

![An annotated Playgrounds screenshot pointing out the various buttons in the toolbar.](/markdown/track_b/assets/annotated-playgrounds-toolbar.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-steps-media" -->
## Configuring Your Project

1. Open the sidebar.
2. Select App Settings.
3. Make sure your app's name is **Name Card**.
4. Select your favourite colour as your *Accent Color*.

![The app settings screen in Swift Playgrounds.](/markdown/track_b/assets/playgrounds-app-settings.png)

---

<!-- .slide: class="layout-steps-media" -->
## Setting an App Icon

1. Open the iPad Camera app.
2. Take a selfie.
3. Back in Playgrounds:
   1. Select Custom App Icon.
   2. Choose from Photos.
   3. Add the image you just took.
4. You're now an app icon.

![The custom app icon flow in Swift Playgrounds.](/markdown/track_b/assets/playgrounds-app-settings-custom-icon.png)

---

# SwiftUI

### _SwiftUI_ is Apple's newest toolkit for building apps on Apple platforms such as iOS, iPadOS, macOS, visionOS, and more.

### We create user interfaces using `View`s such as `Text`, `Image`, and `Stack`s.

[Apple Developer Documentation](https://developer.apple.com/documentation/swiftui)

---

## Text

- In the starter code, look for this line of `Text`:

```swift
Text("Hello, world")
```

- Change the words in the string — that's the text inside the double quotes — to your name!

```swift
Text("YJ Soon")
```

- Run, and it'll be reflected in the app.
- You can add more text underneath the existing one! Perhaps add what you do. For me, that's

```swift
Text("Swift instructor")
```

---

<!-- .slide: class="layout-code-focus" -->
```swift[9-10]
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundColor(.accentColor)
            Text("YJ Soon")
            Text("Swift Instructor")
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

## Image

- A name card needs an image.
- We'll take a photo of ourselves, and put it into our app!
- To do this, we'll use a `View` called `Image`. You would have already seen an example right above the `Text`.
  - In Playgrounds, we can take a photo, and show it on-screen using the `Image` view below. Add the photo's name in the quotes.

  ```swift
   Image("MyImageName")
  ```

  - This is just like the `Text`s we saw!

---

<!-- .slide: class="layout-steps-media" -->
## Importing Images

1. Open the sidebar ![Left Sidebar Icon](/assets/icons/sidebar.left.svg).
2. Tap the Add File button ![New Document Icon](/assets/icons/doc.badge.plus.svg).
3. Select Photo.
4. Select a photo from your Photos.
5. You'll see your image in the **Assets** section.
6. Hold down on its name and select **Rename**.
7. Name it **MyImage**.

![The Assets section with an imported photo.](/markdown/track_b/assets/playgrounds-image-asset.png)

---

<!-- .slide: class="layout-steps-media" -->
## Adding Your Image

1. Replace the ![Globe Icon](/assets/icons/globe.svg) `Image` provided with your own image.
2. Change:

```swift[6]
Image(systemName: "globe")
    .imageScale(.large)
    .foregroundColor(.accentColor)
```

to:

```swift[6]
Image("MyImage")
```

This will make sure that your image shows up on screen.

3. Get a heart attack because your face now looks gigantic.
4. Add the `.resizable()` and `.scaledToFit()` modifiers to fix this.

![A preview of the imported image in Swift Playgrounds.](/markdown/track_b/assets/playgrounds-image-preview.png)

---

## View Modifiers

- SwiftUI has hundreds of different modifiers that we can use to make our individual Views look better, we can add View Modifiers (or just modifiers).
- These are additional pieces of formatting and functionality “tacked on” to each View.
- To add a modifier, add it to the end of a View, like this: `.modifierName()`
- We'll introduce a variety of modifiers, and add them to various elements, to help enhance our app.

---

<!-- .slide: class="layout-code-focus" -->
```swift[3:4-6]
struct ContentView: View {
    var body: some View {
        VStack {
            Image("MyImage")
                .resizable()
                .scaledToFit()
            Text("YJ Soon")
            Text("Swift Instructor")
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

## Layout with Stacks

- In SwiftUI, our UI is reflected directly in our code
  - This means the first thing on the screen is often the first thing shown, at the top, then going down
- What if we want to lay things out horizontally, or back-to-front? Introducing three different stacks:
  - `VStack`, for vertical stacking
  - `HStack`, for horizontal stacking
  - `ZStack`, for back-to-front stacking, also known as _Depth Stack_.

---

<!-- .slide: class="layout-steps-media" -->
## `VStack`

- We've seen it already. There was one provided free for us when we created our app.
- If you are arranging items vertically, you'll need a `VStack`.

![A diagram showing a VStack layout.](/markdown/track_b/assets/vstack-diagram.png)

---

<!-- .slide: class="layout-code-focus" -->
```swift[3:3,9]
struct ContentView: View {
    var body: some View {
        VStack {
            Image("MyImage")
                .resizable()
                .scaledToFit()
            Text("YJ Soon")
            Text("Swift Instructor")
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-steps-media" -->
## `HStack`

- We want our image to be on the left of the two pieces of text.
- To do this, we can use a `HStack`, containing two `View`s:
  - The `Image` itself, on the left
  - The `VStack`, on the right

![A diagram showing an HStack layout.](/markdown/track_b/assets/hstack-diagram.png)

---

<!-- .slide: class="layout-code-focus" -->
```swift[3:3,7,10,11]
struct ContentView: View {
    var body: some View {
        HStack {
            Image("MyImage")
                .resizable()
                .scaledToFit()
            VStack {
                Text("YJ Soon")
                Text("Swift Instructor")
            }
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-steps-media" -->
## What's in What?

- We've started nesting `HStack`s in `VStack`s and this can quickly get confusing when you're trying to figure out what belongs in which stack view.
- You can tap on either `{` or `}` to get the entire area highlighted.

![A highlighted pair of curly braces in Swift Playgrounds.](/markdown/track_b/assets/playgrounds-curly-brace-highlight.png)

---

## HStack Parameters

- What if we want our image and our text to be nicely aligned at the top?
- We can introduce parameters to our `HStack` — the way we did for `Image`, but before the curly braces.
- The parameter in question is called `alignment:`, and it can be `.top`, `.center`, `.bottom`.
  - The dots are because of something called enumerations (enums), which we'll talk about in the future.
- There's another parameter, called `spacing:`, which takes a number. Try it out if you have a chance!

---

<!-- .slide: class="layout-code-focus" -->
```swift[3:3]
struct ContentView: View {
    var body: some View {
        HStack(alignment: .top) {
            Image("MyImage")
                .resizable()
                .scaledToFit()
            VStack {
                Text("YJ Soon")
                Text("Swift Instructor")
            }
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

## `ZStack` — Depth Stack

- Let's add some background colour to our app.
- A background colour will, naturally, go behind the `View`s.
- In SwiftUI, a background colour is a View, that goes behind other Views, using a `ZStack`.
- The `Color` View has a few built-in options you can use, such as `.blue`, `.red`, `.yellow`, and `.green`. Try them out.

*🇺🇸 American spelling, because _Designed by Apple in California_ and all that.*

---

<!-- .slide: class="layout-code-focus" -->
```swift[3:3-4,14]
struct ContentView: View {
    var body: some View {
        ZStack {
            Color.red
            HStack(alignment: .top) {
                Image("MyImage")
                    .resizable()
                    .scaledToFit()
                VStack {
                    Text("YJ Soon")
                    Text("Swift Instructor")
                }
            }
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

# More Modifiers

## More ways to modify your views!

---

## View Modifiers

- To make our individual Views look better, we can add View Modifiers (or just modifiers).
- These are additional pieces of formatting and functionality “tacked on” to each View.
- We'll introduce a variety of modifiers, and add them to various elements, to help enhance our app.

---

## Text Modifiers

- Make `Text` **bold**.

```swift
.bold()
```

- Make `Text` _italic_.

```swift
.italic()
```

- Changes `Text` font size to `100`.

```swift
.font(.system(size: 100))
```

---

<!-- .slide: class="layout-code-focus" -->
```swift[3:11-13,15]
struct ContentView: View {
    var body: some View {
        ZStack {
            Color.red
            HStack(alignment: .top) {
                Image("MyImage")
                    .resizable()
                    .scaledToFit()
                VStack {
                    Text("YJ Soon")
                        .bold()
                        .italic()
                        .font(.system(size: 40))
                    Text("Swift Instructor")
                        .font(.system(size: 20))
                }
            }
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

## Colours & Padding

- Makes the foreground style (for example the `Text` or symbol colour) blue.

```swift
.foregroundStyle(.blue)
```

- Make the background of any `View` red.

```swift
.background(.red)
```

- Gives some space to any View.

```swift
.padding()
```

You can also include a number, to define how much padding to give

_Note that order matters. If you add padding before a background, your padding will also receive that background._

---

<!-- .slide: class="layout-code-focus" -->
```swift[3:14-16]
struct ContentView: View {
    var body: some View {
        ZStack {
            Color.red
            HStack(alignment: .top) {
                Image("MyImage")
                    .resizable()
                    .scaledToFit()
                VStack {
                    Text("YJ Soon")
                        .bold()
                        .italic()
                        .font(.system(size: 40))
                        .padding()
                        .foregroundStyle(.green)
                        .background(.blue)
                    Text("Swift Instructor")
                        .font(.system(size: 20))
                }
            }
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

## Sizing

```swift
.frame(width: 100, height: 100)
```

- Adjust the size of a `View`. Both parameters are optional, play around to see which parameter(s) may need to size your image.
- This will be great for our images to ensure it has a decent size.
- **Important:** While this modifier can be used to easily layout your views, you should use `VStack`s and `HStack`s instead as it - allows your views to easily scale, especially since our apps should work on screens no matter the size.

---

<!-- .slide: class="layout-code-focus" -->
```swift[3:9]
struct ContentView: View {
    var body: some View {
        ZStack {
            Color.red
            HStack(alignment: .top) {
                Image("MyImage")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 100)
                VStack {
                    Text("YJ Soon")
                        .bold()
                        .italic()
                        .font(.system(size: 40))
                        .padding()
                        .foregroundStyle(.green)
                        .background(.blue)
                    Text("Swift Instructor")
                        .font(.system(size: 20))
                }
            }
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

## Masking

- Mask or crop content behind the `View` given as a parameter (in curly braces).

```swift
.mask { Circle() }
```

- Try adding `Text` as a parameter, to see how an image shows up when masked by text.
  ```swift
  .mask {
      Text("Hello")
          .font(.system(size: 250))
  }
  ```
- You can also use an SF Symbols icons as a mask.
  ```swift
  .mask {
      Image(systemName: "star.fill")
          .font(.system(size: 250))
  }
  ```

---

## Clip Shapes

- Clips a view by a shape. In this case, it will be clipped by a circle.

```swift
.clipShape(Circle())
```

- You can also use `RoundedRectangle` to get rounded corner.

```swift
.clipShape(RoundedRectangle(cornerRadius: 16))
```

---

<!-- .slide: class="layout-code-focus" -->
```swift[3:10]
struct ContentView: View {
    var body: some View {
        ZStack {
            Color.red
            HStack(alignment: .top) {
                Image("MyImage")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 100)
                    .clipShape(Circle())
                VStack {
                    Text("YJ Soon")
                        .bold()
                        .italic()
                        .font(.system(size: 40))
                        .padding()
                        .foregroundStyle(.green)
                        .background(.blue)
                    Text("Swift Instructor")
                        .font(.system(size: 20))
                }
            }
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

# Links & SF Symbols

## 🔗 Open URLs in your app!

---

<!-- .slide: class="layout-steps-media" -->
## Set Up

- We'll create some tappable icons in a `HStack` for users of our app to find out more about us.
- Within the `VStack`, create an empty `HStack`. It will be populated with our `Link`s later.

![A diagram showing the link row layout.](/markdown/track_b/assets/link-diagram.png)

---

<!-- .slide: class="layout-steps-media" -->
## ![Link Icon](/assets/icons/link.svg) Adding a Link

1. Tap on the space within the `HStack` to create an insertion point.
2. In the toolbar, select ![Views Library Icon](/assets/icons/dot.square.svg) to open the *Views Library*.
3. Search for and select **![Link Icon](/assets/icons/link.svg) Link**.

![The Views Library showing the Link view.](/markdown/track_b/assets/playgrounds-views-library-link.png)

---

## Setting the `Link` Destination

1. Tap on the `URL` placeholder.
2. Replace it with the following

```swift
URL(string: "https://apple.com")!
```

Feel free to change the link from [apple.com](https://apple.com) to something else.

- Use `https://` to link to a website: `https://swiftinsg.org`
- Use `mailto:` to add an email address: `mailto:hello@swiftinsg.org`
- If you're interested, you can read [this awfully technical document](https://www.rfc-editor.org/rfc/rfc7595.html) on URI schemes.

---

<!-- .slide: class="layout-steps-media" -->
## ![SF Symbols Icon](/assets/icons/star.circle.svg) Adding SF Symbols

1. Tap on the `Text("Link")` placeholder.
2. In the toolbar, select ![Symbols Library Icon](/assets/icons/star.circle.svg) to open the *Symbols Library*.
3. Browse through hundreds of beautifully designed icons that you can use within your apps.
4. When you've found one you like, select it and it will automatically add itself into your code.
5. After you're done, add more links.
6. Use modifiers you learnt earlier to customise them.

![The Symbols Library in Swift Playgrounds.](/markdown/track_b/assets/playgrounds-symbols-library.png)

---

<!-- .slide: class="layout-code-focus" -->
```swift[3:21-28]
struct ContentView: View {
    var body: some View {
        ZStack {
            Color.red
            HStack(alignment: .top) {
                Image("MyImage")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 100)
                    .clipShape(Circle())
                VStack {
                    Text("YJ Soon")
                        .bold()
                        .italic()
                        .font(.system(size: 40))
                        .padding()
                        .foregroundStyle(.green)
                        .background(.blue)
                    Text("Swift Instructor")
                        .font(.system(size: 20))
                    HStack {
                        Link(destination: URL(string: "mailto:hello@tk.sg")!) {
                            Image(systemName: "mail")
                        }
                        Link(destination: URL(string: "https://tk.sg/importantLink")!) {
                            Image(systemName: "pc")
                        }
                    }
                    .font(.system(size: 20))
                    .foregroundStyle(.yellow)
                    .padding(.top)
                }
            }
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

### 🪪 Name Card App

# Full Code

[Download Completed Project](https://github.com/tinkercademy/swift-demo-projects/raw/main/Name%20Card.zip/)

---

<!-- .slide: class="layout-code-focus" -->
## ![Swift](/assets/swift-logo.svg) ContentView

```swift[1:]
import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            Color.red
            HStack(alignment: .top) {
                Image("MyImage")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 100)
                    .clipShape(Circle())
                VStack {
                    Text("YJ Soon")
                        .bold()
                        .italic()
                        .font(.system(size: 40))
                        .padding()
                        .foregroundStyle(.green)
                        .background(.blue)
                    Text("Swift Instructor")
                        .font(.system(size: 20))
                    HStack {
                        Link(destination: URL(string: "mailto:hello@tk.sg")!) {
                            Image(systemName: "mail")
                        }
                        Link(destination: URL(string: "https://tk.sg/importantLink")!) {
                            Image(systemName: "pc")
                        }
                    }
                    .font(.system(size: 20))
                    .foregroundStyle(.yellow)
                    .padding(.top)
                }
            }
        }
    }
}
```

---

# Tips & Tricks

## Be a better developer, or at least look the part.

---

## Dark mode vs. Light mode

- On Playgrounds, your app looks different in dark mode and light mode!
  - Switch between the two in your Control Center to see how it looks
  - Hold down on the brightness slider and then tap Dark Mode.
  - To find out more, refer to [this article](https://support.apple.com/en-us/HT210332) by Apple.

---

## A Note on `View`s Taking Up Space

- You may have noticed that some `View`s behave differently with respect to the space around them, e.g. an `Image` with and without `.resizable()`
- Views behave one way or the other:
  - Fit: These Views exercise a lot 💪 take up only as much space as their contents need.
    - Fitting Views include `Text`, `Image`, and all three `Stack`s.
    - You can make them fill by using the `.frame` modifier with `maxWidth: .infinity` or `maxHeight: .infinity`
  - Fill: These Views take up as much space as they can, like someone stretching out on a bed.
    - Filling Views include `Color`, `Image.resizable()`, and all shapes (`Circle`, `RoundedRectangle`, etc.)
    - You can size them down using the `.frame` modifier with a fixed `width` and/or `height`.

---

## SF Symbols variations

- Adding `.fill` behind the name of some SF Symbols icons can give you a filled-in version of the icon. Try this with `star` and `star.fill`.
- Some icons have multiple colours!
- You can see these in the Multicolour section in the _Symbols Library_.
- To show icons with colour, before any foregroundStyle modifier, use the `.renderingMode(.original)` modifier

```swift
Image(systemName: "sunrise.fill")
    .renderingMode(.original)
```

---

## Curly Braces

- With lots of curly braces, it can be hard to see where to add a modifier or put the next View
- Here are two ways to identify a block (pair of curly braces):
  - Move your cursor on or around each curly brace to see its corresponding matched pair
  - Double-click on each curly brace to highlight the entire block
- You can also drag a handle on the last curly brace `}` to “extend” it downwards, e.g. when creating a `VStack` above a `View` you want to include

---

## Indentation

```txt
Is your code indented properly?
    Poorly indented
        Code
                            can be very
hard to read
```

- Playgrounds is quite strict about indentation — the app will make sure `View`s that are within other `View`s are one “level” deeper in indentation
- If anything goes wrong, let Playgrounds auto-fix it for you
  - Select all your code with `Command`-`A` (`⌘A`), or Edit → Select All
  - Re-Indent all your code automatically with `Control`-`I` (`^I`), or Edit → Re-Indent
