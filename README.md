# AI Portfolio Builder

> An AI-powered application that generates a modern, professional portfolio website from a user's resume or LinkedIn profile. It includes a secure admin panel for easy content updates and allows users to download their portfolio as a self-contained static website.

This project demonstrates the power of generative AI (Google Gemini) combined with a modern frontend stack (React, TypeScript) to create a dynamic, user-friendly tool for professionals.

## ✨ Features

-   **AI-Powered Content Generation**: Utilizes the Google Gemini API to parse unstructured resume text and generate a structured, professional portfolio.
-   **Structured JSON Output**: Enforces a strict JSON schema for the AI's response, ensuring data consistency and reliability.
-   **Live Portfolio Preview**: Instantly renders a fully responsive and interactive portfolio website based on the generated data.
-   **Comprehensive Admin Dashboard**: A client-side admin panel allows for granular control over every piece of portfolio data, from personal details to project entries.
-   **Image Uploads**: Supports uploading a profile picture and project images directly in the admin panel, with live previews.
-   **Contact Form**: Includes a functional contact form that saves messages to the browser's `localStorage` for review in the admin panel.
-   **Static Site Export**: Users can download their complete portfolio as a `.zip` file containing a self-contained `index.html` and a `README.md` with deployment instructions.
-   **Deployment Guide**: A helpful modal provides step-by-step instructions on how to host the downloaded static site for free on platforms like GitHub Pages.
-   **Modern UI/UX**: Features a clean, modern design with smooth animations, a dark mode, and a focus on accessibility.

## 🛠️ Tech Stack

