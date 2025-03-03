<div style="text-align: left">
    <img src="/assets/tinkercademy.png" alt="Tinkercademy Logo" height="128px">
    <img src="https://raw.githubusercontent.com/swiftinsg/branding/main/logos/icons/png/coloured%20-%20dark%20background.png" alt="Swiftinsg Logo" height="128px" style="margin-left: 64px;">
</div>

## Track B: Unit 4A

# Array, Previews And Structs

---

# Logical Operators

These allow you to combine multiple `if` conditions together.

---vertical---

## Introduction

- A logical operator is a type of an operator that you can use to make your conditional code more specific.
- Each of these three operators changes conditions in its own specific way:

<br />
<br />

| Symbol | Description |
| ------ | ----------- |
| `&&`   | AND         |
| `\|\|` | OR          |
| `!`    | NOT         |

---vertical---

## Logical AND (`&&`) Operator

This code only runs if both conditions are true.

```swift[4-6]
let a = 5
let b = 10

if a == 5 && b == 10 {
    print("Both conditions are true")
}
```

---vertical---

## Logical OR (`||`) Operator

This code runs if either condition is true.

```swift[4-6]
let a = 5
let b = 10

if a == 5 || b == 20 {
    print("At least one condition is true")
}
```

---vertical---

## Logical NOT (`!`) Operator

This code runs if the condition is false.

```swift[3-5]
let a = 5

if !(a == 10) {
    print("a is not 10")
}
```

---

# Arrays

Imagine an announcement in school, asking for your class to go somewhere. The announcer won’t call you out by name, one by one… they’ll ask for your class name, e.g. Secondary 2C.

That’s a _single variable that has all of your names in an ordered list_ — an array!

---vertical---

## Without Arrays

What's wrong here?

```swift
var student1 = "Alice"
var student2 = "Bob"
var student3 = "Charles"
var student4 = "Eunice"
// oh no! we forgot one
var student5 = "Deborah"
// wait, they're not in order, we need to swap s4 and s5
var tempstudent = student5
student5 = student4
student4 = tempstudent
print(student4)
print(student5)

// Wait. . . Alice got food poisoning and dropped out
// Now we need to move everyone again
student1 = "I give up"
```

---vertical---

## Arrays

- Store multiple items in a single variable
- Much easier than working with dozens of variables!
- Start counting from 0

![Array Diagram](/markdown/track_b/assets/array-diagram.png)

---vertical---

## With Arrays

```swift
var students = ["Alice", "Bob", "Charles", "Deborah"]
// Add a student!
students.append("Eunice")

print(students)
// Who 's the first student?
print(students[0])

// Remove a student!
students.remove(at: 0)
print(students)

// Oh we spelled Bob's name wrong
students[0] = "Blob"
print(students)
```

---vertical---

## Visualising Arrays

```swift
var students = ["Alice", "Bob", "Charles", "Deborah"]
```

![](/markdown/track_b/assets/visualising-arrays-0.png)

---vertical---

## Visualising Arrays

```swift
students.append("Eunice")
```

![](/markdown/track_b/assets/visualising-arrays-1.png)

---vertical---

## Visualising Arrays

```swift
students.remove(at: 0)
```

![](/markdown/track_b/assets/visualising-arrays-2.png)

---vertical---

## Visualising Arrays

```swift
students[0] = "Blob"
```

![](/markdown/track_b/assets/visualising-arrays-4.png)

---vertical---

## Visualising Arrays

```swift
print(students.count)
```

![](/markdown/track_b/assets/visualising-arrays-5.png)

---vertical---

## Visualising Arrays

```swift
students.insert("Daisy", at: 2)
```

![](/markdown/track_b/assets/visualising-arrays-6.png)

---vertical---

## Arrays

Terminology:

- **Array**: A collection that stores an ordered list of items
- **Index**: Integer representing position of item in array

Methods/variables:

- `.append(newElement)`: Add to the end
- `.insert(newElement, at:)`: Add to a certain index
- `.remove(at:)`: Remove from a certain index
- `.count`: How many items in the array

---

# Structs

Imagine you have a box of Legos. Each Lego piece is like a little part of a bigger thing you want to build, like a spaceship or a castle. Now, think of a "struct" like a special kind of Lego set where you can put `different types` of Legos together to make something cool.

---vertical---

## How they work

Let’s say you want to make a little car. With a struct, you can decide that your car will have different parts: a color, a size, and a number of wheels. So, your struct would be like a blueprint for your car:

```swift
// Hey, I'm going to make something called a 'Car'.
struct Car {
    var colour : String
    var size : Int
    var wheels : Int
};

// Now I can make a car!
var myCar = Car(colour: "Red", size: 5, wheels: 4)
```

---

# Previews

---vertical---

## What are Previews?

- A way to see your UI in real-time as you code

```swift
struct ContentView: View {
    var body: some View {
        Text("Hello, world!")
    }
}

#Preview {
    ContentView()
}
```

---vertical---

## Rendering Multiple Previews

```swift
struct ToggleButton: View {

    var buttonState: Bool

    var body: some View {
        ...
    }
}

#Preview {
    ToggleButton(buttonState: true)
    ToggleButton(buttonState: false)
}
```
