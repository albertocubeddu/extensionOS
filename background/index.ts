import { Storage } from "@plasmohq/storage";

import { initializeStorage } from "~background/init";
import { cleanProperties } from "~lib/cleanContextMenu";
import {
   isChromeApiError,
   openSidePanelForTab,
   recreateContextMenus,
   sendRuntimeMessage,
} from "~lib/chromeApi";
import {
   isSidebarMenuId,
   normalizeContextMenuItems,
} from "~lib/configurations/contextMenuItems";
import { callOpenAIReturn } from "~lib/openAITypeCall";
import { createCall } from "~lib/vapiOutbound";
import { openOptionsPageHandler } from "./messages/openOptionPage";
import { sendLoadingActionHandler } from "./messages/sendLoadingAction";
import { copyTextToClipboardHandler } from "./messages/copyTextToClipboard";

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

   const menuResult = await recreateContextMenus(cleanedContextMenuItems);
   if (isChromeApiError(menuResult)) {
      console.error("Failed to create context menu items:", menuResult.error);
   }
});

/*
Listener: ONLY FOR THE SIDEBAR.
Why do we need the extra listener? The chrome.sidePanel.open doesn't work afer the storage.get (called in the other listener) is invoked.
*/
chrome.contextMenus.onClicked.addListener((info, tab) => {
   const itemId = String(info.menuItemId);
   if (isSidebarMenuId(itemId)) {
      openSidePanelForTab(tab.id).then((result) => {
         if (isChromeApiError(result)) {
            console.warn("Failed to open side panel:", result.error);
         }
      });
   }
});

/*
General Listener for the onClicked.
*/
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
   const message = info.selectionText;

   let response;

   const items = normalizeContextMenuItems(await storage.get("contextMenuItems"));

   const element = items.find((item) => item.id === info.menuItemId);

   if (!element) {
      console.warn("Unhandled menu item:", info.menuItemId);
      return;
   }

   if (element.id === "configuration") {
      await openOptionsPageHandler();
      return;
   }

   switch (element.functionType) {
      case "callAI-copyClipboard":
         await sendLoadingActionHandler();
         response = await callOpenAIReturn(element.prompt ?? "", message);
         await copyTextToClipboardHandler(response);
         break;

      case "callVoice-ExternalNumber":
         await createCall(
            element.prompt ?? "",
            message ?? "",
            element.extraArgs?.vapiRecipientPhoneNumber ??
               "Hi, this is your assistent calling. How can I help you?",
            element.extraArgs?.vapiFirstMessage ?? ""
         );
         break;

      case "callAI-openSideBar":
         response = await callOpenAIReturn(element.prompt ?? "", message);
         await sendRuntimeMessage({
            action: "send_to_sidepanel",
            payload: response.data,
         });
         break;

      default:
         console.warn("Unhandled function type:", element.functionType);
   }
});
