# Unit 1
### Layouts, Views, modifiers, and enough SwiftUI to put things on screen.

---

# <span style="color: #c2410c;">Unit Overview:</span>
- Getting started
- Introduction to SwiftUI
- Views and Layouts
- Modifiers
- Links, Images, and SF Symbols
- Tips &amp; tricks
**Example Project: **Making a Name Card
**Exploration Project**: Create your own Emoji Artwork
---

# <span style="color: #c2410c;">**Unit 1.1**</span><span style="color: #c2410c;">: Getting started with Xcode; adding text and an image.</span>
## <span style="color: #c2410c;">Downloading Xcode (If you don’t have it)</span>
You should already have Xcode! If you don’t, go online, preferably on a fast connection, and:
- Open the <span style="color: #b91c1c;">**App Store**</span> app, search for <span style="color: #a16207;">**Xcode**</span>, and download it.
- Wait for a bit. It’s a large download.
- Launch it, and install anything else <span style="color: #a16207;">Xcode </span>asks you to.
- If asked, you just need to <span style="color: #b91c1c;">install the iOS libraries.</span>
- Wait again, for another large download.
- You can <span style="color: #b91c1c;">install the rest later</span>, if you want to develop for other platforms!

## <span style="color: #c2410c;">**Start a new project in Xcode**</span>
- You should see a welcome window. Choose <span style="color: #1d4ed8;">**“Create New Project…”**</span>.
- In the template chooser: <span style="color: #1d4ed8;">**iOS**</span>, then <span style="color: #1d4ed8;">**App**</span>.
- Fill in the following:
- Product Name: <span style="color: #1d4ed8;">**Name Card**</span>
- Organization Identifier: <span style="color: #1d4ed8;">**org.yourname**</span>
- Interface: <span style="color: #1d4ed8;">**SwiftUI**</span>
- Language: <span style="color: #1d4ed8;">**Swift**</span>
- Storage: <span style="color: #1d4ed8;">**None**</span>
- Leave <span style="color: #1d4ed8;">checkbox unchecked</span>
- Save it on your Desktop — or any other folder!
- Leave the <span style="color: #1d4ed8;">**Git Repository**</span> checkbox unchecked.

## <span style="color: #c2410c;">**Navigating Xcode**</span>
![image](/assets/track_sap/unit_01/image-001.png)
![image](/assets/track_sap/unit_01/image-002.png)

## <span style="color: #c2410c;">**Getting used to Xcode**</span>
- When you first launch Xcode, your **Preview** might take a while (sometimes *minutes*!) to spin up. This is normal.
- This is because Xcode is launching a full-fledged iPhone simulator, which is like starting up an entire iPhone.
- We’ll see how to launch this as a separate app in a bit.
- You’ll see a *lot* of buttons and controls! Pictured 👇 are nearly *30* things you can click when you start Xcode.
- Just like Photoshop, Final Cut, or other pro tools, Xcode can look a bit intimidating at first.
- We’ll introduce parts of the user interface (UI) as we go along, rather than go through everything at once.
![image](/assets/track_sap/unit_01/image-003.png)

- Click on the macOS menu, and choose <span style="color: #1d4ed8;">**Xcode**</span> → **Settings**. The keyboard shortcut is <span style="color: #1d4ed8;">**⌘,**</span> (cmd-comma).
- In the <span style="color: #1d4ed8;">**Themes**</span><span style="color: #1d4ed8;"> tab 1️⃣</span>, you can update your colour scheme. We use <span style="color: #1d4ed8;">**Default (Dark)**</span> for this course.
- **Tip**: To change the font or font size, select all the lines on the right 2️⃣, and update the font 3️⃣.
- Recommended: Under <span style="color: #1d4ed8;">**Text Editing 4️⃣**</span>, enable the <span style="color: #1d4ed8;">**Code folding ribbon 5️⃣**</span>.
![image](/assets/track_sap/unit_01/image-004.png)

## <span style="color: #c2410c;">**Starter Code**</span>
- There’s quite a few lines of starter code!
- We’ll explain some of these later on.
- <span style="color: #b91c1c;">Delete</span> <span style="color: #1d4ed8;">**lines 13 to 15**</span>, starting from Image, and ending with (.tint)
- The preview Canvas will change as you do this!
- Next, <span style="color: #b91c1c;">delete</span> <span style="color: #1d4ed8;">**line 18**</span> that says .padding().

## <span style="color: #c2410c;">**Add your name **</span>
- There’s now a piece of <span style="color: #b91c1c;">Text</span> left in the starter code, which looks like this right now: <span style="color: #1d4ed8;">`Text(&quot;Hello, world!&quot;)`</span>
- Change the string — <span style="color: #a16207;">that’s the </span><span style="color: #a16207;">*text inside the double quotes*</span><span style="color: #a16207;"> </span>— to your name! For me, it would be <span style="color: #1d4ed8;">`Text(&quot;YJ Soon&quot;)`</span>
- Notice that the right side preview will be updated!
- You can <span style="color: #b91c1c;">add more text underneath the existing one</span>! Add what you do. For me, that’s <span style="color: #1d4ed8;">`Text(&quot;Swift instructor&quot;)`</span>
![image](/assets/track_sap/unit_01/image-005.png)

## <span style="color: #c2410c;">**Run your Code! **</span>
- After pasting your code, your **Preview** should update.
- If you get “Cannot preview in this file - Unexpected error occurred”, try <span style="color: #1d4ed8;">refreshing it  ↻</span> or <span style="color: #1d4ed8;">restarting Xcode</span>.
- Next, try the <span style="color: #1d4ed8;">**iOS Simulator**</span>. Click on the <span style="color: #1d4ed8;">▶ button in Xcode’s toolbar</span>.
- Make sure the selected simulator is the default, “iPhone 17 Pro” at time of writing.
- This may take 6 to 7 minutes. Twiddle your thumbs for a bit.
- Your **Preview** will pause. You can resume it, to use that instead of the Simulator.
![image](/assets/track_sap/unit_01/image-006.png)

