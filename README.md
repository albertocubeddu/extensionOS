# Extension | OS

Imagine a world where every user has access to powerful large language models (LLMs) directly within their web browser. By integrating LLMs into everyday internet browsing, we can revolutionise the way people interact with information online, providing them with instant, intelligent assistance tailored to their needs.

Welcome to Extension | OS

## 📸 Screenshots

Select and right-click—it's that easy!
![action](./assets/showcase/action.png)

Pick your favorite provider and select the model that excites you the most.
![LLM Selector](./assets/showcase/llmSelector.png)

Customize your look and feel, and unleash your creativity with your own prompts!
![Prompt Factory](./assets/showcase/promptFactory.png)

Mixture of Agents (pre-release)
![Mixture Of Agents](./assets/showcase/moa.png)

## 🚀 Getting started

1. Clone the extension or [download the latest release](https://github.com/albertocubeddu/extensionOS/releases/).
2. Open the Chrome browser and navigate to [chrome://extensions](chrome://extensions).
3. Enable the developer mode by clicking the toggle switch in the top right corner of the page.
4. Unpack/Unzip the `chrome-mv3-prod.zip`
5. Click on the "Load unpacked" button and select the folder you just unzipped.
6. The options page automatically opens, insert your API keys.

## ✨ Features

-  **Seamless Integration**: Effortlessly access any LLM model directly from your favorite website.
-  **Secure Storage**: Your API key is securely stored in the browser's local storage, ensuring it never leaves your device.
-  **Customizable Prompts**: Tailor your prompts to suit your needs.
-  **[Beta] Mixture of Agents**: Experience the innovative Mixture Of Agents feature.

## Why

On the morning of July 27th, 2024, I began an exciting journey by joining the SF Hackathon x Build Club. After months of refining the concept in my mind, I decided it was time to bring it to life. I worked on enhancing my idea, updating what I had already created, and empowering everyone to unleash their creativity with custom prompts.

### Data - Awareness

All your data is stored locally on your hard drive.

#### MAC OSX

`/Users/<your-username>/Library/Application Support/Google/Chrome/Default/Sync Extension Settings/`

## To-Do List

### Urgent & Important

-  **Prompt Factory**: Add the ability to edit a single prompt.
-  **Logging**: Determine a location to store log files.
-  **MoA**: Implement this feature.

### Urgent, Not Important

-  **Prompt Factory**: Add the ability to create custom prompts.
-  Add the ability to chat within the browser.
-  Encryption of keys : They are stored locally, nonetheless being my first chrome extension i need to research more about how this can be accessed.

### Important, Not Urgent

-  UI for the Prompt Factory is not intuitive and the "save all" button UX is cr@p.
-  The sidebar API doesn't work after the storage API is called (User Interaction must be done)
-  Move files to a `/src` folder to improve organization.
-  Strategically organize the codebase structure.
-  Perfect the README documentation.
-  Evaluate the necessity of `executeScript`.
-  Decide on a package manager: npm, pnpm, or yarn.
-  Investigate if Playwright supports Chrome extension testing.

### Not Urgent, Not Important

-  **Prompt Factory**: Add the ability to build workflows.
-  **Prompt Factory**: Add the option to select which LLM to use for each prompt.

# Presentation Video

[![Video Title](https://img.youtube.com/vi/dM1BOxVoebg/0.jpg)](https://www.youtube.com/watch?v=dM1BOxVoebg)

## Footage

-  [Olena from Pixabay](https://pixabay.com/users/olenchic-16658974/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=218486)

-  [NickyPe from Pixabay](https://pixabay.com/users/nickype-10327513/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=161402)

## Music

-  https://suno.com/song/f14541af-c853-4c22-b0b7-9000194fc9c6

## Voices

-  ElevenLabs

# Special Thanks

-  Build Club -> Hackaton Organiser
-  Leonardo.ai -> Icon generated with the phoenix model
-  Canva -> The other images not generated with AI
-  ShadCn -> All the UI?
-  Plasmo -> The Framework
-  Groq -> Extra credits

# Changelog

0.0.3 (not-release / under-development)

-  Changed the datastructure to achieve a clearer and more abstract way to call functions
-  Function to clean the datastructure to adapt to chrome.contextMenus.CreateProperties
-  use "side\_" as hack to open the sidebar. WHY: The sidebar.open doesn't work after we call the storage.get
-  Allowing to change the default prompts
-  chrome.runtime.openOptionsPage() opens only in production environment (onInstalled)
-  Improved UI

   0.0.2

-  How to install and start polishing the repository

   0.0.1

-  Check the demo video
