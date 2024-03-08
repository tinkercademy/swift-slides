<div style="text-align: left">
    <img src="/assets/tinkercademy.png" alt="Tinkercademy Logo" height="128px">
    <img src="https://raw.githubusercontent.com/swiftinsg/branding/main/logos/icons/png/coloured%20-%20dark%20background.png" alt="Swiftinsg Logo" height="128px" style="margin-left: 64px;">
</div>

## Track B: Project 5

# About Me

Create an about me app in Swift Playgrounds.

---

# Unit Overview

- TabBar: Navigating from View to View
- ScrollView: Scrolling long texts

---

# Welcome to SwiftUI

---vertical---

## Getting Started

<div style="display: flex; ">
    <ul>
        <li>Open the Swift Playgrounds app on your iPad</li>
        <li>Under “More Playgrounds”, tap on “Get Started with Apps”</li>
    </ul>
    <img width="1800" src="./assets/aboutme-getting-started.png">
</div>

---vertical---

## Text

<div style="display: flex; ">
<div>

- The current view is named IntroView
- Inside the body, you will see the following line:

```swift
Text("Hello, friend.")
```

- Let’s change the words in the string to something you want to say!

```swift
Text("Hey there!")
```

- Take a look at the Preview to see the changes
- Once you are done, click on the new task in the Tutorial tab.
</div>
<img height="400" src="./assets/aboutme-introview.jpg">
</div>

---vertical---

## Adding a new Text view

<div style="display: flex; ">
<div>

- Let’s add more text below the existing one!
- Add a new line underneath the first Text code and type:

```swift
Text()
```

- Within the brackets, type out what you want the text to say. Remember to place the words inside double quotes! (`" "`)

</div>
<img  src="./assets/aboutme-text.jpeg">
</div>

---vertical---

## Add an Image of our friend

<div style="display: flex; ">
<div>

- Let’s add an image into our app
- Add a new line above your first Text code and type:

```swift
Image("FriendAndGem")
```

- Oh no, our picture looks gigantic now

</div>
<img height="400" src="./assets/aboutme-text2.jpeg">
</div>

---vertical---

## Resizing images

<div style="display: flex; ">
<div>

- Let’s add some **modifiers** to resize our image!
- Enter a new line below the Image code and type

```swift
.resizable()
```

- Now our image looks really squished. Let’s fix that by adding the following line below:

```swift
.scaledToFit()
```

</div>
<img height="400" src="./assets/aboutme-image2.jpeg">
</div>

---vertical---

<div style="display: flex; ">
<div>

<h2>Modifiers</h2>

- SwiftUI has hundreds of different **modifiers** that we can use to make our individual Views look better
- To add a modifier, add it to the end of a View, like this: `.modifierName()`
- Let’s take a look at the modifiers for our image:
  - `resizable()`: Allows our image to change its size
  - `scaledToFit()`: Resizes our image proportionally to fit the size of the container it occupies

</div>
<img width="400" src="./assets/aboutme-modifiers.jpeg">
</div>

---vertical---

## Adding Stacks

<div style="display: flex; ">
<div>

- Above your Image code, add the following:

```swift
HStack {
    Text("This is a picture!")
    // Image code goes here
}
```

- Move your Image code (including the modifiers) and add them inside the HStack
- Check out what happens in the App Preview!

</div>
<img height="400" src="./assets/aboutme-hstack.jpeg">
</div>

---vertical---

## Nesting Stacks

<div style="display: flex; ">
<div>

- Let’s try to create the layout on the left
- Notice how `Image` is horizontally stacked with the `Text` elements, which are vertically stacked.
- Let’s use `HStack` and `VStack` to create the layout

</div>

<img height="400" src="./assets/aboutme-nesting-stacks.png">

</div>

---vertical---

## Nesting Stacks

<div style="display: flex; ">
<div>

- Add a `HStack` within the `VStack` given in the code
- Next, add a `Image` named “Friend” and a `VStack` inside the `HStack` to stack them horizontally
- Add a `Text` that says “Friend” in the `VStack` with the following modifier:

  - `.font(.largeTitle)`