-   **Frontend Framework**: [React](https://reactjs.org/) (v19)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Generative AI**: [Google Gemini API](https://ai.google.dev/) via the [`@google/genai`](https://www.npmjs.com/package/@google/genai) SDK.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (loaded via CDN).
-   **State Management**: React Context API.
-   **Client-Side Archiving**: [JSZip](https://stuk.github.io/jszip/) for creating the `.zip` file.
-   **Client-Side File Saving**: [FileSaver.js](https://github.com/eligrey/FileSaver.js/) to trigger the download.
-   **Module Loading**: Native ES Modules with [`importmap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) (No build step).

## 🚀 Getting Started

This project is designed to run directly in a modern browser without a complex build process.

### Prerequisites

1.  A modern web browser with support for `importmap` (e.g., Chrome, Firefox, Edge, Safari).
2.  A local web server. The [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code is a great choice.
3.  A **Google Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

This application is configured to run in an environment where the Gemini API key is available as `process.env.API_KEY`. To run this project locally, you must provide this environment variable.

1.  **Download the Files**: Download or clone all the project files to a local directory.
2.  **Provide the API Key**: The application's Gemini service (`services/geminiService.ts`) expects `process.env.API_KEY`. Since browsers don't have `process.env`, you must use a development server that can substitute this variable or manually make it available to the browser.
    
    A simple method for local development:
    - Create a file named `env.js` in the root directory:
      ```javascript
      // env.js
      window.process = {
        env: {
          API_KEY: 'YOUR_GEMINI_API_KEY_HERE'
        }
      };
      ```
      Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key.
    - Add this script to `index.html` **before** the importmap script tag:
      ```html
      <script src="env.js"></script>
      ```
    - *Note: This method is for development purposes only. Do not expose your API key in client-side code in a production application.*

3.  **Start a Local Server**: Open the project directory in your code editor (like VS Code) and start your local server. If using the Live Server extension, just click "Go Live" in the bottom-right corner.
4.  **Open in Browser**: The application should now be running on your local server (e.g., `http://127.0.0.1:5500`).

## 🔧 How It Works

The application flow is entirely client-side:

1.  **Input**: The user pastes their resume or LinkedIn profile text into a textarea.
2.  **AI Generation**: The text is sent to the Gemini API with a detailed prompt and a `responseSchema`. The prompt instructs the AI to act as a career coach and extract information into specific fields. The `responseSchema` forces the AI to return a valid JSON object that matches the application's `PortfolioData` type.
3.  **State Hydration**: The returned JSON data is used to set the state in `PortfolioContext`.
4.  **Rendering**: React components consume the data from `PortfolioContext` to render the portfolio sections.
5.  **Admin Editing**: The admin dashboard reads from and writes to the `PortfolioContext`, allowing the user to modify the AI-generated content, upload images (which are converted to Base64), and view contact messages (from `localStorage`).
6.  **Static Export**: The "Download" feature uses `ReactDOMServer.renderToStaticMarkup` to create an HTML string of the current portfolio state. This HTML is embedded in a template, zipped up with `JSZip`, and downloaded using `FileSaver.js`.

## 💡 Technical Interview Q&A

Here are some potential technical questions about this project's architecture and implementation.

#### Q1: How does the application ensure the AI returns data in the correct format?

**Answer:** The key is using the `responseSchema` configuration option in the Gemini API call. We define a detailed schema that mirrors our TypeScript `PortfolioData` interface, specifying the type for each field (e.g., `STRING`, `NUMBER`, `ARRAY`, `OBJECT`) and which fields are required. By setting `responseMimeType` to `"application/json"` and providing this schema, we instruct the Gemini model to format its output as a JSON object that strictly adheres to our defined structure. This is far more reliable than just asking for JSON in the text prompt, as it leverages the model's built-in capabilities for structured data generation.

---

#### Q2: Explain the state management approach. Why was React Context chosen over other solutions like Redux?

**Answer:** The application uses React's built-in Context API for state management, with two main providers:
-   `PortfolioProvider`: Holds the entire `portfolioData` object. This is global state that is needed by almost every component in the portfolio view and the admin dashboard.
-   `AuthProvider`: Manages a simple boolean `isAdmin` flag to control access to the admin dashboard.

React Context was the ideal choice here because the application's state, while global, is not overly complex. There are few high-frequency updates. Context provides a clean, native way to pass this data down the component tree without prop-drilling, avoiding the boilerplate and conceptual overhead that can come with a more robust library like Redux. For an application of this scale, Redux would be an over-engineering.

---

#### Q3: How does the "Download as .ZIP" feature work entirely on the client-side?

**Answer:** This feature is a great example of leveraging powerful browser APIs and JavaScript libraries to perform tasks traditionally handled by a server. The process is:
1.  **Server-Side Rendering... in the Browser**: We use the `react-dom/server` library's `renderToStaticMarkup` function. This function takes a React component tree and renders it to a non-interactive HTML string, which is perfect for a static export.
2.  **HTML Templating**: The generated HTML string is injected into a complete HTML document template that includes the necessary `<head>` tags, Tailwind CSS CDN link, and a simple vanilla JS script for smooth scrolling.
3.  **In-Memory Archiving**: The `JSZip` library is used to create a new `.zip` archive in the browser's memory. We add the complete `index.html` string as a file and also add a `README.md` file with deployment instructions.
4.  **Triggering the Download**: Finally, `JSZip` generates the archive as a `Blob`. We pass this blob to the `FileSaver.js` library's `saveAs` function, which triggers a browser download dialog for the user, allowing them to save the `portfolio.zip` file to their machine.

---

#### Q4: This project uses an `importmap` and no build tools like Webpack or Vite. What are the pros and cons of this approach?

**Answer:** This is a buildless development approach that relies on modern browser features.
-   **Pros**:
    -   **Simplicity & Speed**: There is zero build configuration. You can start coding immediately. It's incredibly fast for local development as there's no bundling or transpilation step.
    -   **Easy to Understand**: The file structure directly maps to what the browser loads. It's great for smaller projects and for learning, as it removes a layer of abstraction.
    -   **Leverages the Platform**: It uses the browser's native module loader, which is highly optimized.
-   **Cons**:
    -   **No Transpilation**: The code runs as-is. This means we cannot use JSX or TypeScript directly, as browsers don't understand them. The environment this app is designed for must handle this transpilation implicitly. For a standard setup, this would be a major blocker without a tool like Babel.
    -   **No Bundling**: The browser makes separate HTTP requests for each imported module. While HTTP/2 mitigates this, it can still be less performant for very large applications compared to a single bundled file.
    -   **Limited Optimizations**: We miss out on optimizations like tree-shaking (removing unused code), minification, and CSS pre-processing that build tools provide.
    -   **Dependency Management**: Managing dependencies through CDN links in an `importmap` is less robust than using a package manager like npm or yarn.

This approach is excellent for rapid prototyping and small-to-medium-sized projects but lacks the robustness and optimization features required for large-scale, production applications.

---

#### Q5: How are user-uploaded images handled and stored? What are the limitations of this method?

**Answer:** Images are handled entirely on the client-side using the `FileReader` API.
1.  When a user selects an image file through an `<input type="file">`, we get access to the file object.
2.  We create a `new FileReader()` and call `reader.readAsDataURL(file)`.
3.  This reads the binary image data and encodes it into a **Base64 string**, which is a text representation of the image.
4.  This Base64 data URL (e.g., `data:image/png;base64,iVBORw0KGgo...`) is then stored directly in the React state (within the `portfolioData` object).
5.  The `<img src="...">` tag can then use this data URL directly to display the image.

**Limitations**:
-   **Increased Size**: Base64 encoding increases the file size by about 33%. Storing this large string in the React state can make the state object very large, potentially slowing down re-renders and increasing memory usage.
-   **No Persistence**: The image data is stored in the client's state and is lost as soon as the user refreshes the page. There is no long-term storage.
-   **Static Export**: When the portfolio is downloaded, the Base64 string is embedded directly into the `<img>` tag's `src` attribute in the final `index.html`. This makes the HTML file much larger but also self-contained. It is not suitable for high-resolution images or a large number of images.
