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

## Let’s get started!

- Make a new SwiftUI project and call it `List App`
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

- Let’s add a `Spacer()` and add `.buttonStyle(.borderedProminent)` to the `Button` to make it look better.

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

- Let’s make the font size bigger

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

- Let’s add in a exit button to the `CreditsView` that says "Dismiss" and dismiss the sheet when tapped.
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
- Let’s also add in `.buttonStyle(.borderedProminent)` to make it look even better.

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

- Let’s add in a background color to the `CreditsView` to make it look even better
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

<div style="display: flex;">
<div style="flex: 1; display:flex; justify-content: center; align-items: center; padding-right:20px ">

<div style="margin-top:-25%">

<h2> List </h2>

- Let’s use the `List` view to display a list of items.
- Wrap all the `NavigationLink` in a `List` view.

</div>

</div>
<div style="width:60%; ">

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift</p>

```swift[5-16]
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

</div>
</div>

---vertical---

## Adding a title to the List

- Let’s add a title to the `List` to let people know what they are looking at.
- Let’s also make it larger so people can see it easier.

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

- If we run the app now, we can see that the list is scrollable.
- Let’s add the Credits button to the top corner of the screen. To add a button to the top corner, we can use the `toolbar` modifier.
- We can render the using `sheet` as we did before.

```swift[10-19]
struct ContentView: View {
    ...
    var body: some View {
        NavigationStack {
            List {
                ...
            }
            .navigationTitle("Recipes")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                Button {
                    showSheet = true
                } label: {
                    Text("Credits")
                }
                .sheet(isPresented: $showSheet) {
                    CreditsView()
                }
            }
        }
    }
}
```

---vertical---

## Using SF Symbols

- We can use Symbols to make the Credits button look better.
- We can use the `Image` view and use the `systemName` parameter to use a system image.
- The list of the system images can be found in your toolbar in Swift Playgrounds.

```swift[14]
struct ContentView: View {
    ...
    var body: some View {
        NavigationStack {
            List {
                ...
            }
            .navigationTitle("Recipes")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                Button {
                    showSheet = true
                } label: {
                    Image(systemName: "person.circle.fill")
                }
                .sheet(isPresented: $showSheet) {
                    CreditsView()
                }
            }
        }
    }
}
```

---

# Lesson 4 : Using a generic detail view

---vertical---

## Generic Detail View

- We should make a generic detail view that can be used for all the items in the list.
- This will allow us to reuse the same view for all the items in the list and make everything look nicer.

---vertical---

## Creating a DetailView

- Create a new SwiftUI file called `DetailView.swift` and add the type `View`.
- Wait for the popup to appear and press `Enter` to use the default code snippet.
- Change the `MyView` struct to `DetailView`.

```swift
import SwiftUI

struct DetailView: View {
    var body: some View {
        Hello, world!
    }
}
#Preview {
    DetailView()
}
```

<p><img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> DetailView.swift</p>

---vertical---

## Adding content to the DetailView

- We want our `DetailView` to show the name of the item and a description of the item.
- We can use a `List` to display the name and description of the item.

```swift[3-5]
struct DetailView: View {
    var body: some View {
        List {
            Text("Hot Chocolate Soup")
            Text("This is a hearty concoction great for cold winter nights.")
        }
    }
}
```

---vertical---

## Making our DetailView dynamic

- We want our `DetailView` to be able to show different items.

```swift[2, 3]
struct DetailView: View {
    let title: String
    let description: String
    var body: some View {
        List {
            Text(title)
            Text(description)
        }
    }
}
```

---vertical---

## Making our DetailView better

- Let’s add in a title to the `DetailView` to let people know what they are looking at.
- Let’s also add in sections so that the name and description are separated.

```swift[6-13]
struct DetailView: View {
    let title: String
    let description: String
    var body: some View {
        List {
            Section("Title") {
                Text(title)
            }
            Section("Details"){
                Text(description)
            }
        }
        .navigationTitle("Recipe Detail")
    }
}
```

---vertical---

## Let’s test our DetailView

- Modify the `Preview` code to use the new `DetailView` code.

```swift[5-7]
struct DetailView: View {
    ...
}

