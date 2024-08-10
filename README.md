# Extension | OS

![logo](./assets/presentation.png)

Welcome to Extension | OS: AI at Your Fingertips, Anytime, Anywhere.

Imagine a world where every user has access to powerful models (LLMs and more) directly within their web browser. By integrating AI into everyday internet browsing, we can revolutionise the way people interact with information online, providing them with instant, intelligent assistance tailored to their needs.

## 📸 Screenshots

Select, right-click and selecte the functionality—it's that easy!
![action](./assets/showcase/action.png)

Pick your favorite provider and select the model that excites you the most.
![LLM Selector](./assets/showcase/llmSelector.png)

Customize your look and feel, and unleash your creativity with your own prompts!
![Prompt Factory](./assets/showcase/promptFactory.png)

Mixture of Agents (pre-release)
![Mixture Of Agents](./assets/showcase/moa.png)

## Help me grow this extension

Use my affiliation code when you sign-up on VAPI: https://vapi.ai/?aff=extension-os

## 🚀 Getting started

1. Clone the extension or [download the latest release](https://github.com/albertocubeddu/extensionOS/releases/).
2. Open the Chrome browser and navigate to [chrome://extensions](chrome://extensions).
3. Enable the developer mode by clicking the toggle switch in the top right corner of the page.
4. Unpack/Unzip the `chrome-mv3-prod.zip`
5. Click on the "Load unpacked" button and select the folder you just unzipped.
6. The options page automatically opens, insert your API keys.

## ✨ Features

-  **Prompt Factory**: Effortlessly Tailor Every Prompt to Your Needs with Our Standard Installation.
-  **Prompt Factory**: Choose the Functionality for Every Prompt: From Copy-Pasting to Opening a New Sidebar.
-  **Seamless Integration**: Effortlessly access any LLM model directly from your favorite website.
-  **Secure Storage**: Your API key is securely stored in the browser's local storage, ensuring it never leaves your device.
-  **[Beta] Mixture of Agents**: Experience the innovative Mixture Of Agents feature.

## Why

On the morning of July 27th, 2024, I began an exciting journey by joining the SF Hackathon x Build Club. After months of refining the concept in my mind, I decided it was time to bring it to life. I worked on enhancing my idea, updating what I had already created, and empowering everyone to unleash their creativity with custom prompts.

### Data - Awareness

All your data is stored locally on your hard drive.

#### MAC OSX

`/Users/<your-username>/Library/Application Support/Google/Chrome/Default/Sync Extension Settings/`

## To-Do List

Move it somewhere else ASAP:

-  https://github.com/rowyio/roadmap?tab=readme-ov-file#step-1-setup-backend-template
-  https://canny.io
-  https://sleekplan.com/

### Urgent & Important

-  [ ] **Logging**: Determine a location to store log files.

### Urgent, Not Important

-  [ ] **Prompt Factory**: Add the ability to create custom prompts.
-  [ ] Add the ability to chat within the browser.
-  [ ] Encryption of keys : They are stored locally, nonetheless being my first chrome extension i need to research more about how this can be accessed.
-  [ ] Automated Testing
-  [ ] Investigate if Playwright supports Chrome extension testing.
-  [ ] Automated Tagging / Release
-  [ ] Locale

### Important, Not Urgent

-  [ ] UI for the Prompt Factory is not intuitive and the "save all" button UX is cr@p.
-  [ ] The sidebar API doesn't work after the storage API is called (User Interaction must be done)
-  [ ] Move files to a `/src` folder to improve organization.
-  [ ] Strategically organize the codebase structure.
-  [ ] Decide on a package manager: npm, pnpm, or yarn.

### Not Urgent, Not Important

-  [ ] Workflow to update the models automatically.
-  [ ] **Prompt Factory**: Add the ability to build workflows.
-  [ ] **Prompt Factory**: Add the option to select which LLM to use for each prompt.
-  [ ] Remove all the silly comments, maybe one day....

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
-  Icons -> icons8

# Changelog

### 0.0.11 (Not released to the public)
- General: Introduced a FREE Tier for users to explore the Extension | OS without needing to understand API Keys.
- Development: Implemented the CRX Public Key to maintain a consistent extension ID across re-installations during development.
- Development: Integrated OAUTH for user authentication when accessing the FREE tier.
- Permissions: Added identity permissions to facilitate user identity retrieval.
- Showcase: Updated images for improved visual presentation.
- Prompt Factory: Set Extension | OS as the default model, enabling users to utilize the extension without prior knowledge of API Key setup.


### 0.0.10

-  Context Menu: Added a new right-click option for seamless access to configuration settings.
-  Context Menu: Improved the layout and organization of the context menu for enhanced user experience.
-  Prompt Factory: Introduced a comprehensive sheet that details the context and functionality of each feature.
-  Prompt Factory: Implemented a clickable icon to indicate that the tooltip contains additional information when clicked.

### 0.0.9

-  Bug fixes
-  Clean up codebase
-  UX for the functionality improved

### 0.0.8

-  Removed an unnecessary dependency to comply with Chrome Store publication guidelines.
-  Introduced a new icon.
-  Implemented a loading state.
-  Fixed an issue where Reddit visibility was broken.

### 0.0.7

-  Adding missing models from together.ai
-  Adding missing models from groq
-  Updated About page
-  **MoA**: Add the ability to use a custom prompt.

### 0.0.6

-  Popup: UI revamped
-  Popup: New Presentation image and slogan
-  Options: Unified fonts
-  Options: Minor UI updates
-  Content: Better error handling and UX (user get redireted to the option page when the API key is missing)
-  Fix for together.ai (it was using a non-chat model)

## 0.0.5

-  Vapi affilation link (help me maintain this extension, sign up with the link)
-  Vapi Enhancements: Prompts now support selecting a specific phone number to call.
-  Vapi Enhancements: Prompts can now include a custom initial message for the conversation.
-  Vapi Enhancements: Now every prompt can be customised using the
-  UI: Section for specific configurations

##0.0.4

-  Hotfix: declarativeNetRequest was intercepting every localhost request.

## 0.0.3

-  Added github branch protection.
-  Changed the datastructure to achieve a clearer and more abstract way to call functions
-  Function to clean the datastructure to adapt to chrome.contextMenus.CreateProperties
-  use "side\_" as hack to open the sidebar. WHY: The sidebar.open doesn't work after we call the storage.get
-  Allowing to change the default prompts
-  chrome.runtime.openOptionsPage() opens only in production environment (onInstalled)
-  Improved UI (switched to dark theme)
-  Allowing to change the functionality; The "side\_" bug is annoying as it is over complicating the codebase.

## 0.0.2

-  How to install and start polishing the repository

## 0.0.1

-  Check the demo video
