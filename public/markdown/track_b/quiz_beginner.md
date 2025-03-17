# 4.1 Simple Quiz App

---

## Let's get started!

- Make a new SwiftUI project and call it `Quiz App`
- Remove the Image in the ContentView

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack{
            Text("Hello, World!")
        }
    }
}
```

---

## Let's mock up the quiz app UI

- Change `Hello, World!` to any question you like.
- Let's also center the text by adding `.multilineTextAlignment(.center)` to the `Text` view.

```swift

struct ContentView: View {
    var body: some View {
        VStack{
            Text("What is Taylor Swift's 2020s concert series called?")
                .multilineTextAlignment(.center)
        }
    }
}
```

---

## Let's add some buttons

- Create a 2 button layout using `HStack` and `Button` views.

```swift
struct ContentView: View {
    var body: some View {
        VStack{
            Text("What is Taylor Swift's 2020s concert series called?")\
                .multilineTextAlignment(.center)

            HStack{
                Button("The Eras Tour"){

                }
                .buttonStyle(.borderedProminent)

                Button("The (Syntax) Erros Tour"){

                }
                .buttonStyle(.borderedProminent)
            }

        }
    }
}
```

---

## Add 2 more buttons below

- Add 2 more buttons below the first 2 buttons.

```swift
struct ContentView: View {
    var body: some View {
        VStack{
            Text("What is Taylor Swift's 2020s concert series called?")
                .multilineTextAlignment(.center)

            HStack{
                Button("The Eras Tour"){

                }
                .buttonStyle(.borderedProminent)

                Button("The (Syntax) Erros Tour"){

                }
                .buttonStyle(.borderedProminent)
            }

            HStack{
                Button("The Aromas Tour"){

                }
                .buttonStyle(.borderedProminent)

                Button("The Areas Tour"){

                }
                .buttonStyle(.borderedProminent)
            }

        }
    }
}
```

---

## Correct Or Wrong?

- Add a `Text` view below the buttons to show if the user got the answer correct or wrong.
- Add a `@State` variable to keep track of the user's answer.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""

    var body: some View {
        VStack{
            Text("What is Taylor Swift's 2020s concert series called?")
                .multilineTextAlignment(.center)

            HStack{
                Button("The Eras Tour"){

                }
                .buttonStyle(.borderedProminent)

                Button("The (Syntax) Erros Tour"){

                }
                .buttonStyle(.borderedProminent)
            }

            HStack{
                Button("The Aromas Tour"){

                }
                .buttonStyle(.borderedProminent)

                Button("The Areas Tour"){

                }
                .buttonStyle(.borderedProminent)
            }

            Text(correctOrWrong)
        }
    }
}
```

---

## Check the answer

- Add a function to check the answer and update the `correctOrWrong` variable.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""

    var body: some View {
        VStack{
            Text("What is Taylor Swift's 2020s concert series called?")
                .multilineTextAlignment(.center)

            HStack{
                Button("The Eras Tour"){
                    correctOrWrong = "You are correct!"
                }
                .buttonStyle(.borderedProminent)

                Button("The (Syntax) Erros Tour"){
                    correctOrWrong = "You are wrong!"
                }
                .buttonStyle(.borderedProminent)
            }

            HStack{
                Button("The Aromas Tour"){
                    correctOrWrong = "You are wrong!"
                }
                .buttonStyle(.borderedProminent)

                Button("The Areas Tour"){
                    correctOrWrong = "You are wrong!"
                }
                .buttonStyle(.borderedProminent)
            }

            Text(correctOrWrong)
        }
    }
}
```

---

## Comments

- Let's add some comments to our code to make it easier to understand.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""

    var body: some View {
        VStack{
            // Question
            Text("What is Taylor Swift's 2020s concert series called?")
                .multilineTextAlignment(.center)

            // Options
            HStack{
                Button("The Eras Tour"){
                    correctOrWrong = "You are correct!"
                }
                .buttonStyle(.borderedProminent)

                Button("The (Syntax) Erros Tour"){
                    correctOrWrong = "You are wrong!"
                }
                .buttonStyle(.borderedProminent)
            }
            HStack{
                Button("The Aromas Tour"){
                    correctOrWrong = "You are wrong!"
                }
                .buttonStyle(.borderedProminent)

                Button("The Areas Tour"){
                    correctOrWrong = "You are wrong!"
                }
                .buttonStyle(.borderedProminent)
            }


            // Feedback on whether the answer is correct
            Text(correctOrWrong)
        }
    }
}
```

