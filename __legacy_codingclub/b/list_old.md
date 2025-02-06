<div style="text-align: left">
    <img src="/assets/tinkercademy.png" alt="Tinkercademy Logo" height="128px">
    <img src="https://raw.githubusercontent.com/swiftinsg/branding/main/logos/icons/png/coloured%20-%20dark%20background.png" alt="Swiftinsg Logo" height="128px" style="margin-left: 64px;">
</div>

## Track B: Unit 5
List App

---

# Version 1

---vertical---

## Setting up the project

Delete the `Text` that says "Hello, world!" and replace it with a `Button`.

```swift[]
struct ContentView: View {
    var body: some View {
       VStack {
            Button("Hot Chocolate Drink") {
                // action goes here
            }
        }
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Adding a RecipeDetailView

- Add a `.sheet` modifier to the `Button` to present a `Sheet` when the button is tapped.
- Use a `@State` property to control the presentation of the `Sheet`.
- The sheet should present a `RecipeDetailView` when the button is tapped.

```swift[6,8-10]
struct ContentView: View {
    @State private var isDrinkPresented = false
    var body: some View {
       VStack {
            Button("Hot Chocolate Drink") {
                isDrinkPresented = true
            }
            .sheet(isPresented: $isDrinkPresented) {
                RecipeDetailView()
            }
        }
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Creating a RecipeDetailView

- Create a new source file called `RecipeDetailView.swift` and add the type `View`.
- Wait for the popup to appear and press `Enter` to use the default code snippet.

It should look like this:

```swift[]
import SwiftUI

struct MyView: View {
    var body: some View {
        Hello, world!
    }
}

#Preview {
    MyView()
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> RecipeDetailView.swift</p>

---vertical---

## Setting up the RecipeDetailView

- Change `MyView` to `RecipeDetailView`

```swift[3,10 ]
import SwiftUI

struct RecipeDetailView: View {
    var body: some View {
        Hello, world!
    }
}

#Preview {
    RecipeDetailView()
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> RecipeDetailView.swift</p>

---vertical---

## Adding Instructions to RecipeDetailView

- Replace `Hello, world!` with a `VStack`
- Inside the `VStack`, add in intructions of how to make a hot chocolate drink.

```swift[3-7]
struct RecipeDetailView: View {
    var body: some View {
        VStack {
            Text("Get a hot chocolate packet")
            Text("Mix it with milk or hot water")
            Text("Stir and enjoy!")
        }
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> RecipeDetailView.swift</p>

---vertical---

## Next up

### Well now we will be adding in Ice Cream for those who don't like hot drinks.

---vertical---

## Creating a RecipeDetailView2

- Create a new source file called `RecipeDetailView2.swift` and add the type `View`.
- Wait for the popup to appear and press `Enter` to use the default code snippet.
- Replace `MyView` with `RecipeDetailView2`.

```swift[]
import SwiftUI

struct RecipeDetailView2: View {
    var body: some View {
        Hello, world!
    }
}

#Preview {
    RecipeDetailView2()
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> RecipeDetailView2.swift</p>

---vertical---

## Setting up the RecipeDetailView2

- Replace `Hello, world!` with a `VStack` and add in intructions of how to make a Hot Chocolate Ice Cream Sundae.

```swift[3-7]
struct RecipeDetailView2: View {
    var body: some View {
        VStack {
            Text("Get a bowl")
            Text("Add in 2 scoops of ice cream")
            Text("Add in your favorite toppings")
        }
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> RecipeDetailView2.swift</p>

---vertical---

## Adding a second Button

- In `ContentView.swift`, add a new `Button` that says "Hot Chocolate Ice Cream Sundae" and present the `RecipeDetailView2` when tapped.

```swift[3,12-17]
struct ContentView: View {
    @State private var isDrinkPresented = false
    @State private var isIceCreamPresented = false
    var body: some View {
       VStack {
            Button("Hot Chocolate Drink") {
                isDrinkPresented = true
            }
            .sheet(isPresented: $isDrinkPresented) {
                RecipeDetailView()
            }
            Button("Hot Chocolate Ice Cream Sundae") {
                isIceCreamPresented = true
            }
            .sheet(isPresented: $isIceCreamPresented) {
                RecipeDetailView2()
            }
        }
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Next up

### Now we want to add an exit button to the `RecipeDetailView` and `IceCreamRecipeView` to dismiss the sheet.

---vertical---

## Adding an Exit Button

- In `RecipeDetailView.swift`, add a new `Button` that says "Exit" and dismiss the sheet when tapped.
- Then we also create a new `@Environment` property called `dismiss` to dismiss the sheet.

```swift[4,10-15]
import SwiftUI

struct RecipeDetailView: View {
    @Environment(\.dismiss) var dismiss
    var body: some View {
        VStack {
            Text("Get a hot chocolate packet")
            Text("Mix it with milk or hot water")
            Text("Stir and enjoy!")
            Button("Exit") {
                dismiss()
            }
        }
    }
}
```

---

# Version 2

---vertical---

## NavigationStack

- Imagine being able to easily switch between the hot chocolate drink and ice cream sundae recipes using a `NavigationStack`.
Apple uses this design pattern in many of their apps, such as the Settings app on iOS.

- TODO: add IOS Settings video

---vertical---

## Using NavigationStack in our app

- Update `ContentView` to use a `NavigationStack` instead of two buttons.

```swift[3-15]
import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationStack {
            VStack {
                NavigationView {
                    RecipeDetailView()
                } label: {
                    Text("Hot Chocolate Drink")
                }
            }
        }
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Modifing our NavigationView

- We would like show a title so that the user knows what they are looking at.
- Note: It should be a modifier to the VStack.

```swift[3-15]
struct ContentView: View {
    var body: some View {
        NavigationStack {
            VStack {
                NavigationView {
                    RecipeDetailView()
                } label: {
                    Text("Hot Chocolate Drink")
                }
            }
            .navigationTitle("Hot Chocolate Recipes")
        }
    }
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

---vertical---

## Adding a second recipe

- Now we want to add a second recipe to the `NavigationStack` called "Hot Chocolate Ice Cream Sundae".

```swift[3-15]
struct ContentView: View {
    var body: some View {
        NavigationStack {
            VStack {
                NavigationView {
                    RecipeDetailView()
                } label: {
                    Text("Hot Chocolate Drink")
                }
                NavigationView {
                    RecipeDetailView2()
                } label: {
                    Text("Hot Chocolate Ice Cream Sundae")
                }
            }

            .navigationTitle("Hot Chocolate Recipes")
        }
    }
}
```

---vertical---

## Next up
### For absolutly no reason at all, if we want to hide the title and the back button, we can use the `.toolbar(.hidden)` and `.navigationBarBackButtonHidden`.

---vertical---

## Hiding the toobar

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[17]
struct ContentView: View {
    var body: some View {
        NavigationStack {
            VStack {
                NavigationView {
                    RecipeDetailView()
                } label: {
                    Text("Hot Chocolate Drink")
                }
                NavigationView {
                    RecipeDetailView2()
                } label: {
                    Text("Hot Chocolate Ice Cream Sundae")
                }
            }
            .navigationTitle("Hot Chocolate Recipes")
            .toolbar(.hidden)
        }
    }
}
```

---vertical---

## Hiding the back button

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> RecipeDetailView.swift</p>

```swift[12]
struct RecipeDetailView: View {
    @Environment(\.dismiss) var dismiss
    var body: some View {
        VStack {
            Text("Get a hot chocolate packet")
            Text("Mix it with milk or hot water")
            Text("Stir and enjoy!")
            Button("Exit") {
                dismiss()
            }
        }
        .navigationBarBackButtonHidden(true)
    }
}
```

---vertical---

## Next up
### Now we want our app to look like Apple's Settings App because we love Apple.

---vertical---

## Making our app look like Apple's Settings App

- Change `Vstack` in `ContentView.swift` to a `List`.
- We can also add the toolbar back by removing the `.toolbar(.hidden)` modifier.

```swift[4]
struct ContentView: View {
    var body: some View {
        NavigationStack {
            List {
                NavigationView {
                    RecipeDetailView()
                } label: {
                    Text("Hot Chocolate Drink")
                }
                NavigationView {
                    RecipeDetailView2()
                } label: {
                    Text("Hot Chocolate Ice Cream Sundae")
                }
            }
            .navigationTitle("Hot Chocolate Recipes")
        }
    }
}
```

---vertical---

## Adding back the back button

- To enhance the user experience, lets add back in the back button in `RecipeDetailView` by removing the `.navigationBarBackButtonHidden` modifier.

```swift[]
struct RecipeDetailView: View {
    @Environment(\.dismiss) var dismiss
    var body: some View {
        VStack {
            Text("Get a hot chocolate packet")
            Text("Mix it with milk or hot water")
            Text("Stir and enjoy!")
            Button("Exit") {
                dismiss()
            }
        }
    }
}
```

---

# Version 3

---vertical---

## Generalizing the RecipeDetailView

Now imagine we wanted to add multiple new recipes to our app. We would have to create a new `RecipeDetailView` for each recipe. This is SUPER inefficient. To address this, we can generalize the `RecipeDetailView` to accept a `Title` and `Description` as parameters.

---vertical---

## Adding parameters to RecipeDetailView

- Accept a `Title` and `Description` as parameters in the `RecipeDetailView`.

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> RecipeDetailView.swift</p>

```swift[2-4]
struct RecipeDetailView: View {
    @Environment(\.dismiss) var dismiss
    var title: String
    var description: String
    var body: some View {
        VStack {
            Text("Get a hot chocolate packet")
            Text("Mix it with milk or hot water")
            Text("Stir and enjoy!")
            Button("Exit") {
                dismiss()
            }
        }
    }
}
```

---vertical---

## Using the parameters in RecipeDetailView

- Replace the hardcoded text with the `Title` and `Description` parameters.

```swift[6-12]
struct RecipeDetailView: View {
    @Environment(\.dismiss) var dismiss
    var title: String 
    var description: String 
    var body: some View {
        List {
            Text(description)
            Button("Exit") {
                dismiss()
            }
        }
        .navigationTitle(title)
    }
}
```

---vertical---

## Adding the Exit Button

Lastly, we add put the Exit in a `Section` 

```swift[8-12]
struct RecipeDetailView: View {
    @Environment(\.dismiss) var dismiss
    var title: String 
    var description: String 
    var body: some View {
        List {
            Text(description)
            Section {
                Button("Exit") {
                    dismiss()
                }
            }
        }
        .navigationTitle(title)
    }
}
```

---

# Update 4

---vertical---

TODO