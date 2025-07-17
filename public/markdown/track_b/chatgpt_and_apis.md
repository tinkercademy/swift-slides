# Challenge

Create an app that will interface with ChatGPT!

---

<iframe
    src="https://dropover.cloud/fa1c20#b5dcba5d-8a82-4186-aebe-098d67e1b0c9"
    style="width: 100%; height: 950px ;"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
</iframe>

Thanks to a team from Raffles Institution for this mildly questionable demo app. Video at https://dropover.cloud/fa1c20

---

# APIs and Networking

Working with other people's servers

---

## What's an API?

- APIs are interfaces that let your code talk to other code
- You've seen them before!
  - SwiftUI is an API by Apple
  - When you do a Google search, https://www.google.com/search?hl=en&q=swift is making an API call to Google's servers
  - In that video you just saw, Tom used the YouTube API to update his numbers

---

## Why APIs?

- Imagine you have an app, and want to let developers or other companies use your data.
- First, why would you want to do that? Some examples:
  - Twitter used to open up their API for developers to make clients
  - Google Maps, FourSquare, and more let developers pay for API access to access their map data
- How would you do it? You don't let people into your codebase — you give access through an API
  - This way, no services can directly “reach in” to your data

---

## Searching

This is a HTTP GET request, made by your browser to google.com.

<img src="/markdown/track_b/assets/assets/searching_http_get.png">

This is an API call! In this case, we're making a public API call, using our browser, and it's return a result formatted as a webpage

---

## Computer-Readable Results

<div style="display: flex;">
    <ul>
        <li>Results usually come back in JSON or (rarely) XML</li>
        <ul>
            <li>JavaScript Object Notation</li>
            <li>eXtensible Markup Language</li>
        </ul>
        <li>Imagine going to Reddit, <code>r/cats…</code></li>
        <ul>
            <li>Humans: Aww! So many cats! So cute! 😻</li>
            <li>Computers: Who cares about pictures! Gimme data about cats. 😾</li>
        </ul>
    </ul>
    <img src="/markdown/track_b/assets/assets/cats.png">
</div>

---

## Computer-readable data: JSON

<div style="display: flex;">
    <div style="width:60%">
        <ul>
            <li>Computers: Let's just go to r/cats.json instead</li>
        </ul>
        <img src="/markdown/track_b/assets/assets/cats_json.png">
        <ul>
            <li>Computers: Purrrfect!</li>
        </ul>
    </div>
    <div style="flex:1;">
        <ul>
            <li>Humans: Use Firefox to see formatted JSON</li>
        </ul>
        <img src="/markdown/track_b/assets/assets/cats_json_firefox.png">
    </div>
</div>

---

## Some APIs require keys

- Imagine if you set up an API.
- What if someone comes along and tries to request all kinds of data you aren't ready to give up, e.g. your entire database?
- In such cases, the API provider may restrict access using an API key, to drive out bad actors.
- Users may need to register for **API keys** to access the data, which may require payment.

---

## Concurrency & Networking

- When making an API request, it takes a while to load the data. We should not let our entire app freeze just to wait for a response back from an API!
- Therefore, we run API requests on _background threads_.
- When the data is retrieved, we get our app to send this data over to the main thread, to update the user interface.
- Importantly, you can only update your user interface from the main thread.

---

# ChatGPT and its API

Introduction to ChatGPT, OpenAI, and the GPT API

---

## Try out ChatGPT, if you haven't already!

<img src="/markdown/track_b/assets/assets/chagpt_intro.png" style="height:800px">

---

## ChatGPT and OpenAI

- ChatGPT is the front-end to GPT-3.5 / GPT-4, a **large language model** (LLM) developed by OpenAI
- Think of a LLM as a sentence generator, trained on billions of webpages of data, that's great at interpreting user input (called **prompts**) and answering questions.
- ChatGPT has limitations — it sometimes gives wrong answers (called **hallucination**), and comes with a “knowledge cutoff” at September 2021 (for version 3.5/4).
- OpenAI offers various other services in the form of APIs, including DALL•E, an image generator

---

## API Key Required

- OpenAI does not offer free public API access to its APIs. You need to sign up for an account, and add a payment method, to get a developer key.
  - Each API call is charged, though it's not expensive — GPT-3.5, for instance, cost us less than 5 cents (USD) for two weeks of testing for this unit.
  - At time of writing, you might be able to sign up and get some free credits to test, without a payment method.
- For this class, your instructor will aim to provide you an API key to use. Please do not share or abuse this key!
  - Your instructor will probably also _revoke_ the key after class.
  - The key looks like `sk-somethingabc123somethingelse0xyz`.

---

## How we'll use ChatGPT

- We'll use a Swift Package to interface with the ChatGPT library. This helps abstract some of the work to be done (e.g. creating models, working with JSON decoders).
- There are various — we'll use this: [OpenAISwift](https://github.com/adamrushy/OpenAISwift)
- Open up the website, and it'll give you information about how to use it.

---

## Adding a Package

<div style="display:flex">
    <img src="/markdown/track_b/assets/assets/package_adding.png" style="height: 500px;">
    <div>
    
- Open the sidebar <img style="margin-bottom: -4px" height="35px" src="/assets/icons/sidebar.left.svg">, tap on the new document button <img style="margin-bottom: -4px" src="/assets/icons/doc.badge.plus.svg" alt="New Document Icon" width="35px">
- Then Choose Swift Package
- Paste in the URL: https://github.com/adamrushy/OpenAISwift and press Enter
- Add to App Playground
    
    </div>
</div>

---

# Creating our Chat UI

We're not doing full-fledged chat — more like one question, one answer.

