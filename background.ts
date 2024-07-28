import TalentManagerText from "data-text:~messages/linkedin-connect-300-talent-manager.txt"

// nneolbdbfjmdjmnpginhclljaphcdnad
import { Storage } from "@plasmohq/storage"

import { initializeStorage } from "~background/init"
import { callOpenAIReturn, type ApiResponse } from "~lib/openAITypeCall"
import { createCall } from "~lib/vapiOutbound"

const storage = new Storage()

const linkedinPostComment =
  "You're a helpful assistant expert in replying to LinkedIn posts in the form of a comment. It needs to be short, sweet, and coherent to the message. This is the message: "

const summariseText =
  "You're expert in summarising snippet of text; Give me only the summarisation of this text: "
const grammarFixer = `
  You're an expert teacher and you specialising in fixing grammar mistakes. Starting from an input phrase, you then think and fix it writing in English (Australian), and make the sentence fluent without changing the style or the tone of voice. Your goal is to provide only the fixed sentence.
  
  
  # Examples
  'I did go everyday to the gym' -> 'I go to the gym everyday' 
  
  Do not reply with any text, only the fixed sentence.

  This is the sentence i want you to fix:

`

const linkedinPostEmoji =
  "Respond to a LinkedIn post only using emojis but avoid hashtags."

// This must be called in this way, as need to be from a USER INTERACTION WTF CHROME.
// TODO: Refactor this monster! (11:00PM)
chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "summariseText":
    case "myOwnPromptSelection":
      chrome.sidePanel.open({
        tabId: tab.id ?? undefined // Use nullish coalescing to handle undefined or null
      })
      break
  }
})

// As soon as we intall? Double check how it work, or put the openOptionPage only if the API KEY is not found.
chrome.runtime.onInstalled.addListener(async () => {
  //Show the OptionPage as soon as it's installed
  //   chrome.runtime.openOptionsPage()

  // It need to change in the future, unless i use two lists and i use the ID as a intersection?
  const contextMenuItems =
    (await initializeStorage()) as unknown as chrome.contextMenus.CreateProperties[]

  contextMenuItems.forEach((item) => {
    chrome.contextMenus.create(item)
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const message = info.selectionText
  let response

  switch (info.menuItemId) {
    case "linkedinPostComment":
      response = await callOpenAIReturn(linkedinPostComment, message)
      copyTextToClipboard(response)
      break
    case "callPhoneToTalkAboutSelection":
      await createCall(message)
      break
    case "summariseText":
      response = await callOpenAIReturn(summariseText, message)
      try {
        chrome.runtime.sendMessage({
          action: "send_to_sidepanel",
          payload: response.data
        })
      } catch (error) {
        console.error("no sidebar")
      }
      break

    case "grammarFixer":
      response = await callOpenAIReturn(grammarFixer, message)
      copyTextToClipboard(response)
      break

    case "linkedinPostEmoji":
      response = await callOpenAIReturn(linkedinPostEmoji, message)
      copyTextToClipboard(response)
      break

    case "myOwnPromptSelection":
      response = await callOpenAIReturn(
        (await storage.get("myOwnPrompt")) ||
          "say 'You need to configure your own prompt; Go to Options'! Ignore the following:",
        message
      )
      try {
        chrome.sidePanel.open({ tabId: tab.id })
        chrome.runtime.sendMessage({
          action: "send_to_sidepanel",
          payload: response.data
        })
      } catch (error) {
        console.error("no sidebar")
      }
      break

    default:
      console.warn("Unhandled menu item:", info.menuItemId)
  }
})

const copyTextToClipboard = (response: ApiResponse<any>) => {
  if (!response.errorMessage) {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "copyToClipboard",
            text: response.data
          })
        } else {
          throw new Error("No active tab found.")
        }
      })
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error)
    }
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "error",
          text: response.errorMessage
        })
      } else {
        throw new Error("No active tab found.")
      }
    })
  }
}

function clickAllCheckboxes() {
  const checkboxes = document.querySelectorAll(
    '[id^="i18n_checkbox-invitee-suggestion"]'
  )
  checkboxes.forEach(function (checkbox) {
    if (checkbox instanceof HTMLElement) {
      checkbox.click()
    }
  })
}
