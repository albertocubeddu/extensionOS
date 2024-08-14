
export const chromeContextsParameters = [
    {
        key: "selection",
        display: "Selection",
        description: "This context is used when there is selected text on the web page. The menu item will appear when right-clicking on the selected text."
    }
]

//To explore in the future, at the moment we don't have a use-case
export const chromeContextsParametersAdvancedUser = [
    {
        key: "all",
        display: "All",
        description: "This context is a combination of all other contexts except for 'launcher'. It means the menu item will be available in every possible context."
    },
    {
        key: "page",
        display: "Page",
        description: "This context refers to the entire web page. The menu item will appear when right-clicking anywhere on the page that does not fall into other specific contexts (e.g., not on a link, image, or selected text)."
    },
    {
        key: "frame",
        display: "Frame",
        description: "This context applies to iframes (inline frames) within a web page. The menu item will appear when right-clicking inside an iframe."
    },
    {
        key: "selection",
        display: "Selection",
        description: "This context is used when there is selected text on the web page. The menu item will appear when right-clicking on the selected text."
    },
    {
        key: "link",
        display: "Link",
        description: "This context refers to hyperlinks. The menu item will appear when right-clicking on a link."
    },
    {
        key: "editable",
        display: "Editable",
        description: "This context is used for editable elements, such as text input fields or contenteditable areas. The menu item will appear when right-clicking inside an editable field."
    },
    {
        key: "image",
        display: "Image",
        description: "This context applies to images on a web page. The menu item will appear when right-clicking on an image."
    },
    {
        key: "video",
        display: "Video",
        description: "This context is used for video elements. The menu item will appear when right-clicking on a video."
    },
    {
        key: "audio",
        display: "Audio",
        description: "This context refers to audio elements. The menu item will appear when right-clicking on an audio element."
    },
    {
        key: "launcher",
        display: "Launcher",
        description: "This context is only supported by apps and is used to add menu items to the context menu that appears when clicking the app icon in the launcher/taskbar/dock/etc. Different platforms might have limitations on what is supported in a launcher context menu."
    },
    {
        key: "browser_action",
        display: "Browser Action",
        description: "This context applies to the browser action button (typically shown in the browser's toolbar). The menu item will appear when right-clicking on the browser action button."
    },
    {
        key: "page_action",
        display: "Page Action",
        description: "This context is used for page action buttons (usually shown in the address bar). The menu item will appear when right-clicking on the page action button."
    },
    {
        key: "action",
        display: "Action",
        description: "This context is a generic action that can apply to different extension actions, potentially including both browser actions and page actions. The menu item will appear when interacting with these action elements."
    }
];
