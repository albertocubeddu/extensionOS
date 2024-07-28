import { Storage } from "@plasmohq/storage"

const storage = new Storage()

//This will allow us to do setter/getter for dynamic function.
export async function initializeStorage() {
  //   https://unicode-table.com/

  //   Check if we already have something memorised;
  // TODO: CHECK THIS TRIPLE, it was already late at night!
  const initState = await storage.get("contextMenuItems")

  if (initState) {
    console.log(initState)
    return initState
  }

  const contextMenuItems: chrome.contextMenus.CreateProperties[] = [
    {
      title: "💬 Comment Post",
      contexts: ["selection"],
      id: "linkedinPostComment"
    },
    {
      title: "❗Grammar Fixer",
      contexts: ["selection"],
      id: "grammarFixer"
    },
    {
      title: "🔥 Summarise Text",
      contexts: ["selection"],
      id: "summariseText"
    },
    {
      title: "📱 Let's Talk about this",
      contexts: ["selection"],
      id: "callPhoneToTalkAboutSelection"
    },
    {
      type: "separator",
      contexts: ["all"],
      id: "separator1"
    },
    {
      title: "Comment using only Emoji",
      contexts: ["selection"],
      id: "linkedinPostEmoji"
    },
    {
      type: "separator",
      contexts: ["all"],
      id: "separator2"
    },
    {
      title: "Your Prompt",
      contexts: ["selection"],
      id: "myOwnPromptSelection"
    }
  ]
  await storage.set("contextMenuItems", contextMenuItems)
  return await storage.get("contextMenuItems")
}