---

## Try to create this UI!

<div style="display:flex">
    <img src="/markdown/track_b/assets/assets/searching_stack_chatgpt.png" style="height: 500px; ">
    <div>
    
- `TextField`, linked to a state variable, `inputText`
- `Button`, that runs a function called `sendRequest()`
- `Text`, linked to a state variable, `outputText`

    </div>

</div>

---

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[]
struct ContentView: View {

    @State private var inputText = ""
    @State private var outputText = ""

    var body: some View {
        VStack {
            TextField("Hi! Ask me anything.", text: $inputText)
                .textFieldStyle(.roundedBorder)
                .padding()

            Button("Send to ChatGPT") {
                sendRequest()
            }
            .buttonStyle(.borderedProminent)

            Text(outputText)
        }
    }

    func sendRequest() {
        print("Testing!")
    }

}
```

---

# Using the OpenAI API

Time to send our prompts!

---

## Import and set up the library

Get the token from your teacher, or sign up for your own OpenAI account at platform.openai.com.

```swift
import SwiftUI
import OpenAISwift

struct ContentView: View {

    @State private var inputText = ""
    @State private var outputText = ""
    let openAI = OpenAISwift(authToken: "sk-asdfghjklsahdjgsfhjkagfhjkagshljagf"
...
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---

## Setting up the AI

- We have to create an array of ChatMessage to send to the API
- Then, we need to let the AI know what it should act as!
  - You could try a different prompt!

```swift
func sendRequest() {
    let chat: [ChatMessage] = [ChatMessage(role: .system, content: "You are a helpful
                               assistant who answers questions for the user.")]
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---

## Creating a Message

Add another ChatMessage, but this time as the role of a user (you!) so the AI knows it needs to respond to this message.

```swift
func sendRequest() {
    let chat: [ChatMessage] = [ChatMessage(role: .system, content: "You are a helpful
                               assistant who answers questions for the user.")],
                               ChatMessage(role: .user, content: inputText)
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---

## Making an API Request

- To send a message to ChatGPT, we need to make an _API Request_
- Since API Requests run on _background threads_, we have to wait for the request to succeed
- Requests that are run on background threads are referred to as _Asynchronous Tasks_
- In Swift, we can use a `Task` to allow code to run on background threads
- Since we need to wait for a response from the Asynchronous Task, we have to mark them with the `await` keyword

---

## Creating a Task

```
func sendRequest() {

    let chat: [ChatMessage] = [
        ChatMessage(role: .system, content: "You are a helpful assistant who answers
                                             questions for the user."),
        ChatMessage(role: .user, content: inputText)
    ]

    Task {
        // Our Asynchronous Code goes inside here
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---

## Making the API Request

To send an API Request, we can use a built in function from the OpenAISwift package

```swift
func sendRequest() {

    let chat: [ChatMessage] = [
        ChatMessage(role: .system, content: "You are a helpful assistant who answers
                                             questions for the user."),
        ChatMessage(role: .user, content: inputText)
    ]

    Task {
        // The Temperature parameter controls how creative ChatGPT is with it's response. Play around with this value!
        let result = await openAI.sendChat(with: chat, temperature: 0.8)
    }

}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---

## Not marked with try?!

- WAAAIT! There's an error!
- When we send an API Request, there is a chance that it could fail.
  - For example, the user does not have internet access.
  - In that case, the request will return nil
  - In case it returns nil, we have to deal with it
  - To do this, we can use do and catch statements

<img src="/markdown/track_b/assets/assets/try_await_error.png">

---

## Do-Catch and Try

- Using a Do-Catch Statement, we can handle errors that occur. This is called _Error Handling_
- The syntax looks something like this:

```swift
do {
    try <do something>
} catch {
    // Do something if it errors
}
```

- When there is a particular statement that may fail, we mark it with the `try` keyword
  - This tells Swift that… ‘Hey! Try executing this line of code. If it fails, its fine! Run the code in the catch section'

---

## Handling Errors

```swift
func sendRequest() {

    let chat: [ChatMessage] = [
        ChatMessage(role: .system, content: "You are a helpful assistant who answers
                                             questions for the user."),
        ChatMessage(role: .user, content: inputText)
    ]

    Task {
        do {
            // remember to use try here
            let result = try await openAI.sendChat(with: chat, temperature: 0.8)
        } catch {
                          print("Oh no! The API Request did not succeed")
        }
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---

## Updating the UI

- Remember that code in the `Task` statement is Asynchronous? We cannot update the User Interface from a _Background Thread!_
- To run it on the _Main Thread_, we can use `MainActor.run`, and since it's asynchronous as well, we have to mark it with `await`

```swift
Task {
    do {
        let result = try await openAI.sendChat(with: chat, temperature: 0.8)

        await MainActor.run {

        }
    } catch {
        print("Oh no! The API Request did not succeed")
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---

## Updating the User Interface

- Now, let's set the outputText @State variable with the response from ChatGPT

```swift
Task {
    do {
        let result = try await openAI.sendChat(with: chat, temperature: 0.8)

        await MainActor.run {
            //Remember Nil Coalescing? If outputText is nil, we set the value to ‘No result'
            outputText = result.choices?.first?.message.content ?? "No result"
        }
    } catch {
        print("Oh no! The API Request did not succeed")
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---

## Done!

- What you've learned:
  - What an API is
  - How to use an API
  - Working with the ChatGPT API using a Swift package
  - Basic AI
- Some things to note
  - There are various other ways to access the ChatGPT API
  - There are various other OpenAI / generative APIs too
  - Don't share your OpenAI key! It gives anyone access to the paid OpenAI service.
