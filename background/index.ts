import { runContextMenuActionById } from "~background/contextMenuActions";
import { initializeContextMenuItems } from "~background/contextMenuStorage";
import {
   isChromeApiError,
   openSidePanelForTab,
} from "~lib/chromeApi";
import { isSidebarMenuId } from "~lib/configurations/contextMenuItems";

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

   try {
      await initializeContextMenuItems(true);
   } catch (error) {
      console.error("Failed to create context menu items:", error);
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
   const result = await runContextMenuActionById(
      info.menuItemId,
      info.selectionText
   );

   if (result.ok === false) {
      console.warn(result.error);
   }
});