---

# 4.2 Simple Quiz App but with better code

---

## Similar Buttons

- The buttons are similar, so we can create a function to create the buttons.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""

    func option(title: String, isCorrect:Bool) -> some View{
        Button(title){
            if isCorrect{
                correctOrWrong = "You are correct!"
            }else{
                correctOrWrong = "You are wrong!"
            }
        }
        .buttonStyle(.borderedProminent)
    }

    var body: some View {
        ...
    }
}
```

---

## Using the function

- Use the `option` function to create the buttons.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""

    func option(title: String, isCorrect:Bool) -> some View{
        Button(title){
            if isCorrect{
                correctOrWrong = "You are correct!"
            }else{
                correctOrWrong = "You are wrong!"
            }
        }
        .buttonStyle(.borderedProminent)
    }

    var body: some View {
        VStack{

            // Question
            Text("What is Taylor Swift's 2020s concert series called?")
                .multilineTextAlignment(.center)

            // Options
            HStack{
                option(title: "The Eras Tour", isCorrect: true)
                option(title: "The (Syntax) Erros Tour", isCorrect: false)
            }
            HStack{
                option(title: "The Aromas Tour", isCorrect: false)
                option(title: "The Areas Tour", isCorrect: false)
            }

            // Feedback on whether the answer is correct
            Text(correctOrWrong)
        }
    }
}
```

---

# 4.3 Simple Quiz App with multiple questions

---

## Let's create questionNumber variable

- Create a `questionNumber` variable to keep track of the current question.
- In programming, we start counting from 0.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""
    @State private var questionNumber = 0

    func option(title: String, isCorrect:Bool) -> some View{
       ...
    }

    var body: some View {
        ...
    }
}
```

---

## Show different questions

- Use an if statement to show different questions based on the `questionNumber`.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""
    @State private var questionNumber = 0

    func option(title: String, isCorrect:Bool) -> some View{
        ...
    }

    var body: some View {
        VStack{
            if questionNumber == 0{
                // Question 1
                Text("What is Taylor Swift's 2020s concert series called?")
                    .multilineTextAlignment(.center)

                // Options
                HStack{
                    option(title: "The Eras Tour", isCorrect: true)
                    option(title: "The (Syntax) Erros Tour", isCorrect: false)
                }
                HStack{
                    option(title: "The Aromas Tour", isCorrect: false)
                    option(title: "The Areas Tour", isCorrect: false)
                }
            }

            // Feedback on whether the answer is correct
            Text(correctOrWrong)
        }
    }
}
```

---

## Next Question Button

- Add a `Button` view to go to the next question.
- First we must have a variable to keep track if the question is answered.
- Second we change its value when the user answers the question.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""
    @State private var questionNumber = 0
    @State private var showNextButton = false

    func option(title: String, isCorrect:Bool) -> some View{
        Button(title){
            if isCorrect{
                correctOrWrong = "You are correct!"
            }else{
                correctOrWrong = "You are wrong!"
            }
            showNextButton = true
        }
    }

    var body: some View {
        ...
    }
}
```

---

## Next Question Button

- Thirdly, we show the button is showNextButton is true.
- We style this button to make it look different from the other buttons.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""
    @State private var questionNumber = 0
    @State private var showNextButton = false

    func option(title: String, isCorrect:Bool) -> some View{
        ...
    }

    var body: some View {
        VStack{
            if questionNumber == 0{
                ...
            }

            // Feedback on whether the answer is correct
            Text(correctOrWrong)

            // Next Question Button
            if showNextButton{
                Button("Next Question"){

                }
                .buttonStyle(.bordered)
                .tint(.blue)
            }
        }
    }
}
```

---

# 4.4 Go to the next question and reset the answer

---

## Going to the next question