- Add another `Text` that describes the Friend in the `VStack` with the following modifier:
  - `.font(.caption)`

</div>

<img height="400" src="./assets/aboutme-nesting-stacks2.jpeg">

</div>

---vertical---

## Composed View

<div style="display: flex; ">
<div>

- Notice how you have been editing your code in a tab named “FriendDetailView”
- What you created is known as a **composed view**
- You can use this composed view in other parts of your app without having to recreate it all over again
- Let’s use the `FriendDetailView` in the ExperimentView tab by adding following code in the `VStack`:
  `FriendDetailView()`
- Bonus: Try adding another `FriendDetailView()` below the first one and check out the App Preview!

</div>

<img height="400" src="./assets/aboutme-composed-view.jpeg">

</div>

---vertical---

## Creating a similar view

<div style="display: flex; ">
<div>

- Let’s create a view similar to `FriendDetailView` using a different image and description this time.
- Start by creating an image named “Blu” in a `HStack`
- Add modifiers to resize the image
- Use `VStack`, `Text` and `.font` modifiers to add the Blu’s name and description beside the picture

</div>

<img height="400" src="./assets/aboutme-similar-view.jpeg">

</div>

---vertical---

## Playing around with Stacks

- Let’s create one more view similar to `FriendDetailView`, this time with an `Image` named “Hopper”
- Try out new layouts by combining `HStack`, `VStack`, `Text` and `Image` views in different way
- E.g. you can try having the image be stacked vertically on top of two `Text` views that are arranged horizontally

---vertical---

## Bonus: Styling Our App

<div style="display: flex; ">
<div>

- Our app looks pretty bland right now - let’s try to style it by changing up some of the colours!
- Since we will be changing a large chunk of our code, let’s duplicate the playground first so that if anything happens, we can always go back to our original code
- Tap and hold the playground in the My Playgrounds page
- Tap on _Duplicate_ in the dropdown menu

</div>

<img width="500px" src="./assets/aboutme-copy.png">

</div>

---vertical---

## ZStack

<div style="display: flex; ">

<div>

- Let’s add some background colour to our app.
- A background colour will, naturally, go behind the Views.
- In SwiftUI, a background colour is a View, that goes behind other Views
- To stack views in front/behind each other, we use a ZStack
- Elements in a ZStack are overlayed starting from the back to the front

</div>

<img height="400" src="./assets/zstack.png">

</div>

---vertical---

## Adding background colour

<div style="display: flex; ">

<div>

- Start by cutting (Cmd + X) the `VStack` containing all of your composed views and `FriendDetailView`
- Add a `ZStack`, then paste the `VStack` inside the `ZStack`
- Since the background colour goes be behind the views, add a `Color`\* View above the `VStack` by typing the following:
  `Color.pink`
- The `Color`\* View has a few built-in options you can use, such as blue, red, yellow, green. Try them out!

<p style="font-size:0.7em;">* American spelling, because made in California and all that</p>

</div>

<img  src="./assets/aboutme-adding-zstack.jpeg">

</div>

---vertical---

## Text Colour

<div style="display: flex; ">

<div>

- Our black text does not show up very well against the new background colour. Let’s change it!
- Look for the Text for Blu and add a new line beneath it
- Add the following modifer: `.foregroundColor(.white)`
- Just like the `Color` View, there is also a range of colours to choose from. You can take a look at the colours available in the dropdown list that appears when you type . in the brackets
- Try changing the colours of the other Text views in your app!

</div>

<img src="./assets/aboutme-text-colour.jpeg">

</div>

---vertical---

## Padding

<div style="display: flex; ">

<div>

- You might have noticed that all the pictures in the app go right up to the edge of our screen
- Let’s add a modifier to the overall `VStack` containing all the views (except the background)
- At the end of the overall `VStack`, add the following modifer: `.padding()`
- This adds a bit of space between the `VStack` and everything else outside (like social distancing!)

</div>

<img height="400" src="./assets/aboutme-padding.jpeg">

</div>

---

# About Me App

---vertical---

<div style="display: flex; ">

<div>

<h2>Getting Started</h2>

