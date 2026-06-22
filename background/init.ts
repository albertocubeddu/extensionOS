import { Storage } from "@plasmohq/storage";
import {
   DEFAULT_CONTEXT_MENU_ITEMS,
   normalizeContextMenuItems,
   type ContextMenuItem,
} from "~lib/configurations/contextMenuItems";

const storage = new Storage();

export type IContextConfigItems = ContextMenuItem;

export async function initializeStorage() {
   //   https://unicode-table.com/

   if (process.env.NODE_ENV === "development") {
      //Useful to test a fresh-install
      // storage.removeAll();
   }

   const initState = await storage.get("contextMenuItems");

   if (initState) {
      const normalizedItems = normalizeContextMenuItems(initState);
      await storage.set("contextMenuItems", normalizedItems);
      return normalizedItems;
   }

   await storage.set("contextMenuItems", DEFAULT_CONTEXT_MENU_ITEMS);
   return DEFAULT_CONTEXT_MENU_ITEMS;
}