#Preview {
    DetailView(title: "Sample Hot Chocolate", description: "Sampling hot chocolate sounds like a great idea!")
}
```

---vertical---

## Using the DetailView from ContentView

- Let’s use the `DetailView` in the `ContentView` to show the details of the items in the list.

```swift[5-16]
struct ContentView: View {
    ...
    var body: some View {
        NavigationStack {
            List {
                NavigationLink {
                    DetailView(title: "Hot Chocolate Soup", description: "This is a hearty concoction great for cold winter nights.")
                } label: {
                    Text("Hot Chocolate Soup")
                }
                NavigationLink {
                    DetailView(title: "Hot Chocolate Ice Cream", description: "How can this be hot and cold at the same time??? It's incredible.")
                } label: {
                    Text("Hot Chocolate Ice Cream")
                }
            }
            ...
        }
    }
}
```

---

# Lesson 5 : Structs and Arrays

---vertical---

## UUID and Identifiable in SwiftUI

In SwiftUI, `UUID` (Universally Unique Identifier) is a type used to uniquely identify objects. It generates unique identifiers that are **highly unlikely** to be duplicated.

The `Identifiable` protocol in SwiftUI is used to associate a unique identifier with each instance of a struct. This allows SwiftUI to efficiently manage and update views based on changes to the underlying data.

Using `UUID` and `Identifiable`, SwiftUI can easily track and update views in response to changes in data, ensuring a smooth and efficient user interface.

You can think of this as your IC number in Singapore. It is unique to you and you can use it to identify yourself.

---vertical---

## Bool in Swift

In Swift, `Bool` is a fundamental data type representing Boolean values, which can be either `true` or `false`.

For example, we can use a `Bool` to represent whether a recipe is a favourite or not. We can set the initial value of `isFavourite` to `false` and toggle it to `true` when the user marks the recipe as a favourite.

```swift
var isFavourite: Bool = false

if isFavourite {
    print("This recipe is a favourite!")
} else {
    print("This recipe is not a favourite.")
}
```

---vertical---

## Structs

- We can use structs to store data about the items in the list.
- We can create a new file called `Recipe.swift` and add a struct called `Recipe` to store the name, description and other details of the recipe.

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> Recipe.swift </p>

```swift
import SwiftUI

struct Recipe: Identifiable {
    var id = UUID()
    var title: String
    var description: String
    var isFavourite: Bool = false // We set its default value to false
}
```

---vertical---

## Using the Recipe struct

- We can use the `Recipe` struct to store the details of the items in the list.

We can use it like this

```swift
var recipes = [
    Recipe(title: "Recipe 1", description: "Description 1"),
    Recipe(title: "Recipe 2", description: "Description 2")
]

