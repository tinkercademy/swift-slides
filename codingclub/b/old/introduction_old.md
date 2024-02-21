<div style="text-align: left">
    <img src="/assets/tinkercademy.png" alt="Tinkercademy Logo" height="128px">
    <img src="https://raw.githubusercontent.com/swiftinsg/branding/main/logos/icons/png/coloured%20-%20dark%20background.png" alt="Swiftinsg Logo" height="128px" style="margin-left: 64px;">
</div>

## Track B : Unit 0

# What is Swift

---vertical---

## What is Swift?

- Swift is an open-source programming language created by Apple
- Used by developers to build apps for iOS, iPadOS, macOS, watchOS, tvOS, and more.

---

# Introduction to Swift Playgrounds

---vertical---

## Getting Started

### 🚀 Swift Playgrounds for iPad

---vertical---

## <img style="margin-bottom: -8px" src="/assets/swift-playgrounds.png"> Swift Playgrounds

### _Swift Playgrounds_ helps you learn to code and build apps using Swift, the same powerful language used to create world-class apps for the App Store.

[Swift Playgrounds on the App Store](https://apps.apple.com/app/id908519492).

---vertical---

TODO: Insert content where you create a get started with code file

---vertical---

<div style="display:flex;justify-content:center;align-items:center;">
    <img src="./assets/playgrounds-empty-project.png" alt="A screenshot of an empty Playgrounds project with ContentView open">
</div>

---vertical---

<div style="display:flex;justify-content:center;align-items:center;">
    <img src="./assets/annotated-playgrounds-interface.png" alt="An annotated Playgrounds screenshot pointing out the various features such as the side bar, toolbar, tab bar, editor, and console.">
</div>

---vertical---

## What’s in the toolbar

<div style="display:flex;justify-content:center;align-items:center;">
    <img src="./assets/annotated-playgrounds-toolbar.png" alt="An annotated Playgrounds screenshot pointing out the various buttons in the toolbar.">
</div>

---



## Getting started

<div style="display: flex;">
    <ul style="width:60%">
        <li>Open the Swift Playgrounds app on your iPad</li>
        <li>Under “Get a Playground”, tap on “Get Started with Code”</li>
    </ul>
    <img src="./assets/intro-to-swift.png" alt="TODO: Swift Playgrounds">
</div>

---vertical---

## Navigating the Playground

<div style="display: flex;">
    <ul style="width:60%">
        <li>Tap on the 
            <div style="display: inline-flex; align-self: center;position:relatiive; ">
                <img src="./assets/sidebar.svg">
            </div>
            icon to open the sidebar to navigate through the different chapters
        </li>
        <li>Under “Get a Playground”, tap on “Get Started with Code” </li>
    </ul>
    <img src="./assets/intro-to-swift.png" alt="TODO: Swift Playgrounds">
</div>

---vertical---

## Navigating the Playground

<div style="display: flex;">
    <ul style="width:60%">
        <li>Tap on the <code>&#709;</code> icon to open the sidebar to navigate through the different chapters </li>
        <li>Tap on the ✖ icon to go back to My Playgrounds</li>
    </ul>
    <img src="./assets/intro-to-swift.png" alt="TODO: Swift Playgrounds">
</div>

---vertical---

## What you will be doing

<div style="display: flex;">
    <ul style="width:60%">
        <li>You will be controlling a character, Byte, using Swift</li>
        <li>Navigate around the game world and complete tasks such as toggling switches and collecting gems</li>
    </ul>
    <img src="./assets/intro-to-swift.png" alt="TODO: Swift Playgrounds">
</div>

---

# Commands

---vertical---

TODO: add 2 images

---vertical---

TODO: add another 2 images

---vertical---

## Controlling Byte

<div style="display: flex;justify-content: center; align-items: center;">
    <div style="flex: 1;text-align: center;">
        <h3 style="text-align:center;"><b>moveForward()</b></h3>
        <img src="./assets/intro-to-swift.png" alt="TODO: Swift Playgrounds">
    </div>
    <div style="flex: 1;text-align: center;">
        <h3 style="text-align:center;"><b>collectGem()</b></h3>
        <img src="./assets/intro-to-swift.png" alt="TODO: Swift Playgrounds">
    </div>
</div>

---vertical---

## camelCase

<div style="display: flex;">
    <ul style="width:60%">
        <li>Commands have no spaces between words</li>
        <li>If your command has two or more words, the standard practise is to capitalise the first letter of every word EXCEPT the first word</li>
        <li>E.g move<code><b>F</b></code>orward(), collect<code><b>G</b></code>em()</li>
    </ul>
    <img src="./assets/intro-to-swift.png" alt="TODO: Swift Playgrounds">
</div>

---vertical---

## Introduction to the Interface

<img src="./assets/intro-to-swift.png" alt="TODO: Swift Playgrounds">

---vertical---

## Let’s try issuing commands!

<div style="display: flex;">
    <ul style="width:60%">
        <li>After tapping Tap to enter code, you can either </li>
        <ol>
            <li>Type the code out or, </li>
            <li>Use the keyboard shortcuts and the bottom of the screen</li>
        </ol>
        <li>After you are done with the code, click Run My Code to see Byte in action! </li>
        <li>You can tap on
            <div style="display: inline-flex; align-self: center;position:relatiive; ">
                <img src="./assets/speed.svg">
            </div>
            to speed Byte up or step through the code step by step
        </li>
    </ul>
    <img src="./assets/intro-to-swift.png" alt="TODO: Swift Playgrounds">
</div>

---vertical---

## Hands-on

### Try out the other exercises under Commands!

<div style="display: flex;justify-content: center; align-items: center;">
    <div style="flex: 1;text-align: center;">
        <img src="./assets/intro-to-swift.png" alt="TODO: Swift Playgrounds">
    </div>
    <div style="flex: 1;text-align: center;">
        <img src="./assets/intro-to-swift.png" alt="TODO: Swift Playgrounds">
    </div>
</div>

---

# For Loops

---vertical---

## `for` Loops Syntax

```swift
for i in 1 ... 4 {
    moveForward()
}
```

---vertical---

## What is i?

<div style="display: flex;">
<ul style="margin-inline: 10px;">
<li>"<code>i</code>" is a variable. It represents a value, and it can be named anything (e.g. i or potato).</li>
<li>The for loop will first set i to 1. It will run whatever code is in the curly brackets. Then, it will run it again but with i = 2, then 3, then 4, then 5.</li>
</ul>

```swift[]
for i in 1 ... 5 {
    print(i)
}
```

</div>
