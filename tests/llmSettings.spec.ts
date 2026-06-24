import { test, expect } from "./fixtures";
import type { Page } from "@playwright/test";
import {
   CUSTOM_LLM_MODEL_LABEL,
   DEFAULT_LLM_MODEL,
} from "../lib/configurations/llmProviders";

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
   await expect(page.locator("#llm-model > span")).toHaveText("gpt-5.5");

   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Together"');
   await expect(page.locator("#llm-model > span")).toHaveText(
      "moonshotai/Kimi-K2.6"
   );
});

test("be able to change provider and model and to save it", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Openai"');
   await expect(page.locator("#llm-model > span")).toHaveText("gpt-5.5");

   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Together"');
   await expect(page.locator("#llm-model > span")).toHaveText(
      "moonshotai/Kimi-K2.6"
   );

   await page.click("#llm-model");

   await page.click('div[role="option"] >> text="MiniMaxAI/MiniMax-M3"');

   await page.reload();
   await expect(page.locator("#llm-model > span")).toHaveText(
      "MiniMaxAI/MiniMax-M3"
   );
});

test("be able to select Other and save a manual model value", async ({
   page,
   extensionId,
}) => {
   const customModel = "provider/new-chat-model";

   await openOptionsPage(page, extensionId);
   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Openai"');
   await expect(page.locator("#llm-model > span")).toHaveText("gpt-5.5");

   await page.click("#llm-model");
   await page
      .getByRole("option", { name: CUSTOM_LLM_MODEL_LABEL })
      .click();
   await page.locator("#llm-model-custom").fill(customModel);

   await page.reload();
   await expect(page.locator("#llm-model > span")).toHaveText(
      CUSTOM_LLM_MODEL_LABEL
   );
   await expect(page.locator("#llm-model-custom")).toHaveValue(customModel);
});
