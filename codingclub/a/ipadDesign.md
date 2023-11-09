<div style="text-align: left">
    <img src="/assets/tinkercademy.png" alt="Tinkercademy Logo" height="128px">
    <img src="https://raw.githubusercontent.com/swiftinsg/branding/main/logos/icons/png/coloured%20-%20dark%20background.png" alt="Swiftinsg Logo" height="128px" style="margin-left: 64px;">
</div>

## Track A: Unit 4A
# iPad Design

Designing apps for iPads

---

## Unit Overview
- [Navigation in iPadOS](#navigation-in-ipados)
- [Tab Bars](#tab-bars)
- [Side Bars](#side-bars)
- [Modals](#modals)
- [Pushing Views](#pushing-views)
- [Popovers](#popovers)
- [Summary](#summary)

---

## Navigation in iPadOS
- Navigation Patterns in iOS are basically the different ways that you can present information to the user
- There are 3 main ways to navigating through an app in iOS. Namely,
    - Tab Bars
    - Modal Presentation
    - ‘Pushing’ a view onto a screen

---

# Tab Bars
tab bar icon

---vertical---

## Tab Bars
- Used when we want to navigate between completely different sections of our app
    - Each tab should focus on only one way to interact with your app
    - Allows you to add an icon that represents that interaction

---vertical---

## Why Tab Bars?
- Since it separates content into distinct sections of the app, this makes it more user friendly
    - Imagine having an app with only one screen, with all the features shown on that screen
    - You will be overloaded with information, and some of the features do not link with each other (e.g. files containing notes and the app’s settings), confusing the user

---vertical---

## Example: Clock App
<div style="display: flex;">
    <ul>
        <li>Tabs in the Clock app include:</li>
        <ul>
            <li>(globe icon) World Clock: Shows the different times in different places around the world</li>
            <li>(alarm icon) Alarm: Shows the different alarms you have created</li>
            <li>(stopwatch icon) Stopwatch: Create a timer that counts up</li>
            <li>(timer icon) Timer: Creates a timer that counts down</li>
        </ul>
    </ul>
</div>

---vertical---

## Guidelines when using Tab Bars
- Split features equally throughout tabs
    - Refrain from duplicating features that already exists in other tabs, unless there’s a good reason to do so (e.g. Summary tab in Health)
- Use clear and concise labels for tabs
    - Concrete nouns or verbs work best for labels
    - Try to keep labels to a single word
- Ensure that the Tab Bar is shown throughout the app
    - Users should be able to switch between tabs without losing progress in a particular tab
- Tabs should not navigate to each other
    - Use Navigation Views (next section) for common navigation

---

# Side Bars
side bar icon

---vertical---

## Side Bars
- Side bars, formally termed Navigation Split Views, split the screen into two main parts, differentiating them in their purposes
- The side bar is smaller, and shows different items that bring users to various parts of the app
- The canvas is the larger main view, and shows the feature of the app itself
- These are often how iPad apps in landscape mode look, to allow users to take advantage of the larger horizontal space to see more on- screen

---vertical---

## Side Bar and Canvas
<div style="display: flex;">
    <ul>
        <li><strong>Sidebar</strong></li>
        <ul>
            <li>Allows you to choose which part of the app you want to open</li>
        </ul>
        <li><strong>Canvas</strong></li>
        <ul>
            <li>Area that shows you content depending on what you have selected in the Sidebar</li>
        </ul>
    </ul>
</div>

---vertical---

## Example: Photos App
<div style="display: flex;">
    <ul>
        <li><strong>Sidebar</strong></li>
        <ul>
            <li>Allows you to choose which part of the app you want to open</li>
        </ul>
        <li><strong>Canvas</strong></li>
        <ul>
            <li>Area that shows you content depending on what you have selected in the Sidebar</li>
        </ul>
    </ul>
</div>

---vertical---

## Example: Calendar App
<div style="display: flex;">
    <ul>
        <li><strong>Sidebar</strong></li>
        <ul>
            <li>Allows you to choose which part of the app you want to open</li>
        </ul>
    </ul>
</div>

---

# Modals
modal icon

---vertical---

## Modals
- A Modal is a view that slides up from the bottom of the screen, blocking access to the rest of the app until it is dismissed
    - It is a *design technique that presents content in a temporary mode that separates from the user’s previous context, and requires an explicit action to exit (Taken from Apple’s [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/app-architecture/modality/))*
    - Often used for a self-contained task in a view, in which the user must save or cancel it in order to proceed

---vertical---

## When to use it?
- Used in a view when the user has *enough information* to make decisions and complete a task
    - Creates focus for a specific task by separating the user from the current view
    - Ensures that people can receive critical information and act on it
- Comes from the bottom of the screen, which blocks the Tab Bar
    - Prevents people from moving to other parts of the app while the Modal is still presented, hence *creating focus*

---vertical---

## Example: Reminders App
<div style="display: flex;">
    <ul>
        <li>When the user clicks on the + button to add a new list, a Modal is presented</li>
        <li>The Modal is used to allow users to enter information about this new list, and can only be dismissed when the user is done, or cancels the operation</li>
    </ul>
</div>

---

# Pushing Views
pushing views icon

---vertical---

## Navigation Views
- Shows the **order of information** in an app
    - Usually used in apps with multiple levels of information
- When used, views are pushed in from the *right*, while allowing users to navigate back to the previous view by swiping to the *left*
    - However, on devices using right to left languages (e.g. Arabic), the directions are reversed
- The ‘pushing’ animation reflects the user ‘drilling deeper’ into the app’s information hierarchy, showing *increasingly more specific information*

---vertical---

## NavigationSplitView vs NavigationStack
<div style="display: flex;">
    <ul>
        <li><strong>NavigationSplitView</strong></li>
        <ul>
            <li>Having two different sections, one for Navigation and one for Content</li>
        </ul>
        <li><strong>NavigationStack</strong></li>
        <ul>
            <li>Just a list of things that you can navigate to</li>
            <li>The Settings app has both NavigationSplitView and NavigationStacks</li>
        </ul>
    </ul>
</div>

---vertical---

## Navigation Bars
- Most commonly at the top of the screen on iOS
- Allows users to *see where* they came from, and *go back* to where they came from
    - In an event that they misclicked, the user can just go back one section and click on the correct section, instead of restarting navigating through all the content again

---vertical---

## Disclosure Indicators
<div style="display: flex;">
    <ul>
        <li>Also referred to as a <strong>chevron ( ‹ )</strong></li>
        <li>The <strong>chevron</strong> points in the direction that the user is expected to transition to and helps our mental model of progression</li>
        <ul>
            <li>Indicates <em>progress</em></li>
            <li>For example, in</li>
            <ul>
                <li><em>left to right</em> languages like English, it points from <em>left to right</em>, but</li>
                <li><em>right to left</em> languages like Arabic, it points from <em>right to left</em></li>
            </ul>
        </ul>
    </ul>
</div>

---vertical---

## Example: Settings App
<div style="display: flex;">
    <ul>
        <li>The User taps to go into more detail about App Store Notification settings (App Store → Notifications → Show Previews)</li>
        <li>The Disclosure Indicator shows the name of the last view, letting the user know where they are in the app and giving them an option to go back</li>
    </ul>
</div>

---vertical---

## Guidelines for Navigation Views
<div style="display: flex;">
    <ul>
        <li>Provide a descriptive and concise title</li>
        <li>Use the standard ‘Back’ button in the navigation bar</li>
        <ul>
            <li>In the Photos app, viewing a photo will make it take up the entire screen. Users can close by swiping down.</li>
        </ul>
        <li>Sometimes, consider hiding the navigation bar temporarily for a more immersive experience</li>
        <ul>
            <li>Users are accustomed to retracing their steps with the Back button</li>
        </ul>
        <li>Note: Navigation bars can also come with accessories (e.g. Buttons or a Search Bar)</li>
    </ul>
</div>

---

# Popovers

---vertical---

## Popovers
- Popover is a view that appears above other content onscreen when people click or tap a control or interactive area.
    - Usually used when you want to show a small amount of information or functionality of your app
    - Usually anchored to a button
        - When a button is pressed, a popover is presented

---vertical---

## Example: Calendar App
<div style="display: flex;">
    <ul>
        <li>When the user clicks on the + button to add a new event, a popover appears from the button</li>
        <li>The popover cannot be dismissed unless the Cancel button is pressed, or the user is done entering information</li>
    </ul>
</div>

---

# Summary
summary img