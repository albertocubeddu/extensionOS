const validKeys = [
   "documentUrlPatterns",
   "checked",
   "title",
   "contexts",
   "enabled",
   "targetUrlPatterns",
   "onclick",
   "parentId",
   "type",
   "id",
   "visible",
] as const;

function removeKeysAndKeepValues<T extends object>(
   obj: T
): Array<Partial<T[keyof T]>> {
   return Object.values(obj);
}

export function cleanProperties(
   items: any[]
): chrome.contextMenus.CreateProperties[] {
   items = removeKeysAndKeepValues(items);
   return items.map((item) => {
      let cleanedItem: chrome.contextMenus.CreateProperties = {};
      Object.keys(item).forEach((key) => {
         if (
            validKeys.includes(
               key as keyof chrome.contextMenus.CreateProperties
            )
         ) {
            cleanedItem[key] = item[key];
         }
      });
      return cleanedItem;
   });
}