- Add 1 to the `questionNumber` variable to go to the next question.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""
    @State private var questionNumber = 0
    @State private var showNextButton = false

    func option(title: String, isCorrect:Bool) -> some View{
        ...
    }

    var body: some View {
        VStack{
            if questionNumber == 0{
                ...
            }

            // Feedback on whether the answer is correct
            Text(correctOrWrong)

            // Next Question Button
            if showNextButton{
                Button("Next Question"){
                    questionNumber = questionNumber + 1
                }
                .buttonStyle(.bordered)
                .tint(.blue)
            }
        }
    }
}
```

---

## Going to the next question

- Show the next question based on the `questionNumber`.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""
    @State private var questionNumber = 0
    @State private var showNextButton = false

    func option(title: String, isCorrect:Bool) -> some View{
        ...
    }

    var body: some View {
        VStack{
            if questionNumber == 0{
                ...
            }
            else if questionNumber == 1{
                // Question 2
                Text("Who wrote Gulliver's Travels?")
                    .multilineTextAlignment(.center)

                // Options
                HStack{
                    option(title: "Tim Swift", isCorrect: false)
                    option(title: "Jonathan Swift", isCorrect: true)
                }
                HStack{
                    option(title: "Joe Swift", isCorrect: false)
                    option(title: "Taylor Swift", isCorrect: false)
                }
            }

            // Feedback on whether the answer is correct
            Text(correctOrWrong)

            // Next Question Button
            if showNextButton{
                Button("Next Question"){
                    questionNumber = questionNumber + 1
                }
                .buttonStyle(.bordered)
                .tint(.blue)
            }
        }
    }
}
```

---

## Hide the Next Question Button

- Now that we are able to show the next question, we should hide the next question button after the user answers the question.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""
    @State private var questionNumber = 0
    @State private var showNextButton = false

    func option(title: String, isCorrect:Bool) -> some View{
        ...
    }

    var body: some View {
        VStack{
            if questionNumber == 0{
                ...
            }
            else if questionNumber == 1{
                ...
            }

            // Feedback on whether the answer is correct
            Text(correctOrWrong)

            // Next Question Button
            if showNextButton{
                Button("Next Question"){
                    questionNumber = questionNumber + 1
                    showNextButton = false
                    correctOrWrong = ""
                }
                .buttonStyle(.bordered)
                .tint(.blue)
            }
        }
    }
}
```

---

## End the quiz if there are no more questions

- Add an `else` statement to show the end of the quiz.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""
    @State private var questionNumber = 0
    @State private var showNextButton = false

    func option(title: String, isCorrect:Bool) -> some View{
        ...
    }

    var body: some View {
        VStack{
            if questionNumber == 0{
                ...
            }
            else if questionNumber == 1{
                ...
            }
            else{
                Text("The quiz is over.")
            }

            // Feedback on whether the answer is correct
            Text(correctOrWrong)

            // Next Question Button
            if showNextButton{
                Button("Next Question"){
                    questionNumber = questionNumber + 1
                    showNextButton = false
                    correctOrWrong = ""
                }
                .buttonStyle(.bordered)
                .tint(.blue)
            }
        }
    }
}
```

---

## Now let's imagine we have 10 questions

- If we have 10 questions, we will have to write a lot of code to show all the questions.
- Thus we should create a function to show the question and options.
- Copy and paste the code for the first question into a VStack in the function and we will modify it in the next step.

```swift
struct ContentView: View {
    ...

    func question(question: String, option1: String, option2: String, option3: String, option4: String, correctOption: Int) -> some View{
        VStack{
            // Question
            Text("What is Taylor Swift's 2020s concert series called?")
                .multilineTextAlignment(.center)

            // Options
            HStack{
                option(title: "The Eras Tour", isCorrect: true)
                option(title: "The (Syntax) Erros Tour", isCorrect: false)
            }
            HStack{
                option(title: "The Aromas Tour", isCorrect: false)
                option(title: "The Areas Tour", isCorrect: false)
            }
        }
    }

    var body: some View {
        ...
    }
}
```

---

## Making the question and options dynamic

- Make the question and options dynamic by using the function.

