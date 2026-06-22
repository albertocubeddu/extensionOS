import { test, expect } from "./fixtures";
import type { Page } from "@playwright/test";

async function openOptionsPage(page: Page, extensionId: string) {
   await page.goto(`chrome-extension://${extensionId}/options.html`);
   await expect(page).toHaveTitle("Extension-OS: Your AI Partner");
}

async function selectFixtureText(page: Page) {
   const box = await page.locator("#selection-text").boundingBox();
   if (!box) {
      throw new Error("Selection fixture text was not visible.");
   }

   await page.mouse.move(box.x + 5, box.y + 10); // Move the mouse to the starting position.
   await page.mouse.down(); // Press the mouse button down to start selecting
   await page.mouse.move(box.x + Math.min(box.width - 5, 520), box.y + 10);
   await page.mouse.up(); // Release the mouse button to complete the selection
}

test("Selection Menu: Must show with the default config", async ({ page }) => {
   await page.goto("/selection.html");
   await expect(page).toHaveTitle("ExtensionOS selection fixture");
   await selectFixtureText(page);

   const options = await page.getByRole("option");
   const optionsCount = await options.count();
   //Must be 7 as you have to count the +2 (separator + Setup Your Own Prompt)
   expect(optionsCount).toBe(7);

   const isGrammarFixerPresent = await page
      .getByRole("option", { name: "❗Grammar Fixer" })
      .isVisible();
   expect(isGrammarFixerPresent).toBe(true);
});

test("Selection Menu: Must NOT show when the config is set to false", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#settings");
   const selectionSwitch = page.getByRole("switch", {
      name: /Display Selection Menu/,
   });
   await expect(selectionSwitch).toHaveAttribute("aria-checked", "true");
   await selectionSwitch.click();
   await expect(selectionSwitch).toHaveAttribute("aria-checked", "false");

   await page.goto("/selection.html");
   await expect(page).toHaveTitle("ExtensionOS selection fixture");
   await selectFixtureText(page);

   const options = await page.getByRole("option");
   const optionsCount = await options.count();
   //Must be 0 as the configuration is NOT Showing the menu!
   expect(optionsCount).toBe(0);
});
