# New Things in This Unit

---

# Composed View

- A composed view is a view that is made up of multiple other views
- It is a way to break down your app into smaller, more manageable parts
- This makes your code easier to read and understand

---

## Composed View

- For example, if you have a view that displays a car, you can create a composed view called `CarView` that displays the car's make, model, year, and color

```swift
// define your car struct
struct Car {
  let make: String
  let model: String
  let year: Int
  let color: String
}

// create a composed view
struct CarView: View {
  let car: Car

  var body: some View {
    VStack {
      Text("\(car.make) \(car.model)")
      Text("\(car.year)")
      Text("\(car.color)")
    }
  }
}
```

---

## Using Composed Views

- You can then use the `CarView` in your app to display the car

```swift
HStack {
  CarView(car: Car(make: "Toyota", model: "Corolla", year: 2020, color: "Red"))
  CarView(car: Car(make: "Honda", model: "Civic", year: 2019, color: "Blue"))
}
```

---

<!-- .slide: class="layout-steps-media" -->
## Text Colour

- You can change the colour of text in SwiftUI using the `.foregroundStyle()` modifier
  - Add the following modifer: `.foregroundStyle(.white)`

![Text colours](/markdown/track_b/assets/aboutme-text-colours.png)

---

<!-- .slide: class="layout-steps-media" -->
## Padding

- You might have noticed that all the pictures in the app go right up to the edge of our screen
- Let's add a modifier to the overall `VStack` containing all the views (except the background)
- At the end of the overall `VStack`, add the following modifer: `.padding()`
- This adds a bit of space between the `VStack` and everything else outside (like social distancing!)

![Padding](/markdown/track_b/assets/aboutme-padding.jpeg)

---

# About Me App

---

<!-- .slide: class="layout-steps-media" -->
## Getting Started

- Open the Swift Playgrounds app on your iPad
- Under "More Playgrounds", tap on See All
- Tap on the `GET` button next to the About Me playground
- After it has loaded, go back to the Home screen to open the playground

![Getting Started app](/markdown/track_b/assets/aboutme-getting-started-app.png)

---

<img src="/markdown/track_b/assets/aboutme-homepage.png" width="70%">

---

## Tab Bar

### Navigating from View to View

---

## Navigating About Me

- Just like Getting Started with Apps, there will be a tutorial to guide you through building a tab-based app using SwiftUI
- Tap on <img style="margin-bottom: -4px" height="32px" src="/markdown/track_b/assets/books.vertical icon.png" alt="books.vertical icon">, then <code>Start Building</code> to start the tutorial

---

<!-- .slide: class="layout-gallery-4" -->
## Navigating About Me

- The About Me app currently has 4 already built-in tab views. Check them out!

![Image 1](/markdown/track_b/assets/aboutme-starter-app-1.PNG)
![Image 2](/markdown/track_b/assets/aboutme-starter-app-2.PNG)
![Image 3](/markdown/track_b/assets/aboutme-starter-app-3.PNG)
![Image 4](/markdown/track_b/assets/aboutme-starter-app-4.PNG)

---

<!-- .slide: class="layout-steps-media" -->
## Tab Views and Commenting

- In the ContentView, you would notice that there are 4 `TabViews`, each corresponding to each of the tabs in the app
- The `HomeView` is highlighted - let's try deleting it and see what happens
- You can also try commenting the block of code out by adding two backslashes <code>//</code> in front of each line of code. This is called commenting
- When you comment out a code, Swift will ignore it
- Remember to uncomment the `HomeView` after!

