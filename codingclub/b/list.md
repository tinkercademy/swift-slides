<div style="text-align: left">
    <img src="/assets/tinkercademy.png" alt="Tinkercademy Logo" height="128px">
    <img src="https://raw.githubusercontent.com/swiftinsg/branding/main/logos/icons/png/coloured%20-%20dark%20background.png" alt="Swiftinsg Logo" height="128px" style="margin-left: 64px;">
</div>

## Track B: Unit 5
List App

---

# Lesson 1 : NavigationStack / NavigationLink

---vertical---

## List App

- We're making a List app
- Many examples of List apps out there! Messaging, social media, classifieds.
- Some Apple related examples is the Mail app, Messages app, and the Settings app.

<!--TODO: ADD Settings App-->

---vertical---

## What is Navigation?

- In About Me, we saw Tab Bars. They're used to show different aspects of an app. 
	- Navigation Views let us drill deeper into data
	- Modal sheets interrupt the flow for task completion
	- The points above can be seen in the Mail App

---vertical---

# Navigation Demo

<!-- Eventually turn this into a video section-->

---vertical---

## Lets get started!

- Make a new SwiftUI project and call it `ListApp`
- Change the `VStack` in `ContentView` to a `NavigationStack`

```swift
struct ContentView: View {
    var body: some View {
        NavigationStack{
            Text("Hello, world!")
        }
    }
}
```

---vertical---

## NavigationLink

- `NavigationLink` is a button that triggers a navigation to another view

```swift
NavigationLink {
    Text("This is a hearty concoction great for cold winter nights.")
} label: {
    Text("Hot Chocolate Soup")
}
```

---vertical---

## NavigationLink

- Add a `NavigationLink` to the `NavigationStack` in `ContentView`

```swift[5-16]
struct ContentView: View {  
    var body: some View {
        NavigationStack {

            NavigationLink {
                Text("This is a hearty concoction great for cold winter nights.")
            } label: {
                Text("Hot Chocolate Soup")
            }
            
            NavigationLink {
                Text("How can this be hot and cold at the same time??? It's incredible.")
            } label: {
                Text("Hot Chocolate Ice Cream")
            }
        
        }
    }
}
```

---vertical---

## Adding a Spacer()

- We see that the `NavigationLink` is at the top of the screen
- We can add a `Spacer()` to push it to the bottom

```swift[4]
struct ContentView: View {  
    var body: some View {
        NavigationStack {
            Spacer()
            NavigationLink {
                Text("This is a hearty concoction great for cold winter nights.")
            } label: {
                Text("Hot Chocolate Soup")
            }
            NavigationLink {
                Text("How can this be hot and cold at the same time??? It's incredible.")
            } label: {
                Text("Hot Chocolate Ice Cream")
            }
        }
    }
}
```

---

# Lesson 2 : Sheet

---vertical---

## Credits Screen

- We're going to add a credits screen to our app.
- This screen will show the authors of the app.
- We will tap on a button and it brings up information about the other page.

---vertical---

## Creating a credits button

- Add a `Button` to the `NavigationStack` in `ContentView`

```swift[15-17]
struct ContentView: View {  
    var body: some View {
        NavigationStack {
            Spacer()
            NavigationLink {
                Text("This is a hearty concoction great for cold winter nights.")
            } label: {
                Text("Hot Chocolate Soup")
            }
            NavigationLink {
                Text("How can this be hot and cold at the same time??? It's incredible.")
            } label: {
                Text("Hot Chocolate Ice Cream")
            }
            Button("Show credits") {
                showSheet = true 
            }
        }
    }
}
```

---vertical---

## Adding styling to the button

- Lets add a `Spacer()` and add `.buttonStyle(.borderedProminent)` to the `Button` to make it look better.

```swift[15,19]
struct ContentView: View {  
    var body: some View {
        NavigationStack {
            Spacer()
            NavigationLink {
                Text("This is a hearty concoction great for cold winter nights.")
            } label: {
                Text("Hot Chocolate Soup")
            }
            NavigationLink {
                Text("How can this be hot and cold at the same time??? It's incredible.")
            } label: {
                Text("Hot Chocolate Ice Cream")
            }
            Spacer()
            Button("Show credits") {
                showSheet = true 
            }
            .buttonStyle(.borderedProminent)
        }
    }
}
```

---vertical---

## Using a @State variable

- Add a @State variable to `ContentView` to control the visibility of the sheet

```swift[2]
struct ContentView: View {
    @State private var showSheet = false
    var body: some View {
        NavigationStack {
            Spacer()
            NavigationLink {
                Text("This is a hearty concoction great for cold winter nights.")
            } label: {
                Text("Hot Chocolate Soup")
            }
            NavigationLink {
                Text("How can this be hot and cold at the same time??? It's incredible.")
            } label: {
                Text("Hot Chocolate Ice Cream")
            }
            Spacer()
            Button("Show credits") {
                showSheet = true 
            }
            .buttonStyle(.borderedProminent)
        }
    }
}
```

---vertical---

## Adding a Sheet

- Add a `sheet` modifier to the `Button` in `ContentView`

