# Unit 2 - Swift Language 1
### Variables, Constants, Types, Operators, Printing, Strings, Interpolation, Functions, and Conditionals and some SwiftUI!
## <span style="color: #c2410c;">Unit Overview</span>
Introduction to the Swift language
- <span style="color: #15803d;">Variables</span>, <span style="color: #15803d;">Constants</span>, and <span style="color: #15803d;">Types</span>
- <span style="color: #b91c1c;">Operators</span>
- <span style="color: #1d4ed8;">Printing</span>, <span style="color: #1d4ed8;">Strings</span>, and <span style="color: #1d4ed8;">Interpolation</span>
- <span style="color: #b91c1c;">Functions</span>
- <span style="color: #15803d;">Conditionals</span>
## <span style="color: #c2410c;">Swift vs. SwiftUI</span>
**Swift** is an open-source *programming language* created by Apple for building apps.
- Before Swift, Apple developers mostly used another language, Objective-C.

**SwiftUI** is a *user interface toolkit* using the Swift language* *that allows programmers to compose apps on Apple platforms.
- There are other toolkits still in use, such as AppKit for macOS and UIKit for iOS/iPadOS.
## <span style="color: #c2410c;">Getting started</span>
We&#39;ll use <span style="color: #1d4ed8;">***Xcode Playgrounds***</span> for this lesson. You can also use*** ***<span style="color: #b91c1c;">***Swift Playgrounds***</span> for Mac or iPad, but our screenshots are from Xcode Playgrounds on Mac.
In Xcode Playgrounds, there&#39;s no app to design and no SwiftUI—though in the final task, we&#39;ll have you run this code in a SwiftUI app.
It&#39;s all still Swift! But with a couple of *small *<span style="color: #15803d;">*differences*</span>:
• You need to run your code yourself using the ▶️<span style="color: #1d4ed8;"> Run</span> button in the bottom right                (shortcut: ⌘-R)
• Playgrounds mode lets you <u>*add pages of code*</u>, which we&#39;ll use to organise the different concepts we&#39;re learning!
## <span style="color: #c2410c;">Making a Playground</span>
To get started, start <span style="color: #15803d;">**Xcode**</span>, then choose <u>*File → New → Playground*</u>, or take a deep breath and  <u>*Option-Shift-Cmd-N*</u>.
 Create a **Blank** Playground, and save it anywhere, such as your Desktop and call it “<span style="color: #1d4ed8;">*Swift Language 1.*</span>”
---
![image](/assets/track_sap/unit_02/image-001.png)
---
## <span style="color: #c2410c;">Xcode Playgrounds</span>
This is a simplified version of the Xcode interface:
• <span style="color: #1d4ed8;">***Left sidebar***</span> shows different Playground pages
• <span style="color: #b91c1c;">***Console***</span><span style="color: #1d4ed8;"> </span>appears at the bottom
• Right section displays a preview of any <span style="color: #15803d;"><u>**variables or calculations**</u></span> on that line
• In the middle code section, press the run ▶️<span style="color: #1d4ed8;"> </span>button in the sidebar to execute all highlighted code up to that line.
---
![image](/assets/track_sap/unit_02/image-002.png)
---

