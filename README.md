# swift-slides: Tinkercademy Swift Explorer Slides website

Tinkercademy Swift Explorer Slides website, rewritten in React.js (after previously being written in plain HTML/CSS/JS)!

## Introduction

### Installation

- Ensure you have [Node.JS](https://nodejs.org) and [Bun](https://www.npmjs.com/package/bun) installed.
- Run the development server with Bun (npm works too technically but less cool🤓)
```
cd swift-slides
bun install
bun run dev
```

### Motivation

This `README.md` file aims to onboard future maintainers of the `swift-slides` repository, which refer to 2 groups of people, please read the required sections in FULL before making changes to the codebase. Thank you!
- Lesson content developers: Read [Updating Lesson Content](#updating-lesson-content)
- Codebase maintainers: Read everything!

## Updating Lesson Content

You may need to do the following while updating lesson content <!-- rephrase -->
1. Addding a new track/unit
2. Adding/modifying slides
3. Adding media to slides

### Adding New Track/Unit



## Understanding the Codebase Structure

Future codebase maintainers should have at least basic understanding of the following technologies (except Reveal.js). The following sections will seek to lay out the structure and coding practices of the codebase to ensure uniformity.

Tech stack:
- Written in [React](https://react.dev/) with [Next.js](https://nextjs.org/).
- Styled with [Sass](https://sass-lang.com/).
- Slides ported over from Keynote and presented with [Reveal.js](https://revealjs.com/).

### Structure

As this is a Next.js project, we follow the typical structure of a Next.js 15 App Router project.

```
swift-slides/
├── src/
│   ├── app/
│   │   ├── tracks/
│   │   │   ├── [trackId]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── page.module.scss
│   │   ├── _colors.scss
│   ├── components/
│   │   ├── navigator/
│   │   │   ├── index.tsx
│   │   │   ├── styles.module.scss
│   ├── context/
│   │   ├── ThemeContext.tsx
│   ├── data/
│   │   ├── curriculum/
│   ├── pages/
│   │   ├── _app.tsx
│   ├── styles/
│   │   ├── globals.scss
│   ├── utils/
│   │   ├── helpers.ts
```

### Reveal.js (imported in a Client component)

Reveal.js is used to present slides. It is imported in a client component to ensure compatibility with Next.js's server-side rendering (SSR). 

#### Client Components
Client components are used for interactive parts of the application. They are rendered on the client side and can use hooks like `useState` and `useEffect`.

#### Server Components
Server components are rendered on the server side. They are used for static content and can fetch data during the build process.

#### Non-SSR Components
Non-SSR components are components that should not be server-side rendered. They are typically used for third-party libraries that do not support SSR.

### Styles

Styles are written in [Sass](https://sass-lang.com/), with `.scss` files, which is seamlessly cross compatible with all versions of normal `.css` files. CSS modules are used for component-based styles, and global CSS files are used mainly for theming and Reveal.js styles.

### Colors

All colors are defined in `app/_colors.scss`. 

Some legacy code may reference colors not defined in `_colors.scss`. In such cases, update the legacy code to use the colors defined in `_colors.scss`.

### Themes

The application supports light and dark themes. Theme is managed by the `useDarkMode` hook and a class is passed to the `<body>` tag via a `ThemeManager` wrapper.