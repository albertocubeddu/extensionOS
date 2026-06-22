import { expect, test } from "./fixtures";
import {
   getPlasmoStorage,
   openOptionsPage,
   openSelectionFixtureAndSelectText,
} from "./helpers";

test("prompt factory edits persist and refresh the injected selection menu", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#promptFactory");
   await expect(page.locator("#title-1")).toBeVisible();

   await page.locator("#title-1").fill("QA Grammar Fixer");
   await page.locator("#prompt-1").fill("Return only the corrected text.");

   page.once("dialog", (dialog) => dialog.accept());
   await page.getByRole("button", { name: "Save All" }).first().click();

   const storedItems = await getPlasmoStorage(page, "contextMenuItems");

   expect(storedItems).toEqual(
      expect.arrayContaining([
         expect.objectContaining({
            id: "grammarFixer",
            title: "QA Grammar Fixer",
            prompt: "Return only the corrected text.",
         }),
      ])
   );

   await openSelectionFixtureAndSelectText(page);
   await expect(page.getByRole("option", { name: "QA Grammar Fixer" })).toBeVisible();
   await expect(
      page.getByRole("option", { name: "❗Grammar Fixer" })
   ).toHaveCount(0);
});

test("prompt factory preserves the sidebar ID convention when functionality changes", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#promptFactory");
   await expect(page.locator("#title-2")).toBeVisible();

   const initialItems = await getPlasmoStorage(page, "contextMenuItems");

   expect(initialItems).toEqual(
      expect.arrayContaining([
         expect.objectContaining({
            id: "side_summariseText",
            functionType: "callAI-openSideBar",
         }),
      ])
   );

   await page.locator("button").filter({ hasText: "Write to Sidebar" }).click();
   await page.click('div[role="option"] >> text="Copy to Clipboard"');

   page.once("dialog", (dialog) => dialog.accept());
   await page.getByRole("button", { name: "Save All" }).nth(2).click();

   const updatedItems = await getPlasmoStorage(page, "contextMenuItems");

   expect(updatedItems).toEqual(
      expect.arrayContaining([
         expect.objectContaining({
            id: "summariseText",
            functionType: "callAI-copyClipboard",
         }),
      ])
   );
});