![Tab views and commenting](/markdown/track_b/assets/aboutme-tab-views-commenting.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## Editing the Tab Item Label

- For each `TabView`, there is a `.`tabItem` modifier, which styles the tab item in the tab bar at the bottom of the app
- Let's change the text in the label from `"Home"` to something else
- Maybe your name!

![Tab item label](/markdown/track_b/assets/aboutme-tab-item-label.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## Editing the Tab Item Icon

- Currently, the icon used is _"person"_. Other tab views have also used icons such as _"book"_, _"star"_ and _"hand.thumbsup"_
- These icons are known as **SF Symbols** which are made by Apple
- Let's try changing the tab icon of our first tab
- To change the icon, replace "person" with the name of the icon you would like to use from the icon library.

![Tab item icon](/markdown/track_b/assets/aboutme-tab-item-icon.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## Changing the Accent Colour

- Notice how the tab item turns blue when the user is on that tab
- Tap on ![Sidebar](/assets/icons/sidebar.left.svg), then tap on About Me App Settings
- Select another colour under Accent Color

![Accent colour settings](/markdown/track_b/assets/aboutme-accent-colour.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## Changing the Image

- Let's change the placeholder image to an image of yourself
  - Take a picture of yourself using the Camera app.
- To add a photo to Playgrounds, tap on ![Sidebar](/assets/icons/sidebar.left.svg), then tap on ![Add File](/assets/icons/doc.badge.plus.svg)
- Select Photo and choose your picture
- Long press on your image and tap on Rename to rename the image file
- In `HomeView`, change "Placeholder" to your image's name

![Photo dropbar](/markdown/track_b/assets/photo-dropbar.png)

---

# Styling HomeView

---

<!-- .slide: class="layout-steps-media" -->
## Styling the Text in the HomeView

- Let's use more viewModifiers to style the text in the `HomeView`
- Under the "All About" text are different modifiers for styling:
  - `.font(.largeTitle)` changes the size of the text
  - `.fontWeight(.bold)` changes the boldness of the text
  - `.padding()` adds space between the text and everything else
- Try experimenting by changing the values in the brackets of the modifiers!
  - When you type '.' in the brackets, all the different values will be shown

![Styling text](/markdown/track_b/assets/aboutme-styling-text.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## Styling the Image in the HomeView

- Modifiers are also used to style the image in the **HomeView**:
  - `.resizable()` allows the image to be, well, resizable
  - `.scaledToFit()` scales the image to fit the size of the screen
- You can try to use more _modifiers_ to style the Image!
  - For example, use `.cornerRadius()` to make the corners of the Image rounded

![Styling image](/markdown/track_b/assets/aboutme-styling-image.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## ScrollView

- Next, we'll open the **StoryView**, which displays a story about you.
- A `ScrollView` allows for scrolling if your text is too long
- There are a bunch of stuff in `ScrollView`
  - We can add more Text inside the `ScrollView` and you will see that you will be able to scroll more

![ScrollView](/markdown/track_b/assets/aboutme-scrollview.png)

---

<!-- .slide: class="layout-steps-media" -->
## Creating our story

- We can add another `Text` in the `ScrollView`, and add a story there!
  - If your story is very long, we need to separate it into different lines! But.. how do we do that? Pressing 'enter' does not work!
  - We can use \n!
  - It creates a new line in your text
- What if you want to type out a long string of text without having to keep typing \n?

![Creating story](/markdown/track_b/assets/aboutme-creating-story.png)

---

<!-- .slide: class="layout-steps-media" -->
## Multiline Text

- We can use _multi-line strings_ instead!
- To create a multi-line string, replace the double quotes (`""`) surrounding the string with three double quotes (`""" """`) instead
- In a multi-line string, you can press enter to create a new line instead of using `/n`
- Now you can try typing a really long story (about anything you want) and see the `ScrollView` in action!

![Multiline text](/markdown/track_b/assets/aboutme-multiline-text.png)

---

<!-- .slide: class="layout-steps-media" -->
## FavoritesView

- The **FavoritesView** showcases your favourite hobbies, foods, and colours
- The categories are vertically stacked using a `VStack`, while the individual items in each category are horizontally arranged using a `HStack`
- Inside each `HStack` is a bunch of Texts with different information
- At the bottom, you can see there is a `DisclosureGroup`
  - It creates a 'drop-down' menu, where you have to click on it before more views show up
  - `Color` is used to customise the different colours shown

![FavoritesView](/markdown/track_b/assets/aboutme-favoritesview.png)

---

<!-- .slide: class="layout-steps-media" -->
## Arrays

- Previously, we mentioned arrays, but what are they exactly?
- An array is an ordered list
- Take for example your class list. Each person has an index number and everyone in the list is collectively known as your class name (e.g. 3H, 405)
  - In this case, your class list is an ordered list of names
- In our app, it is an ordered list of different fun facts! How fun!

![Arrays](/markdown/track_b/assets/aboutme-arrays.png)

---

<!-- .slide: class="layout-steps-media" -->
## Learn to Code 2: Arrays

- To learn more about arrays, we can open up the _Learn to Code 2_ playgrounds
- Tap on the sidebar ![Sidebar](/assets/icons/sidebar.left.svg) and scroll down to the section called arrays.
- **You can also try out the exercises in your free time, but we won't be going through them.**

![Learn to Code 2](/markdown/track_b/assets/aboutme-learn-to-code-2.png)
![Learn to Code 2 - 2](/markdown/track_b/assets/aboutme-learn-to-code-2-2.png)

---

<!-- .slide: class="layout-steps-media" -->
## FunFactsView

- The last part of the About Me tutorial brings us to the **FunFactsView**
- This view is special - there's a button!
- Try tapping on the button to see what happens!

![FunFactsView](/markdown/track_b/assets/aboutme-funfactsview.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## How the Button Works

- There's a variable called funFact which is currently empty until someone taps the button
- When the button is tapped, it runs the code inside the curly braces next to `Button("Show Random Fact")`
- Then, it will take a random fact from the `allFunFacts` array, and update the `funFact` variable
- It also uses a ternary operator, which is just a one-lined if-statement

![How the button works](/markdown/track_b/assets/aboutme-how-the-button-works.png)

---

<!-- .slide: class="layout-steps-media" -->
## Styling the Button

- Let's edit the look of the button by adding modifiers to it
  - Add the modifiers after the closing curly bracket of the Button code
- Try giving our button a background by adding the following modifier: `.background(Color.black)`
- You can try out other colours too for the background!
- You can also add other modifiers too!

![Styling the button](/markdown/track_b/assets/aboutme-styling-the-button.png)

---

<!-- .slide: class="layout-steps-media" -->
## Styling the Button

- What if we wanted add extra background space around our button?
  - If we add the `.padding()` modifier after the background modifier, nothing seems to happen
- This is because modifiers are applied sequentially from first to last
- So, if we want to apply the extra space around the button, then colour it with the background colour, we will having to add the .`padding()` modifier first before the background modifier

![Button styling - padding after background](/markdown/track_b/assets/aboutme-button1.jpeg)
![Button styling - padding before background](/markdown/track_b/assets/aboutme-button2.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## Styling the Button

- Lastly, let's add some rounded corners to our button
- We can use the modifier `.cornerRadius(15)`
  Change the number in the brackets to determine how round you want the button corners to be

![Styling the button](/markdown/track_b/assets/aboutme-styling-the-button2.png)

---

<!-- .slide: class="layout-steps-media" -->
## Creating a New Tab

- Let's add a new tab which showcases an image gallery
- Going back to **ContentView**, we can see that there are four views, each corresponding to a tab in the app
- A new tab has already been made for us! It's called **YourTab**
  - We will be using this Tab to create a Gallery!

![Creating a new tab](/markdown/track_b/assets/aboutme-creating-a-new-tab.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## Creating a New Tab

- Now, we'll need to add a new tab inside our **ContentView**
- Type in the following below the Fun Facts tab:

```swift
YourTab()
  .tabItem {
    Label("Gallery", systemImage: "photo.on.rectangle")
```

- Next to `systemImage`:, you can add any SF Icon to represent your tab. In the example above, we used the `photo.on.rectangle` icon

![Creating a new tab](/markdown/track_b/assets/aboutme-creating-a-new-tab2.png)

---

<!-- .slide: class="layout-steps-media" -->
## Editing GalleryView

- Head back to **YourTab** to start editing the view itself
- First, let's add a title text called `"Gallery"`
  - Then, apply some modifiers to it
- What we will be adding next is going to be similar to what we have done in _Getting - Started with Apps_ in the previous unit - we will be adding multiple images with captions next to them.

![Editing GalleryView](/markdown/track_b/assets/aboutme-editing-galleryview.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## Adding the First Item

- Let's create the first item in our gallery
- Create a `HStack` below the title text
- Then, import an image into the playground and add the image inside the `HStack`.
- Add the appropriate modifiers to make image resizable and scaled properly
- Next, add a `Text` view to describe the image. You can add some modifiers to your `Text` view to style it as well

![Adding the first item](/markdown/track_b/assets/aboutme-adding-the-first-item.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## Using ScrollView

- If you add a lot of items into your gallery, you might run out of vertical space
- In that case, you can use a `ScrollView` to make the app screen scrollable
- To do so, we can replace the `VStack` with a `ScrollView` instead

![Using ScrollView](/markdown/track_b/assets/aboutme-using-scrollview.jpeg)

---

<!-- .slide: class="layout-steps-media" -->
## Adding Images

- Since it scrolls, you can add as many images as and captions you want
- Then, customise it according to how you like it

![Adding images](/markdown/track_b/assets/aboutme-adding-images.jpeg)

---

# And that's it!