- Open the Swift Playgrounds app on your iPad
- Under “More Playgrounds”, tap on See All
- Tap on the `GET` button next to the About Me playground

</div>

<img width="800" src="./assets/aboutme-getting-started-app.png">

</div>

---vertical---

## Tab Bar

### Navigating from View to View

---vertical---

## Navigating About Me

- Just like Getting Started with Apps, there will be a tutorial to guide you through building a tab-based app using SwiftUI
- Tap on Learn More, then Start Walkthrough, to start the tutorial

---vertical---

## Navigating About Me

- The About Me app currently has 4 already built-in tab views. Check them out!

<div style="display: flex;">
  <div style="flex-basis: 25%;">
    <img src="./assets/aboutme-starter-app-1.PNG" alt="Image 1">
  </div>
  <div style="flex-basis: 25%;">
    <img src="./assets/aboutme-starter-app-2.PNG" alt="Image 2">
  </div>
  <div style="flex-basis: 25%;">
    <img src="./assets/aboutme-starter-app-3.PNG" alt="Image 3">
  </div>
  <div style="flex-basis: 25%;">
    <img src="./assets/aboutme-starter-app-4.PNG" alt="Image 4">
  </div>
</div>

---vertical---

## Tab Views and Commenting

<div style="display: flex; ">

<div>

