import { test, expect } from "./fixtures";
const groqKey = process.env.E2E_TEST_GROQ_KEY;

test("be able to use groq and succesfully execute a query", async ({
   page,
}) => {
   await page.waitForTimeout(300);
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("Extension-OS: Your AI Partner");
   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Groq"');
   await expect(page.locator("#llm-model > span")).toHaveText(
      "llama-3.1-70b-versatile"
   );

   const llmKeyInput = await page.locator("#llm-key"); // Changed from getById to locator
   await llmKeyInput.fill(groqKey);

   await page.goto("https://www.york.ac.uk/teaching/cws/wws/webpage1.html");
   const pageTitle2 = await page.title();
   await expect(pageTitle2).toBe("webpage1");
   await page.mouse.move(100, 100); // Move the mouse to the starting position (x: 100, y: 100)
   await page.mouse.down(); // Press the mouse button down to start selecting
   await page.mouse.move(200, 120); // Move the mouse to the end position (x: 300, y: 300) to select text
   await page.mouse.up(); // Release the mouse button to complete the selection

   const options = await page.getByRole("option");
   const optionsCount = await options.count();
   //Must be 7 as you have to count the +2 (separator + Setup Your Own Prompt)
   //   expect(optionsCount).toBe(7);
   await page.click('role=option[name="❗Grammar Fixer"]');
   await page.waitForSelector("#success", { state: "visible" });
});

test("be able to use default localhost and succesfully execute a query", async ({
   page,
}) => {
   await page.waitForTimeout(300);
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("Extension-OS: Your AI Partner");
   await page.click("#llm-provider");
   await page.click('div[role="option"] >> text="Localhost"');
   const modelText = await page.locator("#llm-model").inputValue(); // Retrieve the text from the input
   await expect(modelText).toBe("llama3"); //

   await page.goto("https://www.york.ac.uk/teaching/cws/wws/webpage1.html");
   const pageTitle2 = await page.title();
   await expect(pageTitle2).toBe("webpage1");
   await page.mouse.move(100, 100); // Move the mouse to the starting position (x: 100, y: 100)
   await page.mouse.down(); // Press the mouse button down to start selecting
   await page.mouse.move(200, 120); // Move the mouse to the end position (x: 300, y: 300) to select text
   await page.mouse.up(); // Release the mouse button to complete the selection

   const options = await page.getByRole("option");
   const optionsCount = await options.count();
   //Must be 7 as you have to count the +2 (separator + Setup Your Own Prompt)
   //   expect(optionsCount).toBe(7);
   await page.click('role=option[name="❗Grammar Fixer"]');
   await page.waitForSelector("#success", { state: "visible" });
});
