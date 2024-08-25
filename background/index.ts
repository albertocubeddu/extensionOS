// nneolbdbfjmdjmnpginhclljaphcdnad
import { sendToBackground } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";

import { initializeStorage } from "~background/init";
import { cleanProperties } from "~lib/cleanContextMenu";
import { callOpenAIReturn, type ApiResponse } from "~lib/openAITypeCall";
import { createCall } from "~lib/vapiOutbound";
// Importing the handler and renaming it to openOptionPage
import openOptionPage, {
   openOptionsPageHandler,
} from "./messages/openOptionPage"; // Fixed import path
import sendLoadingAction, {
   sendLoadingActionHandler,
} from "./messages/sendLoadingAction";
import copyTextToClipboard, {
   copyTextToClipboardHandler,
} from "./messages/copyTextToClipboard";

const storage = new Storage();
// Fired when the extension is first installed, when the extension is updated to a new version, and when Chrome is updated to a new version.
// */
chrome.runtime.onInstalled.addListener(async (details) => {
   if (details.reason == chrome.runtime.OnInstalledReason.INSTALL) {
      if (process.env.NODE_ENV === "production") {
         chrome.runtime.openOptionsPage();
      }
   } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
      console.log(
         "Extension updated from version",
         details.previousVersion,
         "to",
         chrome.runtime.getManifest().version
      );
   }

   //Setup the uninstall page
   const uninstallUrl = process.env.PLASMO_PUBLIC_WEBSITE_EXTENSION_OS || "";
   chrome.runtime.setUninstallURL(uninstallUrl + "/uninstall");

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

   //We have to use handler, as the other option would be to modify how plasmo work, or extend the responseClass to accept a return that is not VOID!
   switch (info.menuItemId) {
      case element.id:
         if (element.id === "configuration") {
            await openOptionsPageHandler();
         }
         if (element.functionType === "callAI-copyClipboard") {
            await sendLoadingActionHandler();
            response = await callOpenAIReturn(element.prompt, message);
            await copyTextToClipboardHandler(response);
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