## <span style="color: #c2410c;">**Take a profile Picture **</span>
- Get a <span style="color: #1d4ed8;">photo of yourself</span> (or something that represents you — keep it inoffensive please!)
- Try the [**Photo Booth**](https://support.apple.com/en-sg/guide/photo-booth/welcome/mac) app on your Mac.
- You can also use an iPhone or iPad, if you have one — take a photo, and use [**AirDrop**](https://support.apple.com/en-sg/119857) to send it over. It’ll land in your **Downloads** folder.
- To add it to Xcode, drag the file into the <span style="color: #1d4ed8;">**Assets catalogue**</span>.
- Open the Assets catalogue in the File Navigator.
- Drag it into the centre pane.
- See the demo video on the next slide for a guide.
## <span style="color: #c2410c;">**Add your picture into the code! **</span>
- To rename, select the image by clicking once, then click again, and wait. You’ll see a text field to rename the image.
- Give it an <span style="color: #1d4ed8;">easy-to-type name</span> — I called my image “<span style="color: #b91c1c;">YJ</span>”.
- Note that I’m using ALL UPPERCASE!
- In the line before the Text containing your name, add Image(&quot;<span style="color: #b91c1c;">YJ</span>&quot;), replacing me with whatever you called your image in the sidebar.
- Case matters! If I type Yj, but my file is named YJ, it wouldn’t work.
- After that, add two lines, <span style="color: #a16207;">`.resizable()`</span> and <span style="color: #a16207;">`.scaledToFit()`</span><span style="color: #a16207;">.</span>
- See next slide for the code and output.
![image](/assets/track_sap/unit_01/image-007.png)

---

# <span style="color: #c2410c;">**Unit 1.2**</span><span style="color: #c2410c;">: </span><span style="color: #c2410c;">**Stacks and Layout**</span><span style="color: #c2410c;">.</span>
## <span style="color: #c2410c;">Layout with Stacks</span>
- In SwiftUI, our UI is reflected directly in our code!
- This means the first thing in our code so far is the first thing shown, at the top, then going down
- What if we want to lay things out horizontally, or back-to-front? Introducing three different stacks:
- <span style="color: #1d4ed8;">VStack</span>, for vertical stacking
- <span style="color: #b91c1c;">HStack</span>, for horizontal stacking
- <span style="color: #15803d;">ZStack</span>, for back-to-front (z-axis) stacking (in a later sub-unit).
![image](https://www.appcoda.com/learnswift/images/stackviews/stackviews-1.png)

We currently have a VStack *enclosing *our three existing Views:
An <span style="color: #b91c1c;">Image,</span> a <span style="color: #1d4ed8;">Text</span>, with your name and another <span style="color: #1d4ed8;">Text</span>, with what you do
![image](/assets/track_sap/unit_01/image-009.png)

By <span style="color: #1d4ed8;">*enclosing*</span><span style="color: #1d4ed8;"> pieces of code</span>, we mean that the line <span style="color: #b91c1c;">`VStack {`</span> is *above* the three lines of code, and then there is a <span style="color: #b91c1c;">`}`</span> below them:
![image](/assets/track_sap/unit_01/image-010.png)

The three items are surrounded by <span style="color: #1d4ed8;">curly braces { }</span>, and their <span style="color: #b91c1c;">indentation aligns </span><span style="color: #b91c1c;">*one level in*</span><span style="color: #b91c1c;"> from the VStack.</span>
![image](/assets/track_sap/unit_01/image-011.png)

- We want our image to be on the left of the two pieces of text.
- To do this, we can use a <span style="color: #b91c1c;">HStack</span>, containing two Views:
- The <span style="color: #15803d;">Image, on the left</span>
- The <span style="color: #1d4ed8;">VStack, on the right,</span> which contains the two Texts
- Can you figure out how to have your HStack set up to achieve the layout shown?
![image](/assets/track_sap/unit_01/image-012.png)
### <span style="color: #b91c1c;">Answer</span>
![image](/assets/track_sap/unit_01/image-013.png)

## <span style="color: #c2410c;">VStack Parameters</span>
- What if we want our name and tagline to be left-aligned? We can introduce *parameters* to our VStack — much like how Text and Image have parameters in round brackets ().
- The parameter in question is called <span style="color: #b91c1c;">alignment:</span>, and it can be <span style="color: #1d4ed8;">`.leading`</span><span style="color: #1d4ed8;">, </span><span style="color: #1d4ed8;">`.trailing`</span><span style="color: #1d4ed8;">, or some others.</span>
- Leading is left and trailing is right in left-to-right languages; it’s reversed for right-to-left languages like Arabic.
- The dots are from <span style="color: #15803d;">**enums**</span> — more on these later!
- When you type the opening parenthesis, 
you’ll see autocomplete options. For now, 
don’t choose these — just type it out!
![image](/assets/track_sap/unit_01/image-014.png)
![image](/assets/track_sap/unit_01/image-015.png)

## <span style="color: #c2410c;">HStack Parameters</span>
- HStack also has parameters!
- For its alignment:, an HStack can have <span style="color: #1d4ed8;">`.top`</span><span style="color: #1d4ed8;">, </span><span style="color: #1d4ed8;">`.middle`</span><span style="color: #1d4ed8;">, </span><span style="color: #1d4ed8;">`.bottom`</span><span style="color: #1d4ed8;">, or a few other options.</span>
- Both VStack and HStack have another parameter, called <span style="color: #b91c1c;">spacing:</span>, which takes a number, and determines how far apart each item in a stack is.
- This parameters must come after alignment.
- Your HStack could hence look like this: <span style="color: #15803d;"> </span><span style="color: #15803d;">`HStack(alignment: .top, spacing: 10)`</span>

---

# <span style="color: #c2410c;">**Unit 1.3**</span><span style="color: #c2410c;">: View Modifiers.</span>
- <span style="color: #a16207;">.resizable()</span>, which we applied to the Image, is an example of a View Modifier (or just *modifier*).
- Modifiers help make individual Views look better or different.
- These are additional pieces of formatting and functionality “tacked on” to each View.
- We’ll introduce a variety of modifiers, and add them to elements, to help enhance our app.

- Modifiers take the form of <span style="color: #b91c1c;">“dot something”</span>, listed after each View.
- When you’re done writing them, they look like a list of attributes, e.g.
```swift
 Text("YJ Soon")
     .bold()
		 .italic()
		 .font(.system(size: 100))
		 .padding()
		 .foregroundStyle(.white)
		 .background(.red)
```
## <span style="color: #c2410c;">Text Modifiers:</span>
<span style="color: #1d4ed8;">`.bold()`</span>
- Makes this Text View **bold**
<span style="color: #b91c1c;">`.italic()`</span>
- Makes this Text View *italic*
<span style="color: #15803d;">`.font(.largeTitle)`</span>
- Makes the font a large title. There are others — try typing a dot, and seeing what autocomplete comes up with, and pressing enter to choose one.
<span style="color: #a16207;">`.font(.system(size: 100))`</span>
- Changes the size of the font to 100

Now let’s try and replicate this screen by using text modifiers:
### <span style="color: #b91c1c;">Answer</span>
```swift
struct ContentView: View {
    var body: some View {
        HStack(alignment: .top) {
            Image("YJ")
                .resizable()
                .scaledToFit()
            VStack {
                Text("YJ Soon")
                    .bold()
                    .italic()
                    .font(.largeTitle)
                Text("Swift instructor")
                    .font(.system(size: 20))
            }
        }
    }
}
```

## <span style="color: #c2410c;">Colors and Padding:</span>
<span style="color: #b91c1c;">`.background(.red)`</span>
- Makes the background red. You can choose from other built-in colours, like blue, orange, yellow, and others.
<span style="color: #1d4ed8;">`.foregroundStyle(.blue)`</span>
- Makes the foreground colour blue.
<span style="color: #15803d;">`.padding()`</span>
- Gives some space to any view. You can also include a number as a parameter, e.g. .padding(50), to define how much padding to give.

Now let’s try and replicate this screen by using colors and padding:
### <span style="color: #b91c1c;">Answer</span>
```swift
//more code above 

HStack(alignment: .top) {
    Image("YJ")
        .resizable()
        .scaledToFit()
    VStack {
        Text("YJ Soon")
            .bold()
            .italic()
            .font(.largeTitle)
            .padding()
            .foregroundStyle(.white)
            .background(.red)
        Text("Swift instructor")
            .font(.system(size: 20))
    }
}

//more code below
```

## **Using modifiers:**
- Note that *modifier order matters.*
- If you add <span style="color: #b91c1c;">`.padding()`</span> before <span style="color: #1d4ed8;">`.background()`</span>, your padding will also receive that background.
- Try swapping the order of the two, to see what happens.
- Some modifiers can only be applied to specific Views.
- E.g. if you put a <span style="color: #15803d;">`.bold()`</span> modifier on an Image, nothing will happen. (In previous versions of SwiftUI, you’d get an error.)
- You can also place modifiers on *container views*, with some different effects.
- Container views we’ve seen so far are VStack or HStack.
- Applying <span style="color: #b91c1c;">`.padding()`</span> on a VStack or HStack will apply padding around the stack, *not* on each individual item.
- Placing <span style="color: #be185d;">`.font(.system(size:100))`</span> on a container view will behave differently — it’ll apply the font size to each of the enclosed views.
## **Image modifiers and Sizing**
<span style="color: #b91c1c;">`.resizable()`</span>
<span style="color: #1d4ed8;">`.scaledToFit()`</span>
- Lets us manipulate the image size, while keeping it proportional.
<span style="color: #15803d;">`.frame(width: 200, height: 200)`</span>
- Adjust the size of a View. The height: parameter is optional for an image marked as scaledToFit.
- Note that using a frame means it won’t adapt to your screen size any more. Try running the app in full-screen mode to see the difference.
<span style="color: #c2410c;">Now let’s try and replicate this screen by using colors and padding:</span>
### <span style="color: #b91c1c;">Answer</span>
```swift
//more code above 

HStack(alignment: .top) {
    Image("YJ")
        .resizable()
        .scaledToFit()
        .frame(width: 120)
    VStack {
        Text("YJ Soon")
            .bold()
            .italic()
            .font(.largeTitle)
            .padding()
            .foregroundStyle(.white)
            .background(.red)
        Text("Swift instructor")
            .font(.system(size: 20))
    }
}

//more code below
```

## **Masking**
`.mask(Circle())`
- Masks the contents behind the shape given — in this case, a circle. You can also try Rectangle(), Capsule(), or Ellipse(), or…
`.mask(RoundedRectangle(cornerRadius: 10))`
- Adds rounded corners to a View. Give a bigger number for more roundedness!
- You might also see code use clipShape, which is subtly different from mask, and allows a shorthand called .rect:
`.clipShape(.rect(cornerRadius: 10))`
<span style="color: #c2410c;">Now let’s try and replicate this screen by using masking:</span>
### <span style="color: #b91c1c;">Answer</span>
```swift
//more code above 

HStack(alignment: .top) {
    Image("YJ")
        .resizable()
        .scaledToFit()
        .frame(width: 120)
        .mask(Circle())
    VStack {
        Text("YJ Soon")
            .bold()
            .italic()
            .font(.largeTitle)
            .padding()
            .foregroundStyle(.white)
            .background(.red)
        Text("Swift instructor")
            .font(.system(size: 20))
    }
}

//more code below
```

---

# **Unit 1.4: ZStack, Link, SF Symbols**
## **ZStack**
- Let’s add some background colour to our app.
- You can try adding <span style="color: #1d4ed8;">`.background(.blue)`</span> to your HStack, but it won’t look great. That’s because HStack doesn’t actually take up all the space on screen!
- Instead, we’ll use a ZStack, which lets us stack views one in front of another.
- In SwiftUI, a background colour a view call <span style="color: #b91c1c;">Color*</span>, that goes behind other Views.
- To put in a colour, type Color, then dot ., to get autocomplete options for the same set of colours you used in <span style="color: #a16207;">`.background()`</span> and <span style="color: #15803d;">`.foregroundStyle()`</span>.
- Remember to use American spelling, because, like Apple, Swift is made in California.

<span style="color: #c2410c;">Now let’s try and replicate this screen by using ZStacks:</span>
### <span style="color: #b91c1c;">Answer</span>
```swift
 
ZStack{
Color.blue
HStack(alignment: .top) {
	    Image("YJ")
	        .resizable()
	        .scaledToFit()
	        .frame(width: 120)
	        .mask(Circle())
	    VStack {
	        Text("YJ Soon")
	            .bold()
	            .italic()
	            .font(.largeTitle)
	            .padding()
	            .foregroundStyle(.white)
	            .background(.red)
	        Text("Swift instructor")
	            .font(.system(size: 20))
	    }
	}
}
```

## Ignore Safe Area
<span style="color: #b91c1c;">`.ignoresSafeArea(edges: .all)`</span>
- The top and bottom bars of an iPhone, which overlap with the Notch / Dynamic Island (top) and Home Indicator (bottom), are called the **Safe Area**. Developers aren’t supposed to put any UI elements there.
- You can, however, use this modifier on the ZStack to let it “spill into” the Safe Area.
- Setting the edges: parameter to `.all` will ignore top and bottom; you can also just choose to ignore the <span style="color: #1d4ed8;">`.top`</span> and <span style="color: #1d4ed8;">`.bottom`</span> edges.

<span style="color: #c2410c;">Now let’s try and replicate this screen by using ZStacks:</span>
### <span style="color: #b91c1c;">Answer</span>
```swift
 
ZStack{
Color.blue
HStack(alignment: .top) {
	    Image("YJ")
	        .resizable()
	        .scaledToFit()
	        .frame(width: 120)
	        .mask(Circle())
	    VStack {
	        Text("YJ Soon")
	            .bold()
	            .italic()
	            .font(.largeTitle)
	            .padding()
	            .foregroundStyle(.white)
	            .background(.red)
	        Text("Swift instructor")
	            .font(.system(size: 20))
	    }
	}
}
.ignoresSafeArea(edges: .all)
```

## A note on Views taking up space
- You may have noticed that some views behave differently with respect to the space around them, e.g. an Image with and without `.resizable()`
- Views behave one way or the other: **Fit** or **Fill**.
- This behaviour will determine whether a view take up *as little space as possible *(to **fit **its contents), or *as much space as possible *(to **fill** its container)*.*
### **Fitting vs. Filling Views**
- **Fit**: These Views exercise a lot 💪 take up only as much space as their contents need. Fitting Views include Text, Image, and all three Stacks.
- You can make them fill by using the frame modifier with `maxWidth: .infinity` or `maxHeight: .infinity`
- **Fill**: These Views take up as much space as they can, like someone stretching out on a bed. Filling Views include Color, `Image.resizable()`, and all shapes.
- You can size them down using the .frame modifier with a fixed width and/or height.

## <span style="color: #c2410c;">Link syntax</span>
- We’ll add a few tappable icons to your name card, using the Link view.
- This view looks complex, but just use the code and change the highlighted portions: 1️⃣ is the link (with https:// in front!), 2️⃣ is the icon (next slide).
![image](/assets/track_sap/unit_01/image-016.png)
## Image with systemName
- Notice the Image we used has a systemName *parameter*, for which we entered applelogo. That gives us an apple logo symbol!
- We actually had a globe symbol in the starter code, but we asked you to delete it. Sorry 😞
- You can add modifiers to these to change how they look.
- Use the font modifier to change its size, e.g. <span style="color: #b91c1c;">`.font(.system(size: 100))`</span>
- The original logo had a modifier for <span style="color: #1d4ed8;">`.imageScale(.large)`</span>, but that might not be large enough for us.
- Try <span style="color: #15803d;">foregroundStyle, background, or padding too.</span>
- How do we know what can be a valid entry for systemName?
- These are called <span style="background-color: rgba(161, 98, 7, 0.2); color: #a16207; border-radius: 0.15em; padding: 0 0.15em;">**SF Symbols**</span>, and you can browse them in Xcode: press the + button in the menu bar, then choose ⍟ to browse.
- You can also browse them in the SF Symbols app! Get it from [developer.apple.com/sf-symbols](https://developer.apple.com/sf-symbols).
- Sometimes, the app is marked as a “Beta”. That means there’s a new version of iOS coming out, and there are some new symbols only supported on 
the new version.
- It’s usually fine to get the beta, but you can usually scroll down to find 
an earlier version.
- Download and install the package file.

- Adding <span style="color: #b91c1c;">`.fill`</span> behind the name of some SF Symbols icons can give you a filled-in version of the icon.
- Try this with <span style="background-color: rgba(21, 128, 61, 0.2); color: #15803d; border-radius: 0.15em; padding: 0 0.15em;">`star`</span> and <span style="background-color: rgba(21, 128, 61, 0.2); color: #15803d; border-radius: 0.15em; padding: 0 0.15em;">`star.fill`</span>.
- Some icons have multiple colours!
- You can browse these in the <span style="background-color: rgba(161, 98, 7, 0.2); color: #a16207; border-radius: 0.15em; padding: 0 0.15em;">**SF Symbols app**</span><span style="background-color: rgba(161, 98, 7, 0.2); color: #a16207; border-radius: 0.15em; padding: 0 0.15em;">.</span>
- You can see these in the Multicolour section on the left menu, and preview them in SF Symbols on the right, under “Rendering”.
- To show icons with colour, before any foregroundStyle modifier, use the .renderingMode(.original) modifier on the Image view.

<span style="color: #c2410c;">Now let’s try and replicate this screen by using Links and SF symbols:</span>
The first symbol must be linked to the website: [mailto:hello@tk.sg](mailto:hello@tk.sg)
The second symbol must be linked to the website: [https://tk.sg/importantLink](https://tk.sg/importantLink)
![image](/assets/track_sap/unit_01/image-017.png)
### <span style="color: #b91c1c;">Answer</span>
```swift
VStack {
    Text("YJ Soon")
        .bold()
        .italic()
        .font(.largeTitle)
        .padding()
        .foregroundStyle(.white)
        .background(.red)
    Text("Swift instructor")
        .font(.system(size: 20))
    HStack {
        Link(destination: URL(string: "mailto:hello@tk.sg")!) {
            Image(systemName: "mail")
        }
        Link(destination: URL(string: "https://tk.sg/importantLink")!) {
            Image(systemName: "pc")
        }
    }
    .font(.title)
    .foregroundStyle(.yellow)
    .padding(.top)

}
```

## Final Code of the Name Card app
```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        ZStack {
            Color.blue
            HStack(alignment: .top) {
                Image("YJ")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 120)
                    .mask(Circle())
                VStack {
                    Text("YJ Soon")
                        .bold()
                        .italic()
                        .font(.largeTitle)
                        .padding()
                        .foregroundStyle(.white)
                        .background(.red)
                    Text("Swift instructor")
                        .font(.system(size: 20))
                    HStack {
                        Link(destination: URL(string: "mailto:hello@tk.sg")!) {
                            Image(systemName: "mail")
                        }
                        Link(destination: URL(string: "https://tk.sg/importantLink")!) {
                            Image(systemName: "pc")
                        }
                    }
                    .font(.title)
                    .foregroundStyle(.yellow)
                    .padding(.top)
                    
                }
            }
        }
        .ignoresSafeArea(edges: .all)
    }
}

#Preview {
    ContentView()
}

```

---

# Unit 1.5: Tips and Tricks in Swift UI
## Comments
- If you want to keep a line of code around without deleting it, e.g. a modifier you want to try later, add `//` in front of it to make it into a *comment*. 1️⃣ It’ll fade out, and Xcode will ignore it, but you can bring it back later.
- This is also good for adding notes to yourself! 2️⃣
![image](/assets/track_sap/unit_01/image-018.png)
## Autocomplete
- As you type, Xcode will try to be helpful and provide autocomplete suggestions for you 1️⃣.
- If you like the current suggestion — great! Press <span style="color: #1d4ed8;">**Return ⏎**</span> and it’ll be on-screen.
![image](/assets/track_sap/unit_01/image-019.png)
- If you an option with parameters, there will be placeholders for you to fill in 2️⃣.
- The first one will be highlighted; fill it in, and press <span style="color: #b91c1c;">**Tab⇥**</span> to go to the next one.
![image](/assets/track_sap/unit_01/image-020.png)
- As you type, say, .frame, notice the autocomplete options:
- Parameter labels in italic 1️⃣ are optional, so you can just choose one or more to include them. (Other modifiers will have non-optional parameters.)
- *If you press *<span style="color: #1d4ed8;">**Return**</span><span style="color: #1d4ed8;">*** ***</span><span style="color: #1d4ed8;">**⏎**</span>*, you’ll only get the non-optional parameters* — nothing, in this case! To insert all optional parameters 2️⃣, press <span style="color: #1d4ed8;">**OptReturn ⌥**</span><span style="color: #1d4ed8;">-</span><span style="color: #1d4ed8;">**⏎**</span>.
## Curly Braces
- With lots of curly braces, it can be hard to see where to add a modifier or put the next view.
- One way to identify a block (pair of curly braces) is to **double-click** on each curly brace to highlight the entire block
![image](/assets/track_sap/unit_01/image-021.png)

- Remember the **Code Folding Ribbon** 2️⃣ enabled in Settings? You can also click on that to “fold” code blocks, with a *super cool animation*!
## Indentation
- Is your code *indented* properly?
- Xcode will help enforce indentation as you type.
- This ensures sure Views that are “within” other Views are “one level deeper” in indentation
- If anything goes wrong, let Xcode auto-fix it for you with this incantation:
- Select all your code with <span style="color: #1d4ed8;">Cmd - A</span>, or <span style="color: #b91c1c;">**Edit**</span><span style="color: #b91c1c;"> → </span><span style="color: #b91c1c;">**Select All**</span>
- Re-Indent all your code automatically with <span style="color: #1d4ed8;">**Ctrl - I**</span>, or <span style="color: #b91c1c;">**Editor**</span><span style="color: #b91c1c;"> → </span><span style="color: #b91c1c;">**Structure **</span><span style="color: #b91c1c;">→ </span><span style="color: #b91c1c;">**Re-Indent**</span>
## Dark Mode vs Light Mode
- SwiftUI apps support Dark Mode and Light Mode
- In <span style="color: #1d4ed8;">Dark Mode</span>, text should be light, <span style="color: #1d4ed8;">on a dark background</span>
- In <span style="color: #b91c1c;">Light Mode</span>, text should be dark, <span style="color: #b91c1c;">on a light background</span>
- Your app looks different in dark mode and light mode!
- This means that if you set your text colour as a dark colour, changing to dark mode against a default dark background might not be great.
- Switch between modes in System Settings → Appearance to see how your app looks in each mode
- In a later unit, we’ll show you how to set different colours depending on device appearance.
## Searching for Information
- Within SwiftUI, there will be a lot of customisations you want to make that we won’t be able to cover, so you’ll need to search online.
- When searching for information online, be sure to specify <span style="color: #b91c1c;">“SwiftUI”</span> in your query.
- Otherwise, you might get a bunch of results that refer to UIKit, an older — but still popular — framework for building apps.
- In most search engines, you can use quotes around the word “SwiftUI” to get answers specifically for SwiftUI.
- [<span style="color: #15803d;">Hacking with Swift</span>](https://hackingwithswift.com/)<span style="color: #15803d;"> </span>— Probably one of the top results when searching. Great if you need a quick snippet or example, and has lots of up-to-date resources and tutorials.
- [<span style="color: #b91c1c;">Stack Overflow</span>](https://stackoverflow.com/questions/tagged/swiftui)<span style="color: #b91c1c;"> (tagged with SwiftUI)</span> — A community-driven Q&amp;A forum. Top-voted questions and answers should serve you well!
- [<span style="color: #1d4ed8;">Apple SwiftUI documentation</span>](https://developer.apple.com/documentation/swiftui) — Up-to-date and detailed, but can get technical very quickly as the target audience is seasoned developers.
## Searching with DuckDuckGo (Optional)
- You can change your default search engine in Safari to <span style="color: #b91c1c;">DuckDuckGo</span>, a (purportedly) privacy-focused search engine.
- One useful feature in DuckDuckGo is bangs (or !) — simple search text shortcuts you can use to search different sites, e.g. `!appledev HStack`
- <span style="color: #1d4ed8;">!appledev (or !swift or !adev)</span> will get results from the developer documentation
- This is useful if you see a new View or modifier, and want to look up the <span style="color: #15803d;">official documentation quickly.</span>
- <span style="color: #a16207;">!hws</span> will search Hacking with Swift
- <span style="color: #be185d;">!so</span> or !stack will search Stack Overflow
## Taking Screenshots and Screen - Recording
- Instructors may ask you to submit screenshots of your work.
- <span style="color: #1d4ed8;">**Cmd - Shift - 3**</span><span style="color: #1d4ed8;">:</span> Takes a screenshot of the whole screen
- <span style="color: #b91c1c;">**Cmd - Shift - 4**</span><span style="color: #b91c1c;">:</span> Takes a screenshot of the selected area
- If you hover your mouse over a window, and press space, then click, it’ll take a screenshot of that window
- <span style="color: #15803d;">**Cmd - Shift - 5**</span><span style="color: #15803d;">:</span> Brings up a bar with options
- Screenshots are saved on your Desktop, named by time
- As with screen - recording, press <span style="color: #15803d;">**Cmd - Shift - 5**</span>** **to activate the recording tool.
- In the recording bar, select the second set of options for recording your screen
- Record the entire screen, or just a portion
- There are options for recording sound, or not; you can also choose where to save your screenshots/screen recordings by default.
## SIMULATORS!!!
- Click on the home icon in the toolbar to go to the home screen
- Shortcut: <span style="color: #1d4ed8;">**Shift - Cmd - H**</span>
- Play around with Safari and Settings!
- Click on the rotate icon to turn the phone to landscape mode
- Shortcut: <span style="color: #b91c1c;">**Cmd - right arrow**</span>
- Hold down Opt when clicking to rotate the other way
## Recording in the Simulator
- Click on the screenshot icon to take a screenshot, which goes to your <span style="color: #1d4ed8;">**Desktop**</span>
- You can hold down Opt when clicking to make a recording, but…
- It’s probably better to just use the macOS recorder <span style="color: #b91c1c;">(</span><span style="color: #b91c1c;">**Cmd - Shift - 5**</span><span style="color: #b91c1c;">)</span>.
- For this, you can go to the Simulator’s Settings (<span style="color: #15803d;">**Cmd - comma**</span> or <span style="color: #be185d;">**Simulator→Settings**</span>) and turn on **Show single touches**.
- This way, the user can see where you tap when recording! These aren’t recorded with <span style="color: #a16207;">Opt-screenshot icon</span>.
![image](/assets/track_sap/unit_01/image-022.png)
## Debug Area
- After running your app in the Simulator, you might notice the <span style="color: #1d4ed8;">**Debug Area**</span> pop up at the bottom of Xcode, where your print statements will show up (among other things).
- To dismiss it, click on the console icon near the bottom right corner.
- The other two icons in the bottom right, (the icon pointing towards the left)1️⃣ and (the icon pointing towards the right)2️⃣, will toggle the **Variables View** and **Console View** respectively.
![image](/assets/track_sap/unit_01/image-023.png)
## Preview vs Simulator vs Device
- The <span style="color: #1d4ed8;">**Simulator**</span> is a full-fledged “virtual iOS device”, which lets you do some things you can’t do in Preview:
- Quit the app and restart it
- Receive notifications from your app
- The <span style="color: #b91c1c;">**Preview Canvas**</span> is good enough for most testing, and:
- Updates live, as you type!
- These controls lets you see your app in layout mode, and with multiple orientations, font sizes, and device sizes
- Finally, you can run on <span style="color: #15803d;">an actual iOS device</span>!
- We won’t go through this, but if you’d like to try it out, get an Apple ID, your device, and a cable ready, and [read this article for a guide](https://medium.com/nerd-for-tech/how-to-run-xcode-on-your-iphone-irene-bosque-783a2975534a).
## Sending Code
- To share your code, e.g. with instructors or teammates, you might want to use a “pastebin” — a site that lets you send code via a link.
- One popular pastebin is [**GitHub Gist**](http://gist.github.com/), but that requires a sign-up.
- (Feel free to sign up for it now if you’d like though — we’ll eventually ask you to use GitHub!)
- You can use our simple tool at [**code.tk.sg**](http://code.tk.sg/) for this.
- Go to the website, paste your code, press the leftmost Save button
- Copy the unique URL and send it
- To copy code from someone’s [code.tk.sg](http://code.tk.sg/) link, click on the “Just Text” button (second from right)

---

# Unit 1.6: More Views and Modifiers
## <span style="color: #c2410c;">Custom Colours</span>
`Color(red: 255/255, green: 40/255, blue: 10/255)`
- Tired of default colours? Make your own! You may know from physics class that colours are made of red, green, and blue light.
- In SwiftUI, you can create a `Color` view out of these three component colour parameters, each ranging from 0 to 1.
- We use `/255` to divide “standard” hexadecimal colour 
values between 0 and 255, used commonly in 
programming.
- Google for “[hex colour picker](https://www.google.com/search?hl=en&q=hex%20colour%20picker)” to get a colour picker; grab the RGB 
values for your code.
- [Read more](https://htmlcolorcodes.com/) about hex colour codes.
## <span style="color: #c2410c;">Gradients</span>
- SwiftUI supports different gradients, such as `linear gradients` and `radial gradients`
- Creates a gradient between two or more colours, suitable for use in `background()` or in a `ZStack`.
- Also create a gradient suitable to burn the eyes off of anyone looking. See next slide.
- Sorry in advance.
## <span style="color: #c2410c;">Linear Gradient</span>
```swift
LinearGradient(colors: [.red, .yellow],               
								startPoint: .topTrailing,                
								endPoint: .bottomTrailing)
```
- In a Linear Gradient, colours fade from one to another
- Parameters
- colors: The colors in the gradient
- startPoint/endPoint: Where should the gradient start from/end at?
- `.top`
- `.bottom`
- `.topLeading` (Top Left)
- `.topTrailing`(Top Right)
- `.leading` (Left)
- `.trailing` (Right)
- `.bottomLeading` (Bottom Left)
- `.bottomTrailing` (Bottom Right)
- `.center`
## <span style="color: #c2410c;">Radial Gradient</span>
```swift
RadialGradient(colors: [.red, .orange, .yellow], 
               center: .center, 
               startRadius: 0, endRadius: 270))
```
- Linear gradients but in circles
- Parameters
- colors: The colours in the gradient
- center: Where should the gradient start from?
- `.top`
- `.bottom`
- `.topLeading` (Top Left)
- `.topTrailing`(Top Right)
- `.leading` (Left)
- `.trailing` (Right)
- `.bottomLeading` (Bottom Left)
- `.bottomTrailing` (Bottom Right)
- `.center`
## <span style="color: #c2410c;">Sizing</span>
```swift
.frame(width: 100, height: 100)
```
- Adjust the size of a View. The `height:` parameter is optional for an image marked as `scaledToFit`.
- This will be great for our images to ensure it has a decent size.
- Important: While this modifier can be used to easily layout your views, you should use `VStack`s and `HStack`s instead as it allows your views to easily scale, especially since our apps should work on screens no matter the size.
## <span style="color: #c2410c;">Positioning</span>
```swift
.offset(x: 100, y: 200)
```
- Lets you move your object from where it’s supposed to be
- If you only want to move `x` or `y`, you can leave out the other parameter.
- Note that `x` increases from left to right, i.e. a positive x-offset will move your view to the right, but `y` increases from top to bottom, so a positive y-offset will move your view *down*.
- Once again, though, note that these offsets might not look good in other screen sizes, so you might be better off working with stacks and spacers (couple of slides down). Do test them out!
## <span style="color: #c2410c;">Rotation</span>
```swift
.rotationEffect(.degrees(30))
```
- This turns your view around with a given angle, defined here in degrees.
- Do you like radians? You can use those, too.
```swift
.rotation3DEffect(.degrees(180), axis: (0, 1, 0))
```
- This turns your view around with a given angle, on a *given 3-dimensional axis*. This particular set of values flips your image.
- Think of this axis as a skewer, and you’re flipping your view around with it.
## <span style="color: #c2410c;">Spacer</span>
- Need to “push” things around within a stack? Try adding a Spacer() view, which is an invisible “Filling” view, in that it takes up as much space as it can.
- If you have a VStack with two Text views:
- Adding a Spacer before the two Text views will push them to the bottom
- Adding a Spacer after the two Text views will push them to the top
- Adding a Spacer between the two Text views will push them as far apart as possible within the stack 👉
![image](/assets/track_sap/unit_01/image-024.png)
## <span style="color: #c2410c;">Masking with SF Symbols</span>
```swift
.mask(
    Image(systemName: "star.fill")
        .font(.system(size: 200))
)
```
- Remember SF Symbols, font sizes, and masks? Combine them all to make fun masks!
- Just be sure to use the `.fill` variant of SF Symbols, so it’s filled in.
- You can also mask with `Text`! Use large, bold text — try `.fontWeight(.black)` for the thickest variation — so the image shows through the mask.
## <span style="color: #c2410c;">Border and Shadow</span>
```swift
.border(.black, width: 10)
```
- Lets you draw a border around any view, by choosing a colour and a stroke width.
- If you use it with a `RoundedRectangle()`, apply it *before* the `mask`.
```swift
.shadow(radius: 10)
```
- Adds a “drop shadow” to give a bit of 3-dimensional depth, depending on how much shadow radius you give.
## <span style="color: #c2410c;">Image Effects</span>
```swift
.saturation(3.0)
```
- Make your images greyscale (0) or extra-crispy (3.0), or anywhere in between!
```swift
.hueRotation(.degrees(90))
```
- Turns your image on the colour wheel. Make yourself into a hulk with this angle.
```swift
.brightness(0.3)
```
- Increase brightness (between 0 and 1) or invert colours (less than 0) on your image.
```swift
.opacity(0.5)
```
- 0 is transparent, 1 is fully opaque.
![image](/assets/track_sap/unit_01/image-025.png)
## <span style="color: #c2410c;">Alignment for Text</span>
```swift
.multilineTextAlignment(.center)
```
- Lets you align your text when there are multiple lines. Choose from .leading, .center, and .trailing.
- This is different from using the alignment: parameter in your VStack — that’s for aligning multiple Text Views within the stack.
---

# Unit 1.7: Task: Emoji Artwork App
What you’ll make on your own: an NFT-worthy piece of art, created using emojis and SF Symbols, using SwiftUI.
## What you need to do
- Use `Views` and `Images` (and emoji and SF Symbols) to create a piece of “framed” artwork.
- Make sure you include the name of your piece, and take a screenshot when you’re done.
- When done, take a screenshot of your piece and submit to your instructor.
- Nothing offensive or sensitive, please! Weird/funny thoroughly encouraged.
## Examples
![image](/assets/track_sap/unit_01/image-026.png)
Code: [https://gist.github.com/jiachenyee/725e623a28dda5dee540d85d32fe9ab2](https://gist.github.com/jiachenyee/725e623a28dda5dee540d85d32fe9ab2)

![image](/assets/track_sap/unit_01/image-027.png)
Code: [https://gist.github.com/jiachenyee/1baebd9282c70423af2336bee552dd0c](https://gist.github.com/jiachenyee/1baebd9282c70423af2336bee552dd0c)

![image](/assets/track_sap/unit_01/image-028.png)
![image](/assets/track_sap/unit_01/image-029.png)
![image](/assets/track_sap/unit_01/image-030.png)
![image](/assets/track_sap/unit_01/image-031.png)
![image](/assets/track_sap/unit_01/image-032.png)
---

# Unit 1.8: Drawing Paths
## Introducing Path
- Path is a `View`! Just like `Text`, `Image`, `Color`, `HStack`, `VStack`.
- Like `Color`, it tries to fill up as much space as possible
- Paths allow you to draw custom geometry, where your regular shapes (`Rectangle`, `Circle`, `Ellipse`, `Capsule`) just won’t suffice.
## Drawing a Square
- Start path
- Move point to (0, 0)
- Add line to (10, 0)
- Add line to (10, 10)
- Add line to (0, 10)
- Close path
- It’s similar to Python Turtle.
```swift
Path { path in
		//Jump to (0, 0) so the current point will be (0, 0)
    path.move(to: CGPoint(x: 0, y: 0))
    
    //Draw a line from the previous point (0, 0) to (10, 0) — and so on
    path.addLine(to: CGPoint(x: 10, y: 0))
    path.addLine(to: CGPoint(x: 10, y: 10))
    path.addLine(to: CGPoint(x: 0, y: 10))
    
    //Close the path by drawing a line back to the start point (0, 0)
    path.closeSubpath()
}
```
## Challenge 1: Draw a Triangle
![image](/assets/track_sap/unit_01/image-033.png)
### Answer:
```swift
Path { path in
    path.move(to: CGPoint(x: 50, y: 0))
    path.addLine(to: CGPoint(x: 100, y: 100))
    path.addLine(to: CGPoint(x: 0, y: 100))
    path.closeSubpath()
}
```
## Challenge 2: Draw a hexagon
![image](/assets/track_sap/unit_01/image-034.png)
### <span style="color: #b91c1c;">Answer:</span>
```swift
Path { path in
    path.move(to: CGPoint(x: 50, y: 0))
    path.addLine(to: CGPoint(x: 150, y: 0))
    path.addLine(to: CGPoint(x: 200, y: 100))
    path.addLine(to: CGPoint(x: 150, y: 200))
    path.addLine(to: CGPoint(x: 50, y: 200))
    path.addLine(to: CGPoint(x: 0, y: 100))
    path.closeSubpath()
}
```
## Styling Paths
### Fill:
```swift
.fill(Color.green)
```
- Use `Color.ColorName` to set a solid colour fill
- You can use `Color(red: 1, green: 0.5, blue: 0.5)` to create custom colours! The values are between 0 and 1.
### Outlining
- The `.stroke()` modifier will ***make your shape or path into an outline.***
- Note that your shape will have *no more fill* once you add a stroke.
- This is unlike the “Border” attribute in, say, Keynote, which *adds *a border to your shape.
- To let something have both a fill and a stroke, use a `ZStack` with the same shape.
### Stroke
```swift
.stroke(Color.green, lineWidth: 20)
```
- Use `Color.ColorName` to set a stroke or outline around your path or shape.
- Change the `lineWidth` to make the stroke thicker or thinner.
### Stroke with rizz
```swift
.stroke(.red, 
        style: StrokeStyle(lineWidth: 20, 
                           lineCap: .round, 
                           lineJoin: .round, 
                           dash: [20, 40]))
```
- Create dotted lines! Change the `dash` parameter to adjust how dotted the line is.
- Change the `lineCap` and `lineJoin` to adjust how rounded your line is.
## Challenge 3: 2 Squares
![image](/assets/track_sap/unit_01/image-035.png)
### <span style="color: #b91c1c;">Answer:</span>
```swift
Path { path in
    path.move(to: CGPoint(x: 0, y: 0))
    path.addLine(to: CGPoint(x: 100, y: 0))
    path.addLine(to: CGPoint(x: 100, y: 100))
    path.addLine(to: CGPoint(x: 0, y: 100))
    path.closeSubpath()
    
    path.move(to: CGPoint(x: 250, y: 0))
    path.addLine(to: CGPoint(x: 250, y: 100))
    path.addLine(to: CGPoint(x: 150, y: 100))
    path.addLine(to: CGPoint(x: 150, y: 0))
    path.closeSubpath()
}
```
## Challenge 4: TinkerTanker Logo
![image](/assets/track_sap/unit_01/image-036.png)
### <span style="color: #b91c1c;">Answer:</span>
```swift
ZStack {
    Circle()
        .size(CGSize(width: 300, height: 300))
        .fill(Color(red: 0.086, green: 0.086, blue: 0.094))
    
    // Head
    Path { path in
        path.move(to: CGPoint(x: 88, y: 37))
        path.addLine(to: CGPoint(x: 211, y: 37))
        path.addLine(to: CGPoint(x: 221, y: 148))
        path.addLine(to: CGPoint(x: 78, y: 148))
        path.closeSubpath()
    }
    .fill(.white)
    
    // Eyes
    Path { path in
        path.move(to: CGPoint(x: 103, y: 63))
        path.addLine(to: CGPoint(x: 136, y: 63))
        path.addLine(to: CGPoint(x: 136, y: 67))
        path.addLine(to: CGPoint(x: 163, y: 67))
        path.addLine(to: CGPoint(x: 163, y: 63))
        path.addLine(to: CGPoint(x: 196, y: 63))
        path.addLine(to: CGPoint(x: 196, y: 96))
        path.addLine(to: CGPoint(x: 163, y: 96))
        path.addLine(to: CGPoint(x: 163, y: 72))
        path.addLine(to: CGPoint(x: 136, y: 72))
        path.addLine(to: CGPoint(x: 136, y: 96))
        path.addLine(to: CGPoint(x: 103, y: 96))
        path.closeSubpath()
    }
    .fill(.black)
    
    // Body
    Path { path in
        path.move(to: CGPoint(x: 82, y: 156))
        path.addLine(to: CGPoint(x: 216, y: 156))
        path.addLine(to: CGPoint(x: 249, y: 300))
        path.addLine(to: CGPoint(x: 51, y: 300))
        path.closeSubpath()
    }
    .fill(.white)
    .mask {
        Circle()
            .size(CGSize(width: 300, height: 300))
    }
    
    // Tie
    Path { path in
        path.move(to: CGPoint(x: 150, y: 180))
        path.addLine(to: CGPoint(x: 165, y: 264))
        path.addLine(to: CGPoint(x: 150, y: 275))
        path.addLine(to: CGPoint(x: 135, y: 264))
        path.closeSubpath()
    }
    .fill(.red)
    
    // Right Arm
    Path { path in
        path.move(to: CGPoint(x: 60, y: 175))
        path.addLine(to: CGPoint(x: 32, y: 300))
        path.addLine(to: CGPoint(x: 0, y: 300))
        path.closeSubpath()
    }
    .fill(.white)
    .mask {
        Circle()
            .size(CGSize(width: 300, height: 300))
    }
    
    // Left Arm
    Path { path in
        path.move(to: CGPoint(x: 240, y: 175))
        path.addLine(to: CGPoint(x: 268, y: 300))
        path.addLine(to: CGPoint(x: 300, y: 300))
        path.closeSubpath()
    }
    .fill(.white)
    .mask {
        Circle()
            .size(CGSize(width: 300, height: 300))
    }
}
```
## Challenge 5: Draw something of your own! If you want to try drawing curves, look at the [example in this tutorial](https://www.hackingwithswift.com/quick-start/swiftui/how-to-use-uibezierpath-and-cgpath-in-swiftui).