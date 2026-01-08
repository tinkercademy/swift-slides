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

## Swift
<div style="display: flex; align-items: center; gap: 20px; padding: 20px;">
  <div style="flex: 1;">
    <ul>
      <li>Swift is an open-source programming language created by Apple.</li>
      <li>Used by developers to build apps for iOS, iPadOS, macOS, watchOS, tvOS, and more.</li>
    </ul>
  </div>
  <div style="flex: 1;">
    <img src="/markdown/track_x/assets/x-1-8-0.png" alt="XCode UI" style="width: 100%; max-width: 300px;">
  </div>
</div>


---

# Introduction to Swift Playgrounds

---

### Getting Started

<div style="display: flex; align-items: center; gap: 20px; padding: 20px;">
  <div style="flex: 1;">
    <ol>
      <li>Open the <strong>Swift Playgrounds</strong> app on your iPad.</li>
      <li>Tap on </strong>Learn to Code</strong>.</li>
    </ol>
  </div>
  <div style="flex: 1; position: relative; width: 700px; height: 500px;">
    <img src="/markdown/track_x/assets/x-1-35-0.png" alt="Swift Playgrounds Homepage" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

### Getting Started

<div style="display: flex; align-items: center; gap: 20px; padding: 20px;">
  <div style="flex: 1;">
    <ol>
      <li>Download <strong>Get Started with Code</strong>.</li>
    </ol>
  </div>
  <div style="flex: 1; position: relative; width: 700px; height: 500px;">
    <img src="/markdown/track_x/assets/x-1-10-0.PNG" alt="Swift Playgrounds UI" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

### Getting Started

<div style="display: flex; align-items: center; gap: 20px; padding: 20px;">
  <div style="flex: 1;">
    <ol>
      <li>Return back to the home screen.</li>
      <li> You will see your copy of Get Started with Code.</li>
    </ol>
  </div>
  <div style="flex: 1; position: relative; width: 700px; height: 500px;">
    <img src="/markdown/track_x/assets/x-1-31-0.png" alt="Swift Playgrounds Homepage" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

### Navigating the Playground

<div style="display: flex; align-items: center; gap: 20px; padding: 20px;">
  <!-- Text Section -->
  <div style="flex: 1;">
    <ul>
      <li>Tap on the <strong>sidebar icon</strong> to navigate through different chapters.</li>
      <li>Tap on the <strong>X icon</strong> to return to <strong>My Playgrounds</strong>.</li>
    </ul>
  </div>
  <!-- Image Section -->
  <div style="flex: 1; position: relative; width: 700px; height: 500px;">
    <img src="/markdown/track_x/assets/x-1-11-0.png" alt="Swift Playgrounds UI Sidebar" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

### What you will be doing:

- Control a character, Byte, using Swift.
- Navigate around the game world and complete tasks such as toggling switches and collecting gems.

---

# Commands

---

<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; padding: 20px;">
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-14-0.png" alt="Screenshot showing cake" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-14-1.png" alt="Screenshot showing drone blueprints" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; padding: 20px;">
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-15-0.png" alt="Screenshot showing drone" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-15-1.png" alt="Screenshot showing coding inspirational words" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

### Controlling Byte
<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; padding: 20px;">
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-16-0.png" alt="Screenshot showing moveForward()" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-16-1.png" alt="Screenshot showing collectGem()" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

# camelCase
<div style="display: flex; align-items: center; gap: 20px; padding: 20px;">
  <div style="flex: 1;">
    <ul>
      <li>Commands have no spaces between words.</li>
      <li>If your command has two or more words, the standard practice is to capitalize the first letter of every word <strong>EXCEPT</strong> the first word.</li>
      <li>e.g., <code>moveForward()</code>, <code>collectGem()</code></li>
    </ul>
  </div>
  <div style="flex: 1; position: relative; width: 700px; height: 500px;">
    <img src="/markdown/track_x/assets/x-1-17-0.png" alt="Screenshot showing camelCase" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

# Introduction to the interface
<div style="display: flex; justify-content: center; align-items: center;">
  <div style="position: relative; width: 1050px; height: 700px;">
    <img src="/markdown/track_x/assets/x-1-18-0.png" alt="Screenshot of Swift Playgrounds UI" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

## Let's try issuing commands!
<div style="display: flex; align-items: center; gap: 20px; padding: 20px;">
  <div style="flex: 1;">
    <ul>
      <li>After tapping <strong>Tap to enter code</strong>, you can either:
        <ul>
          <li>Type the code out, or</li>
          <li>Use the keyboard shortcuts at the bottom of the screen.</li>
        </ul>
      </li>
      <li>After you are done with the code, click <strong>Run My Code</strong> to see Byte in action!</li>
      <li>You can tap on the <strong>Speedometer</strong> to speed Byte up or step through the code step by step.</li>
    </ul>
  </div>
  <div style="flex: 1; position: relative; width: 700px; height: 500px;">
    <img src="/markdown/track_x/assets/x-1-19-0.png" alt="Screenshot showing Issuing Commands in Swift Playgrounds" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

# Hands-On
### Try out the exercises under Commands!
<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; padding: 20px;">
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-20-0.png" alt="Screenshot showing Finding and Fixing Bugs in Swift Playgrounds" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-20-1.png" alt="Screenshot showing Toggling a Switch in Swift Playgrounds" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

# For Loops

---

<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; padding: 20px;">
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-22-0.png" alt="Screenshot showing seeds in a garden" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-22-1.png" alt="Screenshot showing seeds with different text" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; padding: 20px;">
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-23-0.png" alt="Screenshot showing a for loop being used for seeding" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-23-1.png" alt="Screenshot showing for loop's syntax for seeding" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

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

# Hands-On
### Try out the exercises under For Loops!
<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; padding: 20px;">
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-26-0.png" alt="Screenshot showing Looping All The Sides in Swift Playgrounds" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-26-1.png" alt="Screenshot showing Using Loops in Swift Playgrounds" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

# Conditionals

---

<div style="display: flex; justify-content: center; align-items: center;">
  <div style="position: relative; width: 1400px; height: 1000px;">
    <img src="/markdown/track_x/assets/x-1-28-0.png" alt="Screenshot displaying traffic jam on GPS" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; padding: 20px;">
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-29-0.png" alt="Screenshot showing if-statement at traffic light" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-29-1.png" alt="Screenshot showing traffic light if-loop logic" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; padding: 20px;">
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-30-0.png" alt="Screenshot showing explanation of if-loop logic" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-30-1.png" alt="Screenshot showing false if-loop" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

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

<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; padding: 20px;">
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-33-0.png" alt="Screenshot showing operators" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-33-1.png" alt="Screenshot showing operators and if-loop example" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>

---

# Hands-On
### Try out the exercises under Conditionals!
<div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; padding: 20px;">
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-34-0.png" alt="Screenshot showing Conditional Climb in Swift Playgrounds" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-34-1.png" alt="Screenshot showing Using else if in Swift Playgrounds" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
  <div style="position: relative; width: 1050px; height: 650px;">
    <img src="/markdown/track_x/assets/x-1-34-2.png" alt="Screenshot displaying Checking for Switches in Swift Playgrounds" style="position: absolute; top: 5%; left: 8.2%; width: 79%; height: auto; z-index: 1;">
    <img src="/markdown/track_x/assets/iPad.png" alt="iPad" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;">
  </div>
</div>