- In the ContentView, you would notice that there are 4 `TabViews`, each corresponding to each of the tabs in the app
- The `HomeView` is highlighted - let’s try deleting it and see what happens
- You can also try commenting the block of code out by adding two backslashes (**//**) in front of each line of code. This is called commenting
- When you comment out a code, Swift will ignore it
- Remember to uncomment the `HomeView` after!

</div>

<img src="./assets/aboutme-tab-views-commenting.jpeg">

</div>

---vertical---

## Editing the Tab Item Label

<div style="display: flex; ">

<div>

- For each `TabView`, there is a `.`tabItem` modifier, which styles the tab item in the tab bar at the bottom of the app
- Let’s change the text in the label from `"Home"` to something else
- Maybe your name!

</div>

<img src="./assets/aboutme-tab-item-label.jpeg">

</div>

---vertical---

<div style="display: flex; ">

<div>
<h2>Editing the Tab Item Icon</h2>

- Currently, the icon used is _“person”_. Other tab views have also used icons such as _“book”_, _“star”_ and _“hand.thumbsup”_
- These icons are known as **SF Symbols** which are made by Apple
- Let’s try changing the tab icon of our first tab
- To change the icon, replace “person” with the name of the icon you would like to use from the icon library.

</div>

<img width="1000px" src="./assets/aboutme-tab-item-icon.jpeg">

<div>

</div>

---vertical---

## Changing the Accent Colour

<div style="display: flex; ">

<div>

- Notice how the tab item turns blue when the user is on that tab
- Tap on <img style="margin-bottom: -4px" height="32px" src="/assets/icons/sidebar.left.svg">, then tap on About Me App Settings
- Select another colour under Accent Color

</div>

<img width="500px" src="./assets/aboutme-accent-colour.jpeg">

</div>

---vertical---

## Changing the Image

<div style="display: flex; ">

<div>

- Let’s change the placeholder image to an image of yourself
  - Take a picture of yourself using the Camera app.
- To add a photo to Playgrounds, tap on <img style="margin-bottom: -4px" height="32px" src="/assets/icons/sidebar.left.svg">, then tap on <img style="margin-bottom: -4px" height="40px" src="/assets/icons/doc.badge.plus.svg" >
- Select Photo and choose your picture
- Long press on your image and tap on Rename to rename the image file
- In `HomeView`, change “Placeholder” to your image’s name

</div>

<img src="./assets/photo-dropbar.png">

</div>

---vertical---

# Styling HomeView

---vertical---

## Styling the Text in the HomeView

<div style="display: flex; ">

<div>

- Let’s use more viewModifiers to style the text in the `HomeView`
- Under the "All About" text are different modifiers for styling:
  - `.font(.largeTitle)` changes the size of the text
  - `.fontWeight(.bold)` changes the boldness of the text
  - `.padding()` adds space between the text and everything else
- Try experimenting by changing the values in the brackets of the modifiers!
  - When you type ‘.’ in the brackets, all the different values will be shown

</div>

<img height="400" src="./assets/aboutme-styling-text.jpeg">

</div>

---vertical---

## Styling the Image in the HomeView

<div style="display: flex; ">

<div>

- Modifiers are also used to style the image in the **HomeView**:
  - `.resizable()` allows the image to be, well, resizable
  - `.scaledToFit()` scales the image to fit the size of the screen
- You can try to use more _modifiers_ to style the Image!
  - For example, use `.cornerRadius()` to make the corners of the Image rounded

</div>

<img src="./assets/aboutme-styling-image.jpeg">

</div>

---vertical---

## ScrollView

<div style="display: flex; ">

<div>

- Moving on to the next chapter in the tutorial, you will be direct to the **StoryView**, which displays a story.
- A `ScrollView` allows for scrolling if your text is too long
- There are a bunch of stuff in `ScrollView`
  - We can add more Text inside the ScrollView and you will see that you will be able to scroll more

</div>

<img width="1000" src="./assets/aboutme-scrollview.png">

</div>

---vertical---

## Creating our story

<div>

<div>

- We can add another `Text` in the ScrollView, and add a story there!
  - If your story is very long, we need to separate it into different lines! But.. how do we do that? Pressing ‘enter’ does not work!
  - We can use \n!
  - It creates a new line in your text
- What if you want to type out a long string of text without having to keep typing \n?

</div>

<img src="./assets/aboutme-creating-story.png">

</div>

---vertical---

## Multiline Text

<div>

<div>

- We can use _multi-line strings_ instead!
- To create a multi-line string, replace the double quotes (`""`) surrounding the string with three double quotes (`""" """`) instead
- In a multi-line string, you can press enter to create a new line instead of using `/n`
- Now you can try typing a really long story (about anything you want) and see the `ScrollView` in action!

</div>

<img src="./assets/aboutme-multiline-text.png">

</div>

---vertical---

## FavoritesView

<div style="display: flex; ">

<div>

- The **FavoritesView** showcases your favourite hobbies, foods, and colours
- The categories are vertically stacked using a `VStack`, while the individual items in each category are horizontally arranged using a `HStack`
- Inside each `HStack` is a bunch of Texts with different information
- At the bottom, you can see there is a `DisclosureGroup`
  - It creates a ‘drop-down’ menu, where you have to click on it before more views show up
  - `Color` is used to customise the different colours shown

</div>

<img width="1500" src="./assets/aboutme-favoritesview.png">

</div>

---vertical---

## Arrays

<div>

<div>

- Previously, we mentioned arrays, but what are they exactly?
- An array is an ordered list
- Take for example your class list. Each person has an index number and everyone in the list is collectively known as your class name (e.g. 3H, 405)
  - In this case, your class list is an ordered list of names
- In our app, it is an ordered list of different fun facts! How fun!

</div>

<img src="./assets/aboutme-arrays.png">

</div>

---vertical---

<div style="display: flex; ">

<div style="display: flex; flex-direction: column; justify-content: center; padding-right: 32px;">
<h2>  Learn to Code 2: Arrays </h2>

- To learn more about arrays, we can open up the _Learn to Code 2_ playgrounds
- Tap on the sidebar <img style="margin-bottom: -4px" height="32px" src="/assets/icons/sidebar.left.svg"> and scroll down to the section called arrays. You can also try out the exercises in your free time, but we won’t be going through them.

</div>

<div>

<img src="./assets/aboutme-learn-to-code-2.png">

<img src="./assets/aboutme-learn-to-code-2-2.png">

</div>

</div>

---vertical---

<div style="display: flex; ">

<div style="display: flex; flex-direction: column; justify-content: center; ">
<h2>FunFactsView</h2>

- The last part of the About Me tutorial brings us to the **FunFactsView**
- This view is special - there’s a button!
- Try tapping on the button to see what happens!

</div>

<img height="900" src="./assets/aboutme-funfactsview.jpeg">

</div>

---vertical---

## How the Button Works

<div style="display: flex; ">

<div>

- There’s a variable called funFact which is currently empty until someone taps the button
- When the button is tapped, it runs the code inside the curly braces next to `Button(“Show Random Fact”)`
- Then, it will take a random fact from the `allFunFacts` array, and update the `funFact` variable
- It also uses a ternary operator, which is just a one-lined if-statement

</div>

<img width="1500" src="./assets/aboutme-how-the-button-works.png">

</div>

---vertical---

## Styling the Button

<div style="display: flex; ">

<div>

- Let’s edit the look of the button by adding modifiers to it
  - Add the modifiers after the closing curly bracket of the Button code
- Try giving our button a background by adding the following modifier: `.background(Color.black)`
- You can try out other colours too for the background!
- You can also add other modifiers too!

</div>

<img width="1500" src="./assets/aboutme-styling-the-button.png">

</div>

---vertical---

## Styling the Button

<div style="display: flex; ">

<div>

- What if we wanted add extra background space around our button?
  - If we add the `.padding()` modifier after the background modifier, nothing seems to happen
- This is because modifiers are applied sequentially from first to last
- So, if we want to apply the extra space around the button, then colour it with the background colour, we will having to add the .`padding()` modifier first before the background modifier

</div>

<div>

<img src="./assets/aboutme-button1.jpeg">

<img src="./assets/aboutme-button2.jpeg">

</div>

</div>

---vertical---

## Styling the Button

<div style="display: flex; ">

<div>

- Lastly, let’s add some rounded corners to our button
- We can use the modifier `.cornerRadius(15)`
  Change the number in the brackets to determine how round you want the button corners to be

</div>

<img src="./assets/aboutme-styling-the-button2.png">

</div>

---vertical---

## Creating a New Tab

<div style="display: flex; ">

<div>

- Let’s add a new tab which showcases an image gallery
- Going back to **ContentView**, we can see that there are four views, each corresponding to a tab in the app
- A new tab has already been made for us! It’s called **YourTab**
  - We will be using this Tab to create a Gallery!

</div>

<img width="1500" src="./assets/aboutme-creating-a-new-tab.jpeg">

</div>

---vertical---

## Creating a New Tab

<div>

<div>

- Now, we’ll need to add a new tab inside our **ContentView**
- Type in the following below the Fun Facts tab:

```swift
YourTab()
  .tabItem {
    Label("Gallery", systemImage: "photo.on.rectangle")
```

- Next to `systemImage`:, you can add any SF Icon to represent your tab. In the example above, we used the `photo.on.rectangle` icon

</div>

<img src="./assets/aboutme-creating-a-new-tab2.png">

</div>

---vertical---

## Editing GalleryView

<div style="display: flex; ">

<div>

- Head back to **YourTab** to start editing the view itself
- First, let’s add a title text called `"Gallery"`
  - Then, apply some modifiers to it
- What we will be adding next is going to be similar to what we have done in _Getting - Started with Apps_ in the previous unit - we will be adding multiple images with captions next to them.

</div>

<img width="1000" src="./assets/aboutme-editing-galleryview.jpeg">

</div>

---vertical---


## Adding the First Item

<div style="display: flex; ">

<div>

- Let’s create the first item in our gallery
- Create a `HStack` below the title text
- Then, import an image into the playground and add the image inside the `HStack`.
- Add the appropriate modifiers to make image resizable and scaled properly
- Next, add a `Text` view to describe the image. You can add some modifiers to your `Text` view to style it as well


</div>

<img src="./assets/aboutme-adding-the-first-item.jpeg">

</div>


---vertical---

## Using ScrollView

<div style="display: flex; ">

<div>

- If you add a lot of items into your gallery, you might run out of vertical space
- In that case, you can use a `ScrollView` to make the app screen scrollable
- To do so, we can replace the `VStack` with a `ScrollView` instead

</div>

<img src="./assets/aboutme-using-scrollview.jpeg">

</div>

---vertical---

<div style="display: flex; ">

<div>

<h2> Adding Images </h2>

- Since it scrolls, you can add as many images as and captions you want
- Then, customise it according to how you like it

</div>

<img height="800" src="./assets/aboutme-adding-images.jpeg">

</div>

---

# And that’s it!
