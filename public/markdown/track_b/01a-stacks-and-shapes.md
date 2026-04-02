# Set Up an App Playground

---

<!-- .slide: class="layout-steps-media" -->
### Create a New App

- Tap App to start a new app playground.

![Show the Create an App button highlighted in the Swift Playgrounds app.](/markdown/track_b/assets/shapes-create-app-ss.jpg)

---

<!-- .slide: class="layout-two-up" -->
## Rename the App

1. Tap and hold on the app playground until the menu appears.
2. Give your project a descriptive name, like **Self Portrait**, and tap Done.

![Shows a Playgrounds home page with the press-and-hold menu.](/markdown/track_b/assets/shapes-rename-app1-ss.jpg)
![Shows a Playgrounds home page with the rename pop-up.](/markdown/track_b/assets/shapes-rename-app2-ss.jpg)

---

<!-- .slide: class="layout-two-up" -->
## Remove the Default Text

- Delete the image and text in the `VStack` (vertical stack).
- Give your project a descriptive name, like **Self Portrait**, and tap Done.

![Default project content before it is deleted.](/markdown/track_b/assets/shapes-delete-content1-ss.jpg)
![Default project content after it is deleted.](/markdown/track_b/assets/shapes-delete-content2-ss.jpg)

---

# Self Portrait App

---

<!-- .slide: class="layout-media-centre" -->
## Adding a ZStack

- Change the `VStack` to a `ZStack` (depth stack).

![Empty ContentView.swift with ZStack.](/markdown/track_b/assets/shapes-step1-ss.jpg)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## Adding a Face

- Open the list of views ![View button](/markdown/track_b/assets/view-icon.png) and scroll to the bottom to find the capsule, circle, ellipse, rectangle, and rounded rectangle shapes.

![View button highlighted.](/markdown/track_b/assets/shapes-step2-ss.jpg)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## Adding a Face

- Add a shape to the `ZStack` for your head. Use a `RoundedRectangle` for a square face, or a `Capsule` for a rounder face.

![ContentView.swift with one capsule.](/markdown/track_b/assets/shapes-step3-ss.jpg)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-code-focus" -->
## Tip: Rounded Rectangle

- `RoundedRectangle` requires a `cornerRadius` parameter to be set.

```swift[6]
import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 20)
        }
    }
}
```

![Swift](/assets/swift-logo.svg) ContentView.swift

---

<!-- .slide: class="layout-media-centre" -->
## Shaping the Face

- Add a blank line below the capsule, then open the list of modifiers.

![Opening the modifier list for the face.](/markdown/track_b/assets/shapes-step4-ss.jpg)
<!-- .element: class="r-stretch" -->

---

# `Frames` and `foregroundStyle`

---

<!-- .slide: class="layout-two-up" -->
## Shaping the Face

- Search for `frame` and tap to add it to your code.
- Fill in the approximate values for height and width to create your head.

![Searching for the frame modifier.](/markdown/track_b/assets/shapes-step5-1-ss.jpg)
![The face after adding a frame modifier.](/markdown/track_b/assets/shapes-step5-2-ss.jpg)

---

<!-- .slide: class="layout-two-up" -->
## Colouring the Face

- Add a blank line below `frame`, then open the list of modifiers.
- Type `foregroundStyle` into the search bar. Tap to add it to your code.

![Searching for foregroundStyle.](/markdown/track_b/assets/shapes-step6-1-ss.jpg)
![Adding foregroundStyle to the code.](/markdown/track_b/assets/shapes-step6-2-ss.jpg)

---

<!-- .slide: class="layout-two-up" -->
## Colouring the Face

- To change the colour, select the code inside the parentheses and open the list of colours.
- Tap any colour to add it to your code.

![Selecting the foregroundStyle colour.](/markdown/track_b/assets/shapes-step7-1-ss.jpg)
![Choosing a colour from the list.](/markdown/track_b/assets/shapes-step7-2-ss.jpg)

---

<!-- .slide: class="layout-two-up" -->
## Tip: Custom colours

- Optionally, create your own colour. Choose one of the code snippets, then edit the values to match your skin tone.

