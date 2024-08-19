import { test, expect } from "./fixtures";

test("Selection Menu: Must show with the default config", async ({ page }) => {
   await page.waitForTimeout(1000);
   await page.goto("https://www.york.ac.uk/teaching/cws/wws/webpage1.html");
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("webpage1");
   await page.mouse.move(100, 100); // Move the mouse to the starting position (x: 100, y: 100)
   await page.mouse.down(); // Press the mouse button down to start selecting
   await page.mouse.move(300, 300); // Move the mouse to the end position (x: 300, y: 300) to select text
   await page.mouse.up(); // Release the mouse button to complete the selection

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
}) => {
   await page.waitForTimeout(300);

   await page.click("#settings");
   await page.uncheck("#display-selection-menu");
   await page.waitForTimeout(500);

   await page.goto("https://www.york.ac.uk/teaching/cws/wws/webpage1.html");
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("webpage1");
   await page.mouse.move(100, 100); // Move the mouse to the starting position (x: 100, y: 100)
   await page.mouse.down(); // Press the mouse button down to start selecting
   await page.mouse.move(300, 300); // Move the mouse to the end position (x: 300, y: 300) to select text
   await page.mouse.up(); // Release the mouse button to complete the selection

   const options = await page.getByRole("option");
   const optionsCount = await options.count();
   //Must be 0 as the configuration is NOT Showing the menu!
   expect(optionsCount).toBe(0);
});