# <span style="color: #c2410c;">Unit 2.1-Variables, Constants and Types</span>
Storing data, and what sort of data is stored.
Type in this code. It’s OK to get the error!
---
![image](/assets/track_sap/unit_02/image-003.png)
---
## <span style="color: #1d4ed8;">***Code:***</span>
```swift
var numberOfCookies = 10
var myName = "Cookie Monster"
var amIHungry = true
// OM NOM NOM NOM
numberOfCookies = 0
// ME NO LIKE DONUT
let numberOfDonuts = 10
// BUT ME DESPERATE
numberOfDonuts = 5
```
## <span style="color: #b91c1c;">***Explainer:***</span>
In this code, we create variables and constants, then try to change them. We&#39;re working with three different types: `numberOfCookies` is an `Int`, `myName` is a `String`, and `amIHungry` is a `Bool`. We&#39;ll explore these types in more detail later.
You&#39;ll see some errors—that&#39;s expected! Click the red dots to learn more about what went wrong.
Notice the lines starting with `//`? Those are comments. Swift ignores them completely.
## **Naming variables and constants:**
You can store information in variables or constants. Their names:
• Must start with a letter or an underscore _
• Can be emoji (e.g., `var` 🍕), but please don&#39;t use emoji variable names unless you want to annoy someone with your code
• Cannot contain spaces
• Cannot start with numbers
• Are case-sensitive!
We generally name them in camelCase—lowercase to start, no spaces between words, and uppercase for new words.
## <span style="color: #c2410c;">Declaring variables:</span>
Variables:
Declare a variable using the `var` keyword before its name, e.g., `var numberOfCookies = 10`
To change its value later, just use the name—no need for `var` again, e.g., `numberOfCookies = 0`
Constants:
Declare a constant using the `let` keyword, e.g., `let numberOfDonuts = 10`
Once set, you can&#39;t change it!
Think: Why would anyone bother with something so seemingly useless?
## <span style="color: #c2410c;">Reserved keywords:</span>
Some words can&#39;t be used as variable or constant names—these are reserved keywords in Swift.
A reserved keyword is a word the programming language uses for its own syntax, including declarations, statements, expressions, types, and patterns.
For example, `var class = &quot;Secondary 2A&quot;` will return an error because `class` is a reserved keyword.
Similarly, you can&#39;t name a variable `var`.
## <span style="color: #c2410c;">Comments:</span>
The grey/faded `//` lines are comments.
We saw these in Unit 1—they&#39;re ignored by Swift.
You can also comment with `/*` …anything in between here, even new lines... `*/`
Comments are great for writing &quot;notes to yourself&quot; or others.
Someday, you&#39;ll code till 3am, wake up at 8am, look at your code, and wonder, &quot;*What in the world was I thinking??*&quot;—<u>**comments**</u> would be useful here.
Or you might be working in a team, and someone has to take over your code. They&#39;d really appreciate if you explained what you were trying to do with some complex lines of code!
## <span style="color: #c2410c;">Common Variable Types:</span>
Integer (`Int`) — whole numbers
Double-precision floating point numbers (`Double`) — numbers with decimal values (don’t use the Float type)
`String`— text, surrounded by &quot;double quotes&quot;
Booleans (`Bool`) — `true or false`
… and a few more we might see later.
---
![image](/assets/track_sap/unit_02/image-004.png)
---
## <span style="color: #c2410c;">Type inference:</span>
In our example code, we didn&#39;t specify a type for any of our variables and constants—Swift inferred the types from what was written.
`var numberOfCookies = 10` is an `Int` because it has no decimal point.
`var myName = &quot;Cookie Monster&quot;` is a `String` because of the double quotes.
`var amIHungry = true` is a `Bool` because it&#39;s `true` or `false` (different from `&quot;true&quot;` or `&quot;false&quot;`, which are `String`s!).
<span style="color: #a16207;">**What**</span> if you want to specify a type explicitly?
For example, say you want to start `numberOfCookies` at `10` but allow it to become `0.5` later—because you&#39;re the kind of person who leaves half a cookie in the jar.
(That&#39;s terrible.)
You&#39;d need to use type annotation to tell Swift exactly what type your variable should be.
## <span style="color: #c2410c;">Type annotation:</span>
You can *annotate* each variable declaration with a type, by using a colon, followed by the type name.
`var thisIsAnIntBecauseWeSaidSo: Int = 10`
`var thisIsAnIntBecauseSwiftGuessed = 20`
`var canYouGuessThisType = 20.5`
`var wellThisOneIsAnnotated: Double = 100.0`
`var whatAboutThis = &quot;true&quot;`
## <span style="color: #c2410c;">Swift and Type Safety:</span>
Once you declare a variable or constant as a certain type, you can&#39;t change its type—ever!
In our example code, we couldn&#39;t write `numCookies = &quot;no more&quot;` because the right-side value is a `String`, and we set `numCookies` up as an `Int`.
Swift won&#39;t even let you write `numCookies = 0.5`—because `0.5` is a `Double`, not an `Int`!
We&#39;ll explore different types in the next section.
## <span style="color: #c2410c;">Before we move on… </span>
Open up the left sidebar.
Press + in the bottom left corner (it’s small!) to see ***New Playground Page***.
You’ll get a new page, Name it <span style="color: #1d4ed8;">***Exercise 1***</span>**.**
Rename Untitled Page (the one you were just on) to Variables, Constants, and Types.
To rename, click on the name in the sidebar when it’s already selected, and wait.
---
![image](/assets/track_sap/unit_02/image-005.png)
---
## <span style="color: #1d4ed8;">Exercise 1:</span>
Type out the code shown into your Playground page.
Don’t just use image recognition to lift the text from this image! Type it out so you get used to typing Swift code.
It’ll give you lots of errors!
Can you fix the code so that Playgrounds doesn’t give you any errors? There are many ways to do this.
---
![image](/assets/track_sap/unit_02/image-006.png)
---

# <span style="color: #c2410c;">Unit 2.2-Operators                                                                   </span>
Math! And Types
## <span style="color: #c2410c;">Before we start… </span>
Open up the left sidebar, and press + in the bottom left corner to see <span style="color: #1d4ed8;">***New Playground Page***</span>.
You’ll get a new page. Name it <span style="color: #c2410c;"><u>**Operators**</u></span> for this chapter’s code.
Feel free to reorder your pages, so this comes after Variables, Constants, and Types and Exercise 1.
We won’t remind you of this in subsequent chapters! Make a new page for each exercise and topic.
## <span style="color: #c2410c;">YOUR OWN CALCULATOR</span>
```swift
let sum = 1 + 1
let diff = 5 - 1
let diff2 = 10 - sum // re-using a constant here!
// * is multiply, / is divide
let a = 10
let b = 20
let product = a * b
let div = b / a
let div2 = a / b // wait... my elementary school math teacher might disagree with this result
// % is remainder, or modulo
let rem = 21 % 5 // remainder of 21 when divided by 5

// order of operations is BODMAS, like in real math
var ordered = 5 + 2 * 3`

// and you can group with brackets
let output = (5 + 2) * 3`
```
## <span style="color: #c2410c;">Running Code:</span>
For this code, you need to click the ▶️ button before anything happens.
That’ll make Swift run (or execute) the code.
This might take a while! We’re not sure why… it’s not very complex code.
Results will be available on the preview on the right. Click on the (eye symbol(I Cant type SF Symbols in Notion)) to see a long result.
---
![image](/assets/track_sap/unit_02/image-007.png)
---
## Explainer:
In this code, we demonstrated some basic mathematical concepts: adding, subtracting, multiplying, dividing, and remainder.
You can work with numbers, variables, or constants — just remember that constants can’t be changed.
On each line, the left side is the variable or constant, while the right side is an **operation**. When the operation is complete, the value is **assigned** into the left.
---
![image](/assets/track_sap/unit_02/image-008.png)
---
## Integer division:
`a`(10) divided by `b` (20) is zero??!?
Did Apple, the world’s biggest company (by market value, at time of writing), fail math when creating Swift?
Is that why they have so many zeroes behind their value?
Don’t worry: Swift does integer division.
This means that if you divide an integer by another integer, the result is an integer.
What if you really want to divide an integer variable by a larger integer variable, to get a fraction (or `Double`)? You’d need to learn about types.
## <span style="color: #c2410c;">Swift and type safety:</span>
Swift is very strict about not mixing types. You saw earlier that you couldn’t assign an `Int` to a `Double` value.
This also means you can’t add a `Double`value to an `Int`! So as odd as it seems, if `a`is an `Int`, you can’t divide it by `2.0` — Swift will give you an error. Test this out:
`let adiv = a / 2.0` ❌
To achieve this, you can cast `a`to a `Double`. This does not change `a`, but it does allow the operation to proceed:
`let adiv = Double(a) / 2.0` ✅
## <span style="color: #c2410c;">Type inference without variables:</span>
Swift is clever enough to infer the type of any number you type, if it’s not part of a declared variable.
Try these out:
```swift
let test1 = 5 / 2
let test2 = 5.0 / 2
let test3 = 5 / 2.0
```
There’ll be no errors!
`test1` will be an `Int`, of value `2`, because you divided two `Int`s.
`test2 and test3` will be `Doubles`, of value `2.5`, because Swift assumes each number without `.0` behind it is a `Double` as well.
## Assignment, not equality:
Here are some lines of code to type out:
```swift
var cookies = 0
cookies = cookies + 20
cookies += 20

```
The second line might be a bit confusing if you look at it as a mathematical equation — how can `cookies` be equal to `cookies + 20`? 1 is 0! Everything is wrong! — but that’s because `=` is an assignment operator. It’s taking the right side value, and saving it into the left variable.
The third line is a shorthand for the second! It stands for “increment cookies by 20”. You can use this with `-, *, and /`as well.

## <span style="color: #1d4ed8;">Exercise 2:</span>
Changing variables, when there’s someone going around eating Apple devices.
Type this out, add in the two missing lines, and try changing your `numMacBooks` and `numIPads`.
---
![image](/assets/track_sap/unit_02/image-009.png)

---

# <span style="color: #c2410c;">Unit 2.3-Printing to the Console</span>
Finally saying “Hello World”
---
![Type out this code, and open the Console to see the printed output.](/assets/track_sap/unit_02/image-010.png)
---
## <span style="color: #1d4ed8;">Code:</span>
```swift
// We can print text
print("Hello world!")
// We can print string variables with other strings
var fruitSeller = "Amazing Supermart"
var cakeSeller = "Delicious Land"

// Method 1: concatenation
print("I buy all my fruits from " + fruitSeller) // note the space after from
// Method 2: joining
print("I buy all my cakes from", cakeSeller) // no space after from

// Method 3: String interpolation
var dollars = 25000
print("I used to have $\(dollars)...")
print("But I spent it all at \(fruitSeller) and \(cakeSeller).")// 😔
```
## Printing:
How do you print? By calling the `print()` function, and putting what you want to print inside the parentheses.
We can print numbers, like `Int`s or `Double`s.
We can print `Strings`.
We can put expressions inside, like `a + b`, where a and b are numbers or text.
When you write SwiftUI, the things you print show up in the **Debug Console** in Xcode, and are *not visible to the user*!
These can be used to ***“***<u>***leave notes to yourself***</u>***” ***<span style="color: #6b7280;">e.g. checking if a certain line of code is reached.</span>

## <span style="color: #c2410c;">Concatenation &amp; Joining:</span>
To join two strings together, you can use concatenation, with just a + sign between two strings.
It won’t add a space between the two strings!
`print(&quot;Water Bottle&quot; + &quot;Pie&quot;)` will give `Water BottlePie`.
Inside a print, you can also use a comma to join two strings.
This will leave a space for you!
`print(&quot;Water Bottle&quot;, &quot;Pie&quot;)` will give `Water Bottle Pie`.
<span style="color: #6b7280;">I have no idea what Water Bottle Pie is…</span>
## <span style="color: #c2410c;">String interpolation:</span>
This is our favourite method of putting strings together in Swift.
String interpolation, using `\()`, lets you put variables (or constants) inside a string, and asking Swift to “fill in the blank”.
For instance, if you have a `Double`variable `r` , you can do:
`print(&quot;I know that the area of circle with radius \(r)cm is \(3.14159 * r * r)cm squared &quot;)` and feel really clever.
Tip: When typing, finish typing `\()` first, before “going back into the brackets” to type your variable. This lets autocomplete do its job inside the brackets!
## Exercise 3:
Create three variables, one for your name, one for your class (a.k.a. “homeroom” or “tutor group”), and one for your hobby.
Introduce yourself by printing these using string interpolation:
```swift
My name is Bob.
My class is 8C.
My hobby is Underwater Basket Weaving.
```
Don’t just use `print(&quot;My name is Bob.&quot;)`! You should be able to adjust the name variable and have the printed output change.
You may also find out you can’t name a variable `class`. Why???

---

# <span style="color: #c2410c;">Unit 2.4-Functions and Parameters</span>
Running blocks of code.
## Functions:
- A function is a block of code that performs a specific task
- Functions have names that describes their purpose, and receive arguments, in the form of parameters, that represent the data given to the function.
- Swift functions with multiple parameters have to be named by default when called.
- This is different from many languages you might have seen, like JavaScript and C++ (no parameter names), Python (optional parameter names).
- Functions can give back (return) results, or just process data.
---
![Type and run this code. Note how the second function has a parameter (name). When we call this function, we give it an argument ("Bobber").](/assets/track_sap/unit_02/image-011.png)
---
## Code:
```swift
func printIntroduction() {
print("Hello I am Bob")
print("My hobby is sleeping")
print("Bye")
}
printIntroduction() // this is *calling* the function

func printIntroductionWithName(name: String) {
print("Hello I am \(name)") // String interpolation to use the name parameter
print("My hobby is sleeping")
print("Bye")
}

// calling the function with an argument (or "actual parameter")
printIntroductionWithName(name: "Bobber")
```

---
![A (very long-named) function that takes in multiple arguments](/assets/track_sap/unit_02/image-012.png)
---
## <span style="color: #c2410c;">That function name…</span>
Isn’t that function name a bit unwieldy? It has 5 words in the function name!
Notice that in `printIntroductionWithNameAndHobbyFor`, the latter half is used to describe the variable names
It’d be great if we can just label the variables instead…

```swift
func printIntroduction(for name: String, withHobby hobby: String) {
print("Hello I am \(name)")
print("My hobby is \(hobby)")
print("Bye")
}
printIntroduction(for: "Bobbestest", withHobby: "writing nicer functions")
```
We can use **argument labels**. They come before the parameter names. This is fairly unique to Swift!
## <span style="color: #c2410c;">Argument labels; Parameter names:</span>
The <span style="color: #15803d;">highlighted words below</span> are argument labels. When you call the function, you provide an argument after each. The <span style="color: #1d4ed8;">highlighted words below</span> are parameter names. In the function, you use them just like variables. (They are actually constants, not variables!)
```swift
func printIntroduction(for name: String, withHobby hobby: String) {
      print("Hello I am \(name)")
      print("My hobby is \(hobby)")
      print("Bye")
}
```
```swift
printIntroduction(for: "Bobbestest", withHobby: "writing nicer functions")
```
Argument labels can be blank too!
If you call your argument label <span style="color: #a16207;">_</span>, the user doesn’t have to type in a label for that argument. This is useful for making function names readable! Parameter names cannot be blank.
```swift
func printFiveTimesOf(_ num: Int) {
print(num * 5)
}
```
```swift
printFiveTimesOf(10)
```
## <span style="color: #c2410c;">Indentation:</span>
Look carefully at the *indentation*: everything within the function is indented once ***(tab key)***.
This is not strictly required, though, unlike Python!
---
![image](/assets/track_sap/unit_02/image-013.png)
---
## <span style="color: #c2410c;">Functions in SwiftUI?</span>
Some SwiftUI <span style="color: #a16207;">View</span>s we’ve used have parentheses with parameters, and some have curly braces for more <span style="color: #a16207;">View</span>s. They look like functions, but they’re not — they’re `struct`s that take closures.
We’ll learn about these soon…
```swift
HStack(alignment: .top) {
       Image(systemName: “globe")
VStack {
      Text("YJ Soon")
      Text("Swift instructor")
}
}
```
## <span style="color: #c2410c;">Views aren’t functions</span>
<span style="color: #a16207;">View</span>s such as `VStack, HStack, ZStack` *aren’t functions*, despite their parentheses and curly braces.
- In regular functions, we put curly braces after* defining* the function.
- In Views, we put the curly braces when we *call *them.
- These are* closures*. We’ll find out more about them in a couple of units.
Notice too that SwiftUI <span style="color: #a16207;">View</span>s start in uppercase.
When writing our own functions, we tend to name them the way we do variables, in camelCase.
## <span style="color: #c2410c;">Functions can return values</span>
An aside; these are functions that you might see or use in SwiftUI.
If you see an arrow after the function name, that means the function returns a value — like a microwave giving you back a cooked parameter. 😋
```swift
// This example from an earlier slide prints out the result
func printFiveTimesOf(_ num: Int) {
print(num * 5)
}
printFiveTimesOf(10)
```
```swift
// This function returns a value instead, which can be saved in a constant
func returnFiveTimesOf(_ num: Int) -> Int {
return (num * 5)
}
let result = returnFiveTimesOf(10)
print(result)
```
## <span style="color: #c2410c;">Why return?</span>
When writing a function, we may want to use a value, computed by a function, to perform other operations.
For instance, we may want to assign a variable to the value of the result. So this function would not be helpful:
```swift
func multiply(x: Int, y: Int) {
print(x * y)
}
```
## <span style="color: #c2410c;">How to return?</span>
Add a <span style="color: #a16207;">`-&gt; `</span><span style="color: #b91c1c;">`Datatype`</span><span style="color: #b91c1c;"> </span>at the end of the function signature to define the return type, i.e. “what you get back”
This will allow you to set the returned value to a variable, using the <span style="color: #a16207;">`return`</span> keyword.
```swift
func multiply(x: Int, y: Int) -> Int {
return x * y
}
```
```swift
var z = multiply(x: 2, y: 5) // z is now 10
```
## <span style="color: #c2410c;">When should a function return?</span>
You don&#39;t actually need to use the <span style="color: #a16207;">`return`</span> keyword every time!
Implicit return allows you to <span style="color: #a16207;">`return`</span> a value without adding the return keyword. Note, though, *that implicit returns only work if the function only has 1 line.*
`func multiply(x: Int, y: Int) -&gt; Int {
x * y
}`
## <span style="color: #1d4ed8;">Exercise 4</span>
Write a function, `twoNumberStory`, that takes in two parameters (either `Int or Double`), `first` and `second`, and tells the user a story with the two numbers.
For example, `twoNumberStory`(`first:10, second:2`) could tell you, with some calculations:
*Once upon a time, I had 10 potatoes. One day, I ate 2 of them. That left me with 8. I gave them to 4 small children, each of whom ended up with 2 each.*
---

# <span style="color: #c2410c;">Unit 2.5-Conditionals</span>
Having Swift make decisions for you
## <span style="color: #c2410c;">Checking for something:</span>
Let’s say you have a function called
```swift
adviseWeatherFor(temperature: Double),
```
which takes a <span style="color: #c2410c;">temperature</span> and advises you on what to wear.
You’d need an *if statement* that decides what to print:
```swift
if temperature < 10 {
print("It's so cold! Wear a winter jacket!!")
}

```
Everything enclosed in curly braces is run if the condition turns out to be `true`. Look carefully at the *indentation* that shows what is included in the if statement.
## <span style="color: #c2410c;">More conditions:</span>
On the same example, what if you want to make explicit what to do if the temperature is *not less* than 10? You can use an **else** statement.
```swift
if temperature < 10 {
print("It's so cold! Wear a winter jacket!!")
} else {
print("Just a light jacket will do!")
}

```
The word **else** can be on its own line, but it’s more compact to write it on the same line as the closing curly brace of the **if** statement.
## <span style="color: #c2410c;">Even more conditions:</span>
How about accounting for more conditions? We can use if-else.
```swift
if temperature < 10 {
print("It's so cold! Wear a winter jacket!!")
} else if temperature > 30 {
print("It's so hot! Why go out???")
} else {
print("Just a light jacket will do!")
}

```
When Swift evaluates these statements, it goes from top to bottom, and only runs the block where the condition is true. It won’t bother with the rest of the statements!
## <span style="color: #c2410c;">Specific comparisons:</span>
Here’s one more condition, but at a very specific number:
```swift

if temperature < 10 {
print("It's so cold! Wear a winter jacket!!")
} else if temperature == 100 {
print("Is the temperature really the same as boiling water??")
} else if temperature > 30 {
print("It's so hot! Why go out???")
} else {
print("Just a light jacket will do!")
}

```
Notice the use of<span style="color: #a16207;"> == </span>— that’s what Swift (and other languages) use for comparison. <span style="color: #a16207;">=</span>, on the other hand, means “assign the right-side value into the left”.
If we changed the order of the second and third conditions, and give a temperature of 100, we’ll never get the boil water comment. *Any idea why?*
Here’s the full code, including some test cases. It’s important to check that your test cases cover all possible paths!
```swift
func adviseWeatherFor(temperature: Double) {
if temperature < 10 {
print("It's so cold! Wear a winter jacket!")
} else if temperature == 100 {
print("Is the temperature really the same as boiling water??")
} else if temperature > 30 {
print("It's so hot! Why go out???")
} else {
print("Just a light jacket will do.")
}
}
```
```swift
adviseWeatherFor(temperature: -10)
adviseWeatherFor(temperature: 5)
adviseWeatherFor(temperature: 40)
adviseWeatherFor(temperature: 15)
adviseWeatherFor(temperature: 100)
```
## <span style="color: #c2410c;">Other comparisons:</span>
Here are more numerical comparators:
<span style="color: #a16207;">&lt;</span>      Less than
<span style="color: #a16207;">&lt;=</span> 	Less than or equal
<span style="color: #a16207;">&gt;</span>      Greater than
<span style="color: #a16207;">=</span> 	Greater than or equal
<span style="color: #a16207;">== </span>	Equal
<span style="color: #a16207;">!= </span>	Not equal
```swift
if temperature > 35 {
print("SO HOT AHHH")
} else if temperature >= 25 {
print("Kinda warm but alright")
} else if temperature <= 0 {
print("SO COLD AHHHHH")
} else {
print("Not bad not bad")
}
```
## <span style="color: #c2410c;">**Comparing downwards**</span>
For this example, notice how we compare from the highest temperature — 35 and up — and then go down.
This lets us segment our conditions, because Swift evaluates conditions from top-to-bottom.
By the time it reaches the <span style="color: #a16207;">≥ 25</span> condition, it’s eliminated the possibility that the temperature is <span style="color: #a16207;">&gt; 35</span>.
```swift
if temp > 35 {
print("SO HOT AHHH")
} else if temp >= 25 {
print("Kinda warm but alright")
} else if temp <= 0 {
print("SO COLD AHHHHH")
} else {
print("Not bad not bad")
}
```
## <span style="color: #c2410c;">Booleans</span>
Remember booleans, or variables/constants of type Bool?
These variables can only be true or false.
That’s what the expressions after the word if are evaluating to, e.g. temperature &gt; 30 evaluates to true.
You can create booleans directly, too, and evaluate them.
```swift
let isRaining = true
if isRaining {
print("Bring an umbrella")
}
```
## <span style="color: #c2410c;">Boolean Operators</span>
Both conditions on the left-hand side and right-hand side of the condition must evaluate to `true` for the result to be `true`.
```swift
func useCoffeeMachine(isEmployee: Bool, atLevel3: Bool) {
if isEmployee && atLevel3 {
print("You can use the coffee machine.")
} else {
print("No coffee machine for you.")
}
}
```
## <span style="color: #c2410c;">The || (or) Operator</span>
Either of the values on the left-hand side or right-hand side of the condition must evaluate to true for the result to be true.
```swift
func getAccess(hasDoorKey: Bool, knowsOverridePassword: Bool) {
if hasDoorKey || knowsOverridePassword {
print("Welcome!")
} else {
print("Access denied :(")
}
}
```
## <span style="color: #c2410c;">The ! (not) Operator</span>
`true` becomes `false`
`false` become` true`
```swift
func enforceRules(isWearingMask: Bool, isIndoors: Bool) {
if isIndoors && !isWearingMask {
print("Please wear a mask indoors")
} else {
print("Either you’re outdoors, or wearing a mask indoors. OK!")
}
}
```
## <span style="color: #b91c1c;">Exercise 5</span>
You are given two numbers,
```swift
var a = 5
var b = 20
```
**If any one is divisible by the other, print “divisible”.**
*Otherwise, print “indivisible”.*
*Remember the modulo operator?* <span style="color: #a16207;">%</span>
**Remember to check both ways!**

---

# <span style="color: #c2410c;">Unit 2.6-Tabs and onAppear</span>
Setting up a tab bar app to run Swift code in SwiftUI.
## <span style="color: #c2410c;">About</span>
In this section, we’re going “back” to SwiftUI, to set up a simple app in which you can run your Swift code.
*We’ll learn some new SwiftUI concepts along the way!*
Here are the concepts covered:
`Tab View` and `tabItem` modifier
`Label `View
`onAppear` modifier
Functions
Working with multiple files and the `#Preview`
## <span style="color: #c2410c;">How it works</span>
Each time you choose a tab, a function will run. This chapter goes through setting this up; next chapter, you’ll fill in the answers.
---
![Demo video: https://dropover.cloud/b1e915](/assets/track_sap/unit_02/image-014.png)
---
## <span style="color: #c2410c;">**Setting up**</span><span style="color: #c2410c;">, </span><span style="color: #c2410c;">*a summary*</span><span style="color: #c2410c;">..</span>
This is a summary slide! Details in the next few slides
1. Create a new project in Xcode
1. Create a new file, and call it <span style="color: #1d4ed8;">SwiftCode</span>. Replace the contents of the file with the code at this link: [https://code.tk.sg/icupilibef.php](https://code.tk.sg/icupilibef.php)
1. In <span style="color: #1d4ed8;">ContentView</span>, replace the contents of the file with the code at this link: [https://code.tk.sg/iyatoputij.py](https://code.tk.sg/iyatoputij.py)
1. Fill in the functions in the <span style="color: #1d4ed8;">SwiftCode</span> file, and toggle between the tabs to test our your solutions!
## 1.Start a new project
- You should see a welcome window. Choose **Create New Project…**.
- In the template chooser: <span style="color: #1d4ed8;">**iOS**</span>, then <span style="color: #1d4ed8;">**App**</span><span style="color: #1d4ed8;">.</span>
- Fill in the following:
- Product Name: <span style="color: #1d4ed8;">**Counter**</span>
- Organization Identifier: <span style="color: #1d4ed8;">**org.yourname**</span>
- Interface: <span style="color: #1d4ed8;">**SwiftUI**</span>
- Language: <span style="color: #1d4ed8;">**Swift**</span>
- Testing System:<span style="color: #1d4ed8;"> </span><span style="color: #1d4ed8;">**None**</span>
- Storage: <span style="color: #1d4ed8;">**None**</span>
- Leave checkbox unchecked
- Save it on your Desktop — or any other folder!
- Leave the <span style="color: #1d4ed8;">**Git Repository**</span><span style="color: #1d4ed8;"> </span>checkbox unchecked.
## <span style="color: #c2410c;"> 2.Set up SwiftCode</span>
Let’s start by creating a new file.
This is very similar to the process in Xcode Playgrounds!
Press + in the bottom left corner and choose <span style="color: #1d4ed8;">New Empty File</span>.
You’ll get a new file. Name it <span style="color: #1d4ed8;">SwiftCode</span>.
Delete everything, and paste in the code from [https://code.tk.sg/icupilibef.php](https://code.tk.sg/icupilibef.php).
---
![image](/assets/track_sap/unit_02/image-015.png)

---
```swift
import SwiftUI
func problem1() {
print("----- Problem 1 -----")
// Write your solution here!
print("\n\n")
}

func problem2() {
print("----- Problem 2 -----")
// Write your solution here!
print("\n\n")
}

… repeats for 3, 4, and 5 here …

#Preview {
ContentView()
}
```
## <span style="color: #c2410c;">SwiftCode file</span>
This file is very simple! It’s got 5 functions, each of which will contain your Swift code solution to the assignment. You don’t need to fill them in now.
Notice the 3 lines at the bottom, with `#Preview { }`? That’s the app preview — it’s we get the app to show up on the right, on the Canvas.
- Try deleting it, to see what happens!
- Then <span style="color: #a16207;">⌘-Z</span> to undo and bring it back.
Notice the <span style="color: #1d4ed8;">\n</span> in the strings? That’s an escape character for a newline, so when it’s printed, it’s like you pressed “return” and got a new line.
## <span style="color: #c2410c;">3. Set up ContentView</span>
In <span style="color: #1d4ed8;">ContentView</span>, we’re going to set up a tab bar. Each tab will show a bit of text in the Simulator, and in the console — more on this in the next chapter.
To set up a tab bar, we use the `TabView` container, and add a `Tab` view. This includes a `systemImage` which shows an SF Symbol icon and text.
For each tab, we add a `Text` with an `onAppear` modifier, which calls a function defined in <span style="color: #1d4ed8;">SwiftCode</span>.
Observe how we achieve newlines this time with the multi-line string literal `&quot;&quot;&quot;`.
```swift
struct ContentView: View {
var body: some View {
TabView {
Tab("Problem 1", systemImage: "1.square") {
Text("""
Problem 1
Write a simple sum explainer.
Your answer will print in the console!
""")
.multilineTextAlignment(.center)
.onAppear {
problem1()
         }
} 

        Tab("Problem 2", systemImage: "2.square") {
            Text("""
            **Problem 2**
            Print the area of the L shape.
            Your answer will print in the console!
            """)
                .multilineTextAlignment(.center)
                .onAppear {
                    problem2()
                }
           }

      }
   }
}
#Preview {
ContentView()
}
```
## <span style="color: #c2410c;">TabView and Tab</span>
`TabView { } `is a container for multiple `Tab`s, with each `Tab` showing up as a tab in the tab bar.
Each `Tab` takes a `String` argument for the title, and a `systemImage` SF Symbol for the icon.
There’s an older way to do this you might see online, where you put any View within the `TabView`, then add a `.tabItem { } `modifier to make this into a member of the tab bar.
## <span style="color: #c2410c;">**onAppear**</span>
`onAppear { }` is a modifier that lets you run code when that View appears.
If you want the code on that tab to run again, just tap on another tab, and tap back!
The code that runs is from the <span style="color: #1d4ed8;">SwiftCode</span> file.
If you’re used to other languages like C or Python, you may notice we didn’t need to import the file! All files in an Xcode project are included by default.
Do note that the curly braces of `onAppear { }` are special — they’re one of the only places in a SwiftUI view where you can type the “Swift language” code we did! More on this next unit.
## <span style="color: #c2410c;">Xcode project structure</span>
In an Xcode project, you get a folder with the name you provided. Inside this folder is (confusingly) another folder with the same name, as well as an **xcodeproj** file.
“Inner” <span style="color: #1d4ed8;">SwiftLanguage1</span> folder: This folder contains all our Swift files and, eventually, other assets. Do not rename or delete!
<span style="color: #1d4ed8;">SwiftLanguage1</span>.xcodeproj: This file is the “glue” that holds the project together, and knows where each source file is. *Do not rename or delete!*
Very important: When backing up your project, save the entire “outer” folder!
---
![image](/assets/track_sap/unit_02/image-016.png)
---

# <span style="color: #c2410c;">Unit 2.7-Practice Problems</span>
Practice programming problems in Swift. Write these solutions in the respective functions in the **SwiftCode** file.
## <span style="color: #c2410c;">How this works</span>
There are 5 problems in this assignment, and 5 functions in <span style="color: #1d4ed8;">SwiftCode</span>.
Write the code for each answer into each function.
To test it out, open the <span style="color: #1d4ed8;">Debug</span> panel on Xcode (<span style="color: #1d4ed8;">⌘-⇧-Y</span>), then switch to that tab.
Your result should show up in the <span style="color: #1d4ed8;">Console</span>, on the bottom right.
## <span style="color: #b91c1c;">**Problem 1**</span>
Write a simple sum explainer. Your code should start off looking like this, with 2 numbers people can change:
---
![image](/assets/track_sap/unit_02/image-017.png)
---
And it should output this in the Debug Area, reflecting the numbers typed in:
---
![image](/assets/track_sap/unit_02/image-018.png)
---
*Bonus: Can you make sure that your code works, even if someone enters mixed Doubles and Ints?*
## <span style="color: #b91c1c;">Problem 2</span>
Set up four variables that describe the L-shape shown to the right:
Can you write a program to print out the resultant area?
---
![image](/assets/track_sap/unit_02/image-019.png)

---
![image](/assets/track_sap/unit_02/image-020.png)
---
## <span style="color: #b91c1c;">Problem 3</span>
- With a variable called <span style="color: #a16207;">input</span> that’s a multi-digit integer, find the last digit.
- For example, if <span style="color: #a16207;">input</span> is 1005, your code should print out “The last digit is 5”.
- If <span style="color: #a16207;">input</span> is 990202420, your code should print out “The last digit is 0”.
## <span style="color: #b91c1c;">Problem 4</span>
- `x` years from now, Alice will be `y `times older than her brother, Bobo.
- Set up a program that calculates how old Alice is, if we define 3 things: `x, y, and boboAge`.
- *E.g. if Bobo is 12 years old now, x is 3, and y is 2, then Alice is 27 years old now.*
## <span style="color: #b91c1c;">Problem 5 </span>
- Make a function, `calculateBMI(weight: Double, height: Double)`
- Arguments: Two variables, `weight` (in kg) and `height` (in m).
- Prints out: Your BMI.
- Edit your function, `calculateBMI(weight, height)`
- If you give it a BMI in the healthy range (18.5 to 24.9, according to the World Health Organisation), your code prints `Healthy`
- If below, prints `Underweight`
- If above, prints `Overweight`

---

# <span style="color: #c2410c;">Unit 2.8-Playgrounds Puzzles</span>
Puzzles! A fun way to learn more Swift.
## <span style="color: #c2410c;">Learn To / Get Started with Code</span>
- Swift Playgrounds offers a series of light-hearted introductory coding lessons and exercises.
- Features lovable (maybe?) characters who respond to code commands, like `moveForward()` and `collectGem()`
- **Get Started with Code** is a quick introduction. Try this first; more on next slide.
- **Learn To Code 1 &amp; 2** are longer and go into more detail. Try these if you have time!
## <span style="color: #c2410c;">Get Started with Code</span>
- Get it from the **More Playgrounds **section — click on **Add**, then open it and follow the instructions.
- Topics covered more or less overlap with this unit:
- Commands, For Loops, Conditionals, Logical Operators, Variables, Types, Initialisation, Functions, Parameters
- We’ll cover for loops and types in more detail in a later unit, but they’re quite easy in the Playground!
---
![image](/assets/track_sap/unit_02/image-021.png)
---
## <span style="color: #c2410c;">What haven’t we covered?</span>
- From the basics:
- **Loops**. We haven’t done *for* or *while *loops yet, though you may encounter for-loops in the Playgrounds puzzles.
- **Arrays**. Data in sequence, which usually shows up with loops.
- Intermediate Swift: Enumerations, dictionaries, closures, optionals, tuples, and many more.
- Some of these will be covered in future Swift units, some we’ll mention when we see them in SwiftUI.