```swift
// Add colour with RGBA
.foregroundStyle(Color(
    red: 0.6,
    green: 0.4,
    blue: 0.3,
    opacity: 1.0
))
```

```swift
// Add colour with HSV
.foregroundStyle(Color(
    hue: 0.1,
    saturation: 0.9,
    brightness: 0.4
))
```

---

# Offset and Trim

---

<!-- .slide: class="layout-media-centre" -->
## Creating the Neck

- Apply what you've learned to add a **rectangle** for your neck and adjust the size with a `frame` modifier.

![A rectangle added for the neck.](/markdown/track_b/assets/shapes-step8-ss.jpg)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-two-up" -->
## Adjusting the Neck

- Add a blank line below the rectangle, then search for `offset` in the list of modifiers.

![Searching for the offset modifier.](/markdown/track_b/assets/shapes-step9-1-ss.jpg)
![Adding the offset modifier.](/markdown/track_b/assets/shapes-step9-2-ss.jpg)

---

<!-- .slide: class="layout-media-centre" -->
## Adjusting the Neck

- Move the neck under the head.
- Select the rectangle and any modifiers you added. Cut and paste the code to the top of the depth stack. Then change the colour to match your head.

![The neck moved underneath the head.](/markdown/track_b/assets/shapes-step10-ss.jpg)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## Adding a Shirt

- Apply what you've learned to add a shirt, place it correctly on the screen, and give it a colour.

![A shirt shape added to the portrait.](/markdown/track_b/assets/shapes-step11-ss.jpg)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## Adding Hair

- Add a circle for your hair. Use `frame` to make it about the same width as your head or slightly larger.

![A circle added for the hair.](/markdown/track_b/assets/shapes-step12-ss.jpg)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-two-up" -->
## Adding Hair

- `trim` must come directly below a shape.
- Experiment with values for where the trim should start and end.

![The first trim attempt for the hair.](/markdown/track_b/assets/shapes-step13-1-ss.jpg)
![A second trim attempt for the hair.](/markdown/track_b/assets/shapes-step13-2-ss.jpg)

---

<!-- .slide: class="layout-media-centre" -->
## Adding Hair

- Adjust the location of the bangs or short hair. Continue adding any remaining elements to complete your hair.

![The portrait with more complete hair.](/markdown/track_b/assets/shapes-step14-ss.jpg)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## Tip: Many views in a stack

- If you have more than ten views in a stack, you'll get an “Extra arguments at position…” warning. To fix this, you can add a `Group` view to the stack.

![A warning caused by too many views in one stack.](/markdown/track_b/assets/shapes-tip-too-many-views-in-a-stack-ss.jpg)
<!-- .element: class="r-stretch" -->

---

# Shadow and Background Colour

---

<!-- .slide: class="layout-two-up" -->
## Shadow behind the Head

- Locate the shape that creates your head in the code. Add a blank line below the shape, then search for `shadow` in the list of modifiers.

![Searching for the shadow modifier.](/markdown/track_b/assets/shapes-step15-1-ss.jpg)
![Applying the shadow modifier.](/markdown/track_b/assets/shapes-step15-2-ss.jpg)

---

<!-- .slide: class="layout-code-focus" -->
## Shadow: Colour

- Optionally, add a colour to the shadow.

```swift
.shadow(color: .black, radius: 10)
```

---

<!-- .slide: class="layout-media-centre" -->
## Background Colour

- Add a blank line at the top of your `ZStack`, then open the list of colours. Tap a colour to add it to your code.

![Adding a background colour to the ZStack.](/markdown/track_b/assets/shapes-step16-1-ss.jpg)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-media-centre" -->
## Background Colour but Lighter

- Optionally, add an `opacity` modifier to dim the background colour.

![The background colour with opacity added.](/markdown/track_b/assets/shapes-step16-2-ss.jpg)
<!-- .element: class="r-stretch" -->

---

# And that's it!

---

### 🔢 Self Portrait App

# Full Code

[Download Completed Project](https://github.com/tinkercademy/swift-demo-projects/raw/main/Self%20Portrait.zip/)
