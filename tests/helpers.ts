import { expect, type Page } from "@playwright/test";
import { DEFAULT_LOCALHOST_MODEL } from "../lib/configurations/llmProviders";

export async function getPlasmoStorage<T = unknown>(page: Page, key: string) {
   return page.evaluate(async (storageKey) => {
      const result = await chrome.storage.sync.get(storageKey);
      const rawValue = result[storageKey];
      return rawValue === undefined ? undefined : JSON.parse(String(rawValue));
   }, key) as Promise<T | undefined>;
}

export async function setPlasmoStorage(
   page: Page,
   values: Record<string, unknown>
) {
   await page.evaluate(async (storageValues) => {
      const serializedValues = Object.fromEntries(
         Object.entries(storageValues).map(([key, value]) => [
            key,
            JSON.stringify(value),
         ])
      );

      await chrome.storage.sync.set(serializedValues);
   }, values);
}

export async function openOptionsPage(page: Page, extensionId: string) {
   await page.goto(`chrome-extension://${extensionId}/options.html`);
   await expect(page).toHaveTitle("Extension-OS: Your AI Partner");
}

export async function selectFixtureText(page: Page) {
   const box = await page.locator("#selection-text").boundingBox();
   if (!box) {
      throw new Error("Selection fixture text was not visible.");
   }

   await page.mouse.move(box.x + 5, box.y + 10);
   await page.mouse.down();
   await page.mouse.move(box.x + Math.min(box.width - 5, 520), box.y + 10);
   await page.mouse.up();
}

export async function configureLocalhostEndpoint(
   page: Page,
   extensionId: string,
   endpoint: string
) {
   await openOptionsPage(page, extensionId);
   await setPlasmoStorage(page, {
      llmProvider: "localhost",
      llmModel: DEFAULT_LOCALHOST_MODEL,
      llmKeys: {
         localhost: "deterministic-test-key",
      },
      llmCustomEndpoint: endpoint,
   });
}

export async function openSelectionFixtureAndSelectText(page: Page) {
   await page.goto("/selection.html");
   await expect(page).toHaveTitle("ExtensionOS selection fixture");
   await selectFixtureText(page);
}