```swift
...
func question(question: String, option1: String, option2: String, option3: String, option4: String, correctOption: Int) -> some View{
    VStack{
        // Question
        Text(question)
            .multilineTextAlignment(.center)

        // Options
        HStack{
            option(title: option1, isCorrect: correctOption == 1)
            option(title: option2, isCorrect: correctOption == 2)
        }
        HStack{
            option(title: option3, isCorrect: correctOption == 3)
            option(title: option4, isCorrect: correctOption == 4)
        }
    }
}
```

---

## Using the function

- Use the `question` function to show the questions.

```swift
struct ContentView: View {

    ...

    func question(question: String, option1: String, option2: String, option3: String, option4: String, correctOption: Int) -> some View{
        ...
    }

    var body: some View {
        VStack{
            if questionNumber == 0{
                question(question: "What is Taylor Swift's 2020s concert series called?", option1: "The Eras Tour", option2: "The (Syntax) Erros Tour", option3: "The Aromas Tour", option4: "The Areas Tour", correctOption: 1)
            }
            else if questionNumber == 1{
                question(question: "Who wrote Gulliver's Travels?", option1: "Tim Swift", option2: "Jonathan Swift", option3: "Joe Swift", option4: "Taylor Swift", correctOption: 2)
            }
            else{
                Text("The quiz is over.")
            }

            // Feedback on whether the answer is correct
            Text(correctOrWrong)

            // Next Question Button
            if showNextButton{
                Button("Next Question"){
                    questionNumber = questionNumber + 1
                    showNextButton = false
                    correctOrWrong = ""
                }
                .buttonStyle(.bordered)
                .tint(.blue)
            }
        }
    }
}
```

---

# 4.5 Using switch-case and withAnimation

---

## Using switch-case

- We can use a `switch-case` statement to show different questions.
- This makes the code cleaner and easier to read.

```swift
struct ContentView: View {

    ...

    var body: some View {
        VStack{
            switch questionNumber{
            case 0:
                question(question: "What is Taylor Swift's 2020s concert series called?", option1: "The Eras Tour", option2: "The (Syntax) Erros Tour", option3: "The Aromas Tour", option4: "The Areas Tour", correctOption: 1)
            case 1:
                question(question: "Who wrote Gulliver's Travels?", option1: "Tim Swift", option2: "Jonathan Swift", option3: "Joe Swift", option4: "Taylor Swift", correctOption: 2)
            default:
                Text("The quiz is over.")
            }

            // Feedback on whether the answer is correct
            Text(correctOrWrong)

            // Next Question Button
            if showNextButton{
                Button("Next Question"){
                    questionNumber = questionNumber + 1
                    showNextButton = false
                    correctOrWrong = ""
                }
                .buttonStyle(.bordered)
                .tint(.blue)
            }
        }
    }
}
```

---

## Using switch-case

- We can add more cases to show more questions.

```swift
struct ContentView: View {
    ...
    var body: some View {
        VStack{
            switch questionNumber{
            case 0:
                question(
                    question: "What is Taylor Swift's 2020s concert series called?",
                    option1: "The Eras Tour",
                    option2: "The (Syntax) Erros Tour",
                    option3: "The Aromas Tour",
                    option4: "The Areas Tour",
                    correctOption: 1
                )
            case 1:
                question(
                    question: "Who wrote Gulliver's Travels?",
                    option1: "Tim Swift",
                    option2: "Jonathan Swift",
                    option3: "Joe Swift",
                    option4: "Taylor Swift",
                    correctOption: 2
                    )
            case 2:
                question(
                    question: "Who makes the Swift car?",
                    option1: "Nissan",
                    option2: "BMW",
                    option3: "Suzuki",
                    option4: "Apple",
                    correctOption: 3
                )
            default:
                Text("The quiz is over.")
            }

           ...
        }
    }
}
```

---

## Using withAnimation

- We can use `withAnimation` to animate the transition between questions.
- Add in `withAnimation` in the `option` function.

```swift
struct ContentView: View {

    func option(title: String, isCorrect:Bool) -> some View{
        Button(title){
            withAnimation{
                if isCorrect{
                    correctOrWrong = "You are correct!"
                }else{
                    correctOrWrong = "You are wrong!"
                }
                showNextButton = true
            }
        }
    }

    func question(question: String, option1: String, option2: String, option3: String, option4: String, correctOption: Int) -> some View{
        ...
    }

    var body: some View {
        ...
    }
}
```

