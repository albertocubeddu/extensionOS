import { describe, expect, it } from "vitest";

import {
   DEFAULT_CONTEXT_MENU_ITEMS,
   isSidebarMenuId,
   normalizeContextMenuItems,
   toChromeContextMenuItems,
   withSidebarMenuPrefix,
   withoutSidebarMenuPrefix,
} from "../../lib/configurations/contextMenuItems";

describe("context menu item configuration", () => {
   it("falls back to the default menu when stored data is missing or invalid", () => {
      expect(normalizeContextMenuItems(undefined)).toHaveLength(
         DEFAULT_CONTEXT_MENU_ITEMS.length
      );

      expect(normalizeContextMenuItems([{ title: "Missing id" }])).toEqual(
         DEFAULT_CONTEXT_MENU_ITEMS
      );
   });

   it("keeps sidebar menu IDs prefixed and non-sidebar IDs unprefixed", () => {
      const items = normalizeContextMenuItems([
         {
            id: "summariseText",
            title: "Summarise",
            contexts: ["selection"],
            functionType: "callAI-openSideBar",
         },
         {
            id: "side_grammarFixer",
            title: "Grammar",
            contexts: ["selection"],
            functionType: "callAI-copyClipboard",
         },
      ]);

      expect(items[0]?.id).toBe("side_summariseText");
      expect(items[1]?.id).toBe("grammarFixer");
      expect(isSidebarMenuId(items[0]?.id)).toBe(true);
      expect(isSidebarMenuId(items[1]?.id)).toBe(false);
   });

   it("normalizes contexts, function types, and extra args defensively", () => {
      const items = normalizeContextMenuItems([
         {
            id: "voice",
            title: "Voice",
            contexts: ["bad-context"],
            functionType: "callVoice-ExternalNumber",
            extraArgs: {
               vapiFirstMessage: "Hello",
               vapiRecipientPhoneNumber: "+15555555555",
               ignored: true,
            },
         },
         {
            id: "invalid",
            title: "Invalid",
            contexts: ["selection"],
            functionType: "not-supported",
         },
      ]);

      expect(items).toHaveLength(3);
      expect(items[0]).toMatchObject({
         id: "voice",
         contexts: ["selection"],
         extraArgs: {
            vapiFirstMessage: "Hello",
            vapiRecipientPhoneNumber: "+15555555555",
         },
      });
      expect(items[1]?.id).toBe("configuration");
      expect(items[2]?.id).toBe("deactivateSelectionMenu");
   });

   it("converts stored items to the Chrome context-menu surface only", () => {
      const chromeItems = toChromeContextMenuItems([
         {
            id: "grammarFixer",
            title: "Grammar",
            contexts: ["selection"],
            prompt: "Fix it",
            functionType: "callAI-copyClipboard",
         },
         {
            id: "separator1",
            type: "separator",
            contexts: ["all"],
         },
      ]);

      expect(chromeItems).toEqual([
         {
            id: "grammarFixer",
            title: "Grammar",
            contexts: ["selection"],
         },
         {
            id: "separator1",
            contexts: ["all"],
            type: "separator",
         },
         {
            id: "configuration",
            contexts: ["all"],
            title: "Setup Your Own Prompt",
         },
         {
            id: "deactivateSelectionMenu",
            contexts: ["all"],
            title: "Deactivate this menu",
         },
      ]);
   });

   it("exposes stable helpers for the sidebar ID convention", () => {
      expect(withSidebarMenuPrefix("summary")).toBe("side_summary");
      expect(withSidebarMenuPrefix("side_summary")).toBe("side_summary");
      expect(withoutSidebarMenuPrefix("side_summary")).toBe("summary");
      expect(withoutSidebarMenuPrefix("summary")).toBe("summary");
   });
});
