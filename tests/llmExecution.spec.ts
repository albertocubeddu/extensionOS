import { test, expect } from "./fixtures";
import type { Page } from "@playwright/test";
import { DEFAULT_LLM_MODEL } from "../lib/configurations/llmProviders";
const groqKey = process.env.E2E_TEST_GROQ_KEY;

async function openOptionsPage(page: Page, extensionId: string) {
   await page.goto(`chrome-extension://${extensionId}/options.html`);
   await expect(page).toHaveTitle("Extension-OS: Your AI Partner");
}

async function selectFixtureText(page: Page) {
   const box = await page.locator("#selection-text").boundingBox();
   if (!box) {
      throw new Error("Selection fixture text was not visible.");
   }

   await page.mouse.move(box.x + 5, box.y + 10);
   await page.mouse.down();
   await page.mouse.move(box.x + Math.min(box.width - 5, 520), box.y + 10);
   await page.mouse.up();
}

test("be able to use groq and succesfully execute a query", async ({
   page,
   extensionId,
}) => {
   test.skip(!groqKey, "Requires E2E_TEST_GROQ_KEY.");

   await openOptionsPage(page, extensionId);
   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Groq"');
   await expect(page.locator("#llm-model > span")).toHaveText(DEFAULT_LLM_MODEL);

   const llmKeyInput = await page.locator("#llm-key"); // Changed from getById to locator
   await llmKeyInput.fill(groqKey ?? "");

   await page.goto("/selection.html");
   await expect(page).toHaveTitle("ExtensionOS selection fixture");
   await selectFixtureText(page);

   const options = await page.getByRole("option");
   const optionsCount = await options.count();
   //Must be 7 as you have to count the +2 (separator + Setup Your Own Prompt)
   //   expect(optionsCount).toBe(7);
   await page.click('role=option[name="❗Grammar Fixer"]');
   await page.waitForSelector("#success", { state: "visible" });
});

test("be able to use default localhost and succesfully execute a query", async ({
   page,
   extensionId,
}) => {
   test.skip(!process.env.E2E_TEST_OLLAMA, "Requires E2E_TEST_OLLAMA.");

   await openOptionsPage(page, extensionId);
   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Localhost"');
   const modelText = await page.locator("#llm-model").inputValue(); // Retrieve the text from the input
   await expect(modelText).toBe("llama3"); //

   await page.goto("/selection.html");
   await expect(page).toHaveTitle("ExtensionOS selection fixture");
   await selectFixtureText(page);

   const options = await page.getByRole("option");
   const optionsCount = await options.count();
   //Must be 7 as you have to count the +2 (separator + Setup Your Own Prompt)
   //   expect(optionsCount).toBe(7);
   await page.click('role=option[name="❗Grammar Fixer"]');
   await page.waitForSelector("#success", { state: "visible" });
});