---

## Using withAnimation

- Add in `withAnimation` in the `Next Question` button.

```swift
struct ContentView: View {
    ...
    var body: some View {
        VStack{
            switch questionNumber{
            ...
            }

            // Feedback on whether the answer is correct
            Text(correctOrWrong)

            // Next Question Button
            if showNextButton{
                Button("Next Question"){
                    withAnimation{
                        questionNumber = questionNumber + 1
                        showNextButton = false
                        correctOrWrong = ""
                    }
                }
                .buttonStyle(.bordered)
                .tint(.blue)
            }
        }
    }
}
```

---

# 4.6 Adding in a score

---

## Creating a `@State` variable for the score

- Create a `@State` variable to keep track of the user's score.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""
    @State private var questionNumber = 0
    @State private var showNextButton = false
    @State private var score = 0

    ...
}
```

---

## Updating the score

- Update the score when the user answers the question correctly.

```swift
struct ContentView: View {
    @State private var correctOrWrong = ""
    @State private var questionNumber = 0
    @State private var showNextButton = false
    @State private var score = 0

    func option(title: String, isCorrect:Bool) -> some View{
        Button(title){
            withAnimation{
                if isCorrect{
                    correctOrWrong = "You are correct!"
                    score += 1
                }else{
                    correctOrWrong = "You are wrong!"
                }
                showNextButton = true
            }
        }
        .buttonStyle(.borderedProminent)
    }

    ...
}
```

---

## Showing the score

- Show the score at the end of the quiz.

```swift
struct ContentView: View {
    ...
    var body: some View {
        VStack{
            ...
            if showNextButton{
                ...
            }

            Text("Your score is \(score)")
        }
    }
}
```

---

## Conditionally showing the score

- Only show the score if the quiz is over.
- Change the `default` case to show the score.

```swift
struct ContentView: View {
    ...
    var body: some View {
        VStack{
            ...
            switch questionNumber{
            ...
            default:
                Text("The quiz is over.")
                Text("Your score is \(score)")
            }

            ...
        }
    }
}
```

---

## Giving feedback

- Show thumbs up if they got more than 1 question correct.
- Let's make it big and colour it with an gradient.

```swift
struct ContentView: View {
    ...
    var body: some View {
        VStack{
            ...
            switch questionNumber{
            ...
            default:
                Text("The quiz is over.")
                Text("Your score is \(score)")
                if score > 1{
                    Image(systemName: "hand.thumbsup.fill")
                        .font(.system(size: 100))
                        .foregroundStyle(LinearGradient(colors: [.red, .green, .blue], startPoint: .top, endPoint: .bottomLeading))
                }
            }

            ...
        }
    }
}
```

---

## Giving feedback

- Show 🗑️ if they got 0 questions correct.

```swift
struct ContentView: View {
    ...
    var body: some View {
        VStack{
            ...
            switch questionNumber{
            ...
            default:
                Text("The quiz is over.")
                Text("Your score is \(score)")
                if score > 1{
                    Image(systemName: "hand.thumbsup.fill")
                        .font(.system(size: 100))
                        .foregroundStyle(LinearGradient(colors: [.red, .green, .blue], startPoint: .top, endPoint: .bottomLeading))
                }else if score == 0{
                    Image(systemName: "trash.fill")
                        .font(.system(size: 100))
                }
            }

            ...
        }
    }
}
```

---

## Disabling the buttons

- We dont want the user to be able to answer the question after they have answered it.
- We can disable the buttons using the `disabled` modifier.

```swift
struct ContentView: View {
    ...
    func option(title: String, isCorrect:Bool) -> some View{
        Button(title){
            withAnimation{
                if isCorrect{
                    correctOrWrong = "You are correct!"
                    score += 1
                }else{
                    correctOrWrong = "You are wrong!"
                }
                showNextButton = true
            }
        }
        .buttonStyle(.borderedProminent)
        .disabled(showNextButton)
    }

    ...
}
```

---

# Congratulations

You have made a simple quiz app with multiple questions and a score system!
