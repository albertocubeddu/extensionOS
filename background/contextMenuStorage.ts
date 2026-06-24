import { initializeStorage } from "~background/init";
import { isChromeApiError, recreateContextMenus } from "~lib/chromeApi";
import {
   normalizeContextMenuItems,
   toChromeContextMenuItems,
   type ContextMenuItem,
} from "~lib/configurations/contextMenuItems";
import { extensionStorage, STORAGE_KEYS } from "~lib/storage";

export type ContextMenuItemsResponse = {
   chromeItems: chrome.contextMenus.CreateProperties[];
   items: ContextMenuItem[];
};

export async function initializeContextMenuItems(
   recreateMenus = false
): Promise<ContextMenuItemsResponse> {
   const items = normalizeContextMenuItems(await initializeStorage());
   const chromeItems = toChromeContextMenuItems(items);

   if (recreateMenus) {
      const result = await recreateContextMenus(chromeItems);
      if (isChromeApiError(result)) {
         throw new Error(result.error);
      }
   }

   return {
      chromeItems,
      items,
   };
}

export async function saveContextMenuItems(
   items: unknown
): Promise<ContextMenuItemsResponse> {
   const normalizedItems = normalizeContextMenuItems(items);
   await extensionStorage.set(STORAGE_KEYS.contextMenuItems, normalizedItems);

   const chromeItems = toChromeContextMenuItems(normalizedItems);
   const result = await recreateContextMenus(chromeItems);
   if (isChromeApiError(result)) {
      throw new Error(result.error);
   }

   return {
      chromeItems,
      items: normalizedItems,
   };
}
