import {
   DEFAULT_CONTEXT_MENU_ITEMS,
   normalizeContextMenuItems,
} from "~lib/configurations/contextMenuItems";
import { extensionStorage, STORAGE_KEYS } from "~lib/storage";

export async function initializeStorage() {
   //   https://unicode-table.com/

   if (process.env.NODE_ENV === "development") {
      //Useful to test a fresh-install
      // storage.removeAll();
   }

   const initState = await extensionStorage.get(STORAGE_KEYS.contextMenuItems);

   if (initState) {
      const normalizedItems = normalizeContextMenuItems(initState);
      await extensionStorage.set(STORAGE_KEYS.contextMenuItems, normalizedItems);
      return normalizedItems;
   }

   await extensionStorage.set(
      STORAGE_KEYS.contextMenuItems,
      DEFAULT_CONTEXT_MENU_ITEMS
   );
   return DEFAULT_CONTEXT_MENU_ITEMS;
}
