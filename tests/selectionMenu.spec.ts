import { test, expect } from "./fixtures";
import type { BrowserContext, Page } from "@playwright/test";

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

async function waitForOptionsPage(
   context: BrowserContext,
   extensionId: string
) {
   const optionsUrl = `chrome-extension://${extensionId}/options.html`;

   await expect
      .poll(() => context.pages().some((page) => page.url() === optionsUrl))
      .toBe(true);

   const optionsPage = context.pages().find((page) => page.url() === optionsUrl);
   if (!optionsPage) {
      throw new Error("Options page was not opened.");
   }

   return optionsPage;
}

test("Selection Menu: Must show with the default config", async ({ page }) => {
   await page.goto("/selection.html");
   await expect(page).toHaveTitle("ExtensionOS selection fixture");
   await selectFixtureText(page);

   const options = page.getByRole("option");
   // Must be 8 as you have to count the +3 (separator, Setup Your Own Prompt, Deactivate this menu).
   await expect(options).toHaveCount(8);

   const isGrammarFixerPresent = await page
      .getByRole("option", { name: "❗Grammar Fixer" })
      .isVisible();
   expect(isGrammarFixerPresent).toBe(true);
   await expect(options.nth(6)).toHaveText("Setup Your Own Prompt");
   await expect(options.nth(7)).toHaveText("Deactivate this menu");
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

   //Must be 0 as the configuration is NOT Showing the menu!
   await expect(page.getByRole("option")).toHaveCount(0);
});

test("Selection Menu: Can open settings from the deactivate menu item", async ({
   context,
   page,
   extensionId,
}) => {
   await page.goto("/selection.html");
   await expect(page).toHaveTitle("ExtensionOS selection fixture");
   await selectFixtureText(page);

   await expect(
      page.getByRole("option", { name: "Deactivate this menu" })
   ).toBeVisible();
   await page.getByRole("option", { name: "Deactivate this menu" }).click();
   const optionsPage = await waitForOptionsPage(context, extensionId);

   await expect(optionsPage).toHaveTitle("Extension-OS: Your AI Partner");
   await expect(
      optionsPage.getByRole("switch", { name: /Display Selection Menu/ })
   ).toHaveAttribute("aria-checked", "true");
});
