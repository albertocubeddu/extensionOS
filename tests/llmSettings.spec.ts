import { test, expect } from "./fixtures";
import type { Page } from "@playwright/test";
import { DEFAULT_LLM_MODEL } from "../lib/configurations/llmProviders";

async function openOptionsPage(page: Page, extensionId: string) {
   await page.goto(`chrome-extension://${extensionId}/options.html`);
   await expect(page).toHaveTitle("Extension-OS: Your AI Partner");
}

test("To have the default pre-selected", async ({ page, extensionId }) => {
   await openOptionsPage(page, extensionId);
   await expect(page.locator("#llm-provider > span")).toHaveText(
      "Extension | OS"
   );

   await expect(page.locator("#llm-model > span")).toHaveText(DEFAULT_LLM_MODEL);
});

test("be able to change provider and get the default selected", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Openai"');
   await expect(page.locator("#llm-model > span")).toHaveText("gpt-4");

   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Together"');
   await expect(page.locator("#llm-model > span")).toHaveText(
      "Austism/chronos-hermes-13b"
   );
});

test("be able to change provider and model and to save it", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Openai"');
   await expect(page.locator("#llm-model > span")).toHaveText("gpt-4");

   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Together"');
   await expect(page.locator("#llm-model > span")).toHaveText(
      "Austism/chronos-hermes-13b"
   );

   await page.click("#llm-model");

   await page.click('div[role="option"] >> text="Qwen/Qwen2-72B"');

   await page.reload();
   await expect(page.locator("#llm-model > span")).toHaveText("Qwen/Qwen2-72B");
});
