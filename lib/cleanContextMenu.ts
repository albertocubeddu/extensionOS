import { toChromeContextMenuItems } from "./configurations/contextMenuItems";

//This return an item ready to be injested by the chorme.menu
export function cleanProperties(
   items: unknown
): chrome.contextMenus.CreateProperties[] {
   return toChromeContextMenuItems(items);
}
