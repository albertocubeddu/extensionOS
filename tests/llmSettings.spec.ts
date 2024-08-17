import { test, expect } from "./fixtures";

test("To have the default pre-selected", async ({ page }) => {
   await page.waitForTimeout(300);
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("Extension-OS: Your AI Partner");
   await expect(page.locator("#llm-provider > span")).toHaveText(
      "Extension | OS"
   );

   await expect(page.locator("#llm-model > span")).toHaveText(
      "llama-3.1-70b-versatile"
   );
});

test("be able to change provider and get the default selected", async ({
   page,
}) => {
   await page.waitForTimeout(300);
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("Extension-OS: Your AI Partner");
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
}) => {
   await page.waitForTimeout(300);
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("Extension-OS: Your AI Partner");
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