// this will work only inside a view
List(recipes) { recipe in
    Text(recipe.title)
}
```

---vertical---

## Creating a list of Recipes

- Let’s use the `Recipe` struct to store the details of the items in the list.

```swift[3-6]
struct ContentView: View {
    @State private var showSheet = false
    var recipes = [
        Recipe(title: "Hot Chocolate Soup", description: "This is a hearty concoction great for cold winter nights."),
        Recipe(title: "Hot Chocolate Ice Cream", description: "How can this be hot and cold at the same time??? It's incredible.")
    ]
    var body: some View {
        ...
    }
}
```

---vertical---

## Using the Recipe struct in the ContentView

- Let’s use the `Recipe` struct to store the details of the items in the list.

```swift[9-15]
struct ContentView: View {
    @State private var showSheet = false
    var recipes = [
        Recipe(title: "Hot Chocolate Soup", description: "This is a hearty concoction great for cold winter nights."),
        Recipe(title: "Hot Chocolate Ice Cream", description: "How can this be hot and cold at the same time??? It's incredible.")
    ]
    var body: some View {
        NavigationStack {
            List(recipes) { recipe in
                NavigationLink {
                    DetailView(title: recipe.title, description: recipe.description)
                } label: {
                    Text(recipe.title)
                }
            }
            .navigationTitle("Recipes")
            ...
        }
    }
}
```

---

# Lesson 6 : Making editable recipes

---vertical---

# TextFields in SwiftUI

---vertical---

## TextFields in SwiftUI

- TextFields in SwiftUI are used to allow users to input text.
- We can use TextFields to allow users to edit the details of the recipes.
- The code below shows how to create a TextField and bind it to a `@State` variable.

```swift
TextField("Enter your name", text: $name)
```

---vertical---

## Adding TextFields to the DetailView

- Let’s add TextFields to the `DetailView` to allow users to edit the details of the recipes.
- We change `let` to `var` to make the `title` and `description` editable in the future.

```swift[2, 7]
struct DetailView: View {
    @State var title: String
    var description: String
    var body: some View {
        List {
            Section("Title") {
                TextField("Enter title", text: $title)
            }
            Section("Details"){
                Text(description)
            }
        }
        .navigationTitle("Recipe Detail")
    }
}
```

---vertical---

# Lesson 7 : Binding

---vertical---

## It did not work! Why?

- We need bindings to make the TextField work.
- We need to pass the `title` as a binding to the `DetailView` to make it editable.

---vertical---

## Adding a binding to the DetailView

- Let’s add a binding to the `DetailView` to make the `title` editable.

```swift[2, 7]
struct DetailView: View {
    @Binding var title: String
    var description: String
    var body: some View {
        List {
            Section("Title") {
                TextField("Enter title", text: $title)
            }
            Section("Details"){
                Text(description)
            }
        }
        .navigationTitle("Recipe Detail")
    }
}
```

---vertical---

## Using the DetailView with a binding

- Let’s use `List` with binding to make recipe editable.
- We also need to call `DetailView` with a binding recipe so that `title` is editable.

```swift[9-15]
struct ContentView: View {
    @State private var showSheet = false
    @State private var recipes = [
        Recipe(title: "Hot Chocolate Soup", description: "This is a hearty concoction great for cold winter nights."),
        Recipe(title: "Hot Chocolate Ice Cream", description: "How can this be hot and cold at the same time??? It's incredible.")
    ]
    var body: some View {
        NavigationStack {
            List($recipes) { $recipe in
                NavigationLink {
                    DetailView(title: $recipe.title, description: recipe.description)
                } label: {
                    Text(recipe.title)
                }
            }
            .navigationTitle("Recipes")
            ...
        }
    }
}
```

---vertical---

## Sending recipes to the DetailView

- Now we can change our `DetailView` to accept a `Recipe` instead of a `title` and `description`.
- This will allow us to edit the details of the recipe easily.
- Let’s modify our code so that we now send to DetailView the $recipe

```swift[3, 9-15]
// ContentView.swift
struct ContentView: View {
    @State private var showSheet = false
    @State private var recipes = [
        Recipe(title: "Hot Chocolate Soup", description: "This is a hearty concoction great for cold winter nights."),
        Recipe(title: "Hot Chocolate Ice Cream", description: "How can this be hot and cold at the same time??? It's incredible.")
    ]
    var body: some View {
        NavigationStack {
            List($recipes) { $recipe in
                NavigationLink {
                    DetailView(recipe: $recipe, description: recipe.description)
                } label: {
                    Text(recipe.title)
                }
            }
            .navigationTitle("Recipes")
            ...
        }
    }
}
```

---vertical---

## Sending recipes to the DetailView

- Now we can change our `DetailView` to accept a `Recipe` instead of a `title` and `description`.

```swift[2, 7]
// DetailView.swift
struct DetailView: View {
    @Binding var recipe: Recipe
    var body: some View {
        List {
            Section("Title") {
                TextField("Enter title", text: $recipe.title)
            }
            Section("Details"){
                Text(recipe.description)
            }
        }
        .navigationTitle("Recipe Detail")
    }
}
```

---vertical---

## Let’s change our Preview

- Now that we have updated our DetailView, we need to update our Preview code to reflect the changes.

```swift[5-7]
struct DetailView: View {
    ...
}

#Preview {
    DetailView(recipe: .constant(Recipe(title: "Sample Hot Chocolate", description: "Sampling hot chocolate sounds like a great idea!")))
}
```

---vertical---

## Expanding our app

- We can now add a toggle to the `DetailView` to allow users to mark the recipe as a favourite.

```swift[2, 7]
struct DetailView: View {
    @Binding var recipe: Recipe
    var body: some View {
        List {
            Section("Title") {
                TextField("Enter title", text: $recipe.title)
            }
            Section("Details"){
                Text(recipe.description)
            }
            Section("Favourite") {
                Toggle("Favourite", isOn: $recipe.isFavourite)
            }
        }
        .navigationTitle("Recipe Detail")
    }
}
```

---vertical---

## Show the favourite status in the list

- Lets show the favourite status of the recipe in the list.

```swift[9-15]
NavigationLink {
    DetailView(recipe: $recipe, description: recipe.description)
} label: {
    HStack {
        Text(recipe.title)
        if recipe.isFavourite {
            Image(systemName: "heart.fill")
        }
    }
}
```

<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift </p>

---

# Adding new recipes

---vertical---

## Adding new recipes

- First create a new state variable to store the new recipe

```swift[2]
@State private var showAdd = false
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift </p>

---vertical---

## Adding new recipes

- Add a new button to the toolbar to show the AddRecipeView

