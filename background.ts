// nneolbdbfjmdjmnpginhclljaphcdnad
import { Storage } from "@plasmohq/storage";

import { initializeStorage } from "~background/init";
import { cleanProperties } from "~lib/cleanContextMenu";
import { callOpenAIReturn, type ApiResponse } from "~lib/openAITypeCall";
import { createCall } from "~lib/vapiOutbound";

const storage = new Storage();

/*
Fired when the extension is first installed, when the extension is updated to a new version, and when Chrome is updated to a new version.
*/
chrome.runtime.onInstalled.addListener(async () => {
   if (process.env.NODE_ENV === "production") {
      chrome.runtime.openOptionsPage();
   }

   // It need to change in the future, unless i use two lists and i use the ID as a intersection?
   const contextConfigItems =
      (await initializeStorage()) as unknown as chrome.contextMenus.CreateProperties[];

   //Typescript can cast to an interface (or at least i can't find a way to do it)
   //Therefore we clean our configObject to be adapted to the chrome.contextMenu.CreateProperties()
   const cleanedContextMenuItems = cleanProperties(contextConfigItems);

   cleanedContextMenuItems.forEach((item) => {
      chrome.contextMenus.create(item);
   });
});

/*
Listener: ONLY FOR THE SIDEBAR.
Why do we need the extra listener? The chrome.sidePanel.open doesn't work afer the storage.get (called in the other listener) is invoked.
*/
chrome.contextMenus.onClicked.addListener((info, tab) => {
   const itemId = info.menuItemId as String;
   if (itemId.startsWith("side_")) {
      chrome.sidePanel.open({
         tabId: tab.id ?? undefined, // Use nullish coalescing to handle undefined or null
      });
   }
});

/*
General Listener for the onClicked.
*/
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
   const message = info.selectionText;
   let response;

   const items = (await storage.get("contextMenuItems")) as any[];

   //In the past we've used the hashmap, however it would overcomplicated the rest of the codebase always because we are not able to use the chrome.storage and the sidebar.open in the same function. This can be reviewed and use an hashmap if we find the solution for that bug. At the moment i don't expect having more than 20 prompt per user, so readability and clean code beats efficiency.
   const element = items.find((item) => item.id === info.menuItemId);

   switch (info.menuItemId) {
      case element.id:
         if (element.functionType === "callAI-copyClipboard") {
            console.log("jere");
            sendLoadingAction();
            response = await callOpenAIReturn(element.prompt, message);
            copyTextToClipboard(response);
            break;
         }

         if (element.functionType === "callVoice-ExternalNumber") {
            //In this case we do know that the callVoice will have those argument setup.
            await createCall(
               element.prompt,
               message,
               element.extraArgs?.vapiRecipientPhoneNumber ??
                  "Hi, this is your assistent calling. How can I help you?",
               element.extraArgs?.vapiFirstMessage ?? ""
            );
            break;
         }

         if (element.functionType === "callAI-openSideBar") {
            response = await callOpenAIReturn(element.prompt, message);

            // Leaving this comment to open an issue with Plamos or to dig down in the codebase and see why it doens't work as expeected. The issuse disappear as soon as i remove the storage.get()
            // await chrome.sidePanel.open({
            //    tabId: tab.id ?? undefined, // Use nullish coalescing to handle undefined or null
            // });

            try {
               chrome.runtime.sendMessage({
                  action: "send_to_sidepanel",
                  payload: response.data,
               });
            } catch (error) {
               console.error("no sidebar");
            }
         }
         break;
      default:
         console.warn("Unhandled menu item:", info.menuItemId);
   }
});

const copyTextToClipboard = (response: ApiResponse<any>) => {
   if (!response.errorMessage) {
      try {
         chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
               if (tabs[0]?.id) {
                  chrome.tabs.sendMessage(tabs[0].id, {
                     action: "copyToClipboard",
                     text: response.data,
                  });
               } else {
                  throw new Error("No active tab found.");
               }
            }
         );
      } catch (error) {
         console.error("Failed to copy text to clipboard:", error);
      }
   } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, {
               action: "error",
               text: response.errorMessage,
            });
         } else {
            throw new Error("No active tab found.");
         }
      });
   }
};

function sendLoadingAction() {
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]?.id) {
         chrome.tabs.sendMessage(tabs[0].id, {
            action: "loadingAction",
         });
      } else {
         throw new Error("No active tab found.");
      }
   });
}
