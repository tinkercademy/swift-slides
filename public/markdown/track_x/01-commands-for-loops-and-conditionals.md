# Phase Overview

- Commands
- For Loops
- Conditional Code

---

# Lesson Plan

### What you'll learn:
- Commands
- For Loops
- Conditional Code

### What you'll do:
- Get Started with Code on Swift Playgrounds

### What you'll need:
- Swift Playgrounds App on your iPad

---

# What is Swift?

---

<!-- .slide: class="layout-steps-media" -->
## Swift

- Swift is an open-source programming language created by Apple.
- Used by developers to build apps for iOS, iPadOS, macOS, watchOS, tvOS, and more.

![XCode UI](/markdown/track_x/assets/x-1-8-0.png)

---

# Introduction to Swift Playgrounds

---

<!-- .slide: class="layout-steps-media" -->
### Getting Started

1. Open the **Swift Playgrounds** app on your iPad.
2. Tap on **Learn to Code**.

![Swift Playgrounds Homepage](/markdown/track_x/assets/x-1-35-0.png)

---

<!-- .slide: class="layout-steps-media" -->
### Getting Started

1. Download **Get Started with Code**.

![Swift Playgrounds UI](/markdown/track_x/assets/x-1-10-0.PNG)

---

<!-- .slide: class="layout-steps-media" -->
### Getting Started

1. Return back to the home screen.
2. You will see your copy of Get Started with Code.

![Swift Playgrounds Homepage](/markdown/track_x/assets/x-1-31-0.png)

---

<!-- .slide: class="layout-steps-media" -->
### Navigating the Playground

- Tap on the **sidebar icon** to navigate through different chapters.
- Tap on the **X icon** to return to **My Playgrounds**.

![Swift Playgrounds UI Sidebar](/markdown/track_x/assets/x-1-11-0.png)

---

### What you will be doing:

- Control a character, Byte, using Swift.
- Navigate around the game world and complete tasks such as toggling switches and collecting gems.

---

# Commands

---

<!-- .slide: class="layout-two-up" -->

![Screenshot showing cake](/markdown/track_x/assets/x-1-14-0.png)
![Screenshot showing drone blueprints](/markdown/track_x/assets/x-1-14-1.png)

---

<!-- .slide: class="layout-two-up" -->

![Screenshot showing drone](/markdown/track_x/assets/x-1-15-0.png)
![Screenshot showing coding inspirational words](/markdown/track_x/assets/x-1-15-1.png)

---

<!-- .slide: class="layout-two-up" -->
### Controlling Byte

![Screenshot showing moveForward()](/markdown/track_x/assets/x-1-16-0.png)
![Screenshot showing collectGem()](/markdown/track_x/assets/x-1-16-1.png)

---

<!-- .slide: class="layout-steps-media" -->
# camelCase

- Commands have no spaces between words.
- If your command has two or more words, the standard practice is to capitalize the first letter of every word **EXCEPT** the first word.
- e.g., `moveForward()`, `collectGem()`

![Screenshot showing camelCase](/markdown/track_x/assets/x-1-17-0.png)

---

<!-- .slide: class="layout-media-centre" -->
# Introduction to the interface

![Screenshot of Swift Playgrounds UI](/markdown/track_x/assets/x-1-18-0.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-steps-media" -->
## Let's try issuing commands!

- After tapping **Tap to enter code**, you can either:
  - Type the code out, or
  - Use the keyboard shortcuts at the bottom of the screen.
- After you are done with the code, click **Run My Code** to see Byte in action!
- You can tap on the **Speedometer** to speed Byte up or step through the code step by step.

![Screenshot showing Issuing Commands in Swift Playgrounds](/markdown/track_x/assets/x-1-19-0.png)

---

<!-- .slide: class="layout-two-up" -->
# Hands-On
### Try out the exercises under Commands!

![Screenshot showing Finding and Fixing Bugs in Swift Playgrounds](/markdown/track_x/assets/x-1-20-0.png)
![Screenshot showing Toggling a Switch in Swift Playgrounds](/markdown/track_x/assets/x-1-20-1.png)

---

# For Loops

---

<!-- .slide: class="layout-two-up" -->

![Screenshot showing seeds in a garden](/markdown/track_x/assets/x-1-22-0.png)
![Screenshot showing seeds with different text](/markdown/track_x/assets/x-1-22-1.png)

---

<!-- .slide: class="layout-two-up" -->

![Screenshot showing a for loop being used for seeding](/markdown/track_x/assets/x-1-23-0.png)
![Screenshot showing for loop's syntax for seeding](/markdown/track_x/assets/x-1-23-1.png)

---

### for-loop Syntax

```swift
for i in 1 ... 5 {
    // code to be repeated
}
```

---

### What is `i`?

- `i` is a variable. It represents a value and can be named anything (e.g., `i` or `potato`).
- The for loop sets `i` to 1 initially and repeats the code inside the curly brackets for each value of `i` until the loop ends.

---

<!-- .slide: class="layout-two-up" -->
# Hands-On
### Try out the exercises under For Loops!

![Screenshot showing Looping All The Sides in Swift Playgrounds](/markdown/track_x/assets/x-1-26-0.png)
![Screenshot showing Using Loops in Swift Playgrounds](/markdown/track_x/assets/x-1-26-1.png)

---

# Conditionals

---

<!-- .slide: class="layout-media-centre" -->

![Screenshot displaying traffic jam on GPS](/markdown/track_x/assets/x-1-28-0.png)
<!-- .element: class="r-stretch" -->

---

<!-- .slide: class="layout-two-up" -->

![Screenshot showing if-statement at traffic light](/markdown/track_x/assets/x-1-29-0.png)
![Screenshot showing traffic light if-loop logic](/markdown/track_x/assets/x-1-29-1.png)

---

<!-- .slide: class="layout-two-up" -->

![Screenshot showing explanation of if-loop logic](/markdown/track_x/assets/x-1-30-0.png)
![Screenshot showing false if-loop](/markdown/track_x/assets/x-1-30-1.png)

---

### if-else Syntax

```swift
if condition {
    // code if condition is true
} else {
    // code if condition is NOT true
}
```

---

# Comparators

---

### Comparators

In the Playgrounds tutorial, the if statement uses the value of isOnClosedSwitch or isOnGem to make decisions.

These are boolean (Bool) variables, which can be either true or false.
- isOnClosedSwitch represents whether a switch is closed
- isOnGem represents whether Byte is on a gem

We can also directly use statements using comparators (<=, <, >, >=, ==, !=) instead of boolean variables.
- For example, a == b will be true if a is equal to b, and false if a is not equal to b.

---

<!-- .slide: class="layout-two-up" -->

![Screenshot showing operators](/markdown/track_x/assets/x-1-33-0.png)
![Screenshot showing operators and if-loop example](/markdown/track_x/assets/x-1-33-1.png)

---

# Hands-On
### Try out the exercises under Conditionals!

![Screenshot showing Conditional Climb in Swift Playgrounds](/markdown/track_x/assets/x-1-34-0.png)
![Screenshot showing Using else if in Swift Playgrounds](/markdown/track_x/assets/x-1-34-1.png)
![Screenshot displaying Checking for Switches in Swift Playgrounds](/markdown/track_x/assets/x-1-34-2.png)