```swift[12-19]
.toolbar {
    Button {
        showSheet = true
    } label: {
        Image(systemName: "person.circle.fill")
    }
    .sheet(isPresented: $showSheet) {
        CreditsView()
    }

    Button {
        showAdd = true
    } label: {
        Image(systemName: "plus.app.fill")
    }
    .sheet(isPresented: $showAdd) {
        // Add recipe view
    }
}
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift </p>

---vertical---

## Adding new recipes

- To add a new `TextField`, we need to create a new state variable to store the new recipe

```swift[2]
@State private var newRecipeTitle = ""
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift </p>


---vertical---

## Adding new recipes

- Add a new `TextField` to the toolbar to allow users to enter the title of the new recipe

```swift[2-17]
.sheet(isPresented: $showAdd) {
    List {
        Section("Title") {
            TextField("Enter title for your new recipe", text: $newRecipeTitle)
        }

        Section{
            Button("Save"){

            }
            Button("Cancel"){
             
            }

            .foregroundColor(.red)
        }
    }
}
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift </p>

---vertical---

## Adding new recipes

- Add in the code to save the new recipe

```swift[8-15]
.sheet(isPresented: $showAdd) {
    List {
        Section("Title") {
            TextField("Enter title for your new recipe", text: $newRecipeTitle)
        }

        Section{
            Button("Save"){
                let newRecipe = Recipe(title: newRecipeTitle, description: "")
                recipes.append(newRecipe)
                showAdd = false
            }
            Button("Cancel"){
                showAdd = false
            }

            .foregroundColor(.red)
        }
    }
}
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift </p>

---

# Modifying recipes

---vertical---

## Deleting recipes

- To add in the ability to delete recipes, we need to add `editActions` to the List.

```swift[9-15]
List($recipes, editActions: [.all]){
    ...
}
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift </p>

---vertical---

## Reordering recipes

- To add in the ability to reorder recipes, we need to add `EditButton` to the toolbar.

```swift[3]
.toolbar {
    EditButton()
    ...
}
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift </p>

---

# Making the app look better

---vertical---

## Cleaning up

- We can clean up our code by moving the `Recipe` struct to the file called `Recipe.swift`.

```swift
struct Recipe: Identifiable {
    var id = UUID()
    var title: String
    var description: String
    var isFavourite: Bool = false // We set its default value to false

    static var sampleData = [
        Recipe(title: "Hot Chocolate Soup", description: "This is a hearty concoction great for cold winter nights."),
        Recipe(title: "Hot Chocolate Ice Cream", description: "How can this be hot and cold at the same time??? It's incredible.")
    ]
}
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> Recipe.swift </p>

---vertical---

## Cleaning up

- We can remove the sample data from the `ContentView` and use the sample data from the `Recipe` struct.

```swift
@Binding private var recipes = Recipe.sampleData

// To start from a blank screen we can use this
//@Binding private var recipes = [Recipe]()
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift </p>


---vertical---

## Making a custom AddView

- We can create a new file called `AddView.swift` and copy the code from the `ContentView` to create a custom `AddView`.
```swift
import SwiftUI

struct AddView: View {
    @State private var newRecipeTitle = ""

    var body: some View {
        List {
            Section("Title") {
                TextField("Enter title for your new recipe", text: $newRecipeTitle)
            }

            Section{
                Button("Save"){
                    let newRecipe = Recipe(title: newRecipeTitle, description: newRecipeDescription)
                    recipes.append(newRecipe)
                    showAdd = false
                }
                Button("Cancel"){
                    showAdd = false
                }

                .foregroundColor(.red)
            }
        }
    }
}
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> AddView.swift </p>

---vertical---

## Making a custom DetailView

- Making this sheet dismissable is a good idea. We can add a `@Environment` variable to dismiss the sheet.

```swift[1]
@Environment(\.dismiss) var dismiss
@State private var newRecipeTitle = ""
...
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> AddView.swift </p>


---vertical---

## Linking the recipes

- We need to link the recipes in the `AddView`.
- Add this to the top

```swift
@Binding var recipes = [Recipe]
```

---vertical---

## Fixing the preview error

- We need to update the preview code to reflect the changes.

```swift[5-7]
#Preview {
    AddView(recipes: .constant([]:))
}
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> AddView.swift </p>

---vertical---

## Updating the ContentView

- We need to update the `ContentView` to use the new `AddView`.

```swift[2]
.sheet(isPresented: $showAdd) {
    AddView(recipes: $recipes)
}
```
<p> <img src="/assets/swift-logo.svg" style="margin-bottom: -4px" height="32px"> ContentView.swift </p>


---

# Congratulations! You've completed Unit 5!