```swift[21-23]
struct ContentView: View {
    @State private var showSheet = false
    var body: some View {
        NavigationStack {
            Spacer()
            NavigationLink {
                Text("This is a hearty concoction great for cold winter nights.")
            } label: {
                Text("Hot Chocolate Soup")
            }
            NavigationLink {
                Text("How can this be hot and cold at the same time??? It's incredible.")
            } label: {
                Text("Hot Chocolate Ice Cream")
            }
            Spacer()
            Button("Show credits") {
                showSheet = true 
            }
            .buttonStyle(.borderedProminent)
            .sheet(isPresented: $showSheet) {
                CreditsView()
            }
        }
    }
}
```

---vertical---

## Creating the CreditsView

- Create a new SwiftUI file called `CreditsView.swift` and add the type `View`.
- Wait for the popup to appear and press `Enter` to use the default code snippet.
- Change the `MyView` struct to `CreditsView`.

```swift
import SwiftUI

struct CreditsView: View {
    var body: some View {
        Hello, world!
    }
}
#Preview {
    CreditsView()
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> CreditsView.swift</p>


---vertical---

## Adding content to the CreditsView

- Add a `VStack` to the `CreditsView` and add a `Text` view with your name in it.

```swift[3-5]
struct CreditsView: View {
    var body: some View {
        VStack {
            Text("Made by YJ Soon")
        }
    }
}
```

---vertical---

## Making the CreditsView look better

- Lets make the font size bigger 

```swift[5]
struct CreditsView: View {
    var body: some View {
        VStack {
            Text("Made by YJ Soon")
                .font(.largeTitle)
        }
    }
}
```

---vertical---

## Making the CreditsView look even better

- We should also add in a Image on top of the text
- You can use the `Image` view and use the `systemName` parameter to use a system image.
- The list of the system images can be found in your toolbar in Swift Playgrounds. 

```swift[4]
struct CreditsView: View {
    var body: some View {
        VStack {
            Image(systemName: "pencil.circle.fill")
            Text("Made by YJ Soon")
                .font(.largeTitle)
        }
    }
}
```

---vertical---

### Making the CreditsView look even even better

- Make the image bigger by adding `.font(.system(size: 80))` to the `Image` view

```swift[5]
struct CreditsView: View {
    var body: some View {
        VStack {
            Image(systemName: "pencil.circle.fill")
                .font(.system(size: 80))
            Text("Made by YJ Soon")
                .font(.largeTitle)
        }
    }
}
```

---vertical---

### Making the CreditsView look even even even better

- Lets add in a exit button to the `CreditsView` that says "Dismiss" and dismiss the sheet when tapped.
- Use an `@Environment` variable to dismiss the sheet

```swift[2, 10-12]
struct CreditsView: View {
    @Environment(\.dismiss) var dismiss
    var body: some View {
        VStack {
            Image(systemName: "pencil.circle.fill")
                .font(.system(size: 80))
            Text("Made by YJ Soon")
                .font(.largeTitle)

            Button("Dismiss") {
                dismiss()
            }
        }
    }
}
```

---vertical---

### Making the CreditsView look even even even even better

- Our button looks very small and squished. Lets add in some padding to make it look better.
- Lets also add in `.buttonStyle(.borderedProminent)` to make it look even better.


```swift[13-14]
struct CreditsView: View {
    @Environment(\.dismiss) var dismiss
    var body: some View {
        VStack {
            Image(systemName: "pencil.circle.fill")
                .font(.system(size: 80))
            Text("Made by YJ Soon")
                .font(.largeTitle)

            Button("Dismiss") {
                dismiss()
            }
            .buttonStyle(.borderedProminent)
            .padding()
        }
    }
}
```

---vertical---

### Making the CreditsView look the best

- Lets add in a background color to the `CreditsView` to make it look even better
- Add in a `ZStack` and add a `Color` view with the color you want as the background

```swift[4,5]
struct CreditsView: View {
    @Environment(\.dismiss) var dismiss
    var body: some View {
        ZStack {
            Color.yellow
                
            VStack {
                Image(systemName: "pencil.circle.fill")
                    .font(.system(size: 80))
                Text("Made by YJ Soon")
                    .font(.largeTitle)

                Button("Dismiss") {
                    dismiss()
                }
                .buttonStyle(.borderedProminent)
                .padding()
            }
        }
    }
}
```

---

# Lesson 3 : List

---vertical---

## List

- We are going to display a list of items in our app.
- Lets use the `List` view to display a list of items.

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[5]
struct ContentView: View {    
    @State private var showSheet = false
    var body: some View {
        NavigationStack {
            List {
                NavigationLink {
                    Text("This is a hearty concoction great for cold winter nights.")
                } label: {
                    Text("Hot Chocolate Soup")
                }
                NavigationLink {
                    Text("How can this be hot and cold at the same time??? It's incredible.")
                } label: {
                    Text("Hot Chocolate Ice Cream")
                }
            }
        }
    }
}
```

---vertical---

## Adding a title to the List

- Lets add a title to the `List` to let people know what they are looking at.
- Lets also make it larger so people can see it easier.

```swift[17,18]
struct ContentView: View {    
    @State private var showSheet = false
    var body: some View {
        NavigationStack {
            List {
                NavigationLink {
                    Text("This is a hearty concoction great for cold winter nights.")
                } label: {
                    Text("Hot Chocolate Soup")
                }
                NavigationLink {
                    Text("How can this be hot and cold at the same time??? It's incredible.")
                } label: {
                    Text("Hot Chocolate Ice Cream")
                }
            }
            .navigationTitle("Recipes")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}
```

---vertical---

## Adding more items to the List

TODO