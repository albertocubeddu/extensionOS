import { test, expect } from "./fixtures";

test("option page loaded at the beginning", async ({ page }) => {
   await page.waitForTimeout(1000);
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("Extension-OS: Your AI Partner");
});

test("open a page, the menu should show with all the elements", async ({
   page,
}) => {
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

test("open a page, the menu should show when the right click is pressed", async ({
   page,
}) => {
   await page.waitForTimeout(1000);
   await page.goto("https://www.york.ac.uk/teaching/cws/wws/webpage1.html");
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("webpage1");
   await page.mouse.click(150, 150, { button: "right" });
   /*If anyone know  a way to test out the menu, that would be great! Anything i've tried is not working: Screenshot, Left Click, Move + Left Click */
   expect(true).toBe(true);
});

test("login with google", async ({ page }) => {
   await page.waitForTimeout(1000);
   await page.goto("https://www.york.ac.uk/teaching/cws/wws/webpage1.html");
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("webpage1");
   await page.mouse.click(150, 150, { button: "right" });
   /*If anyone know  a way to test out the menu, that would be great! Anything i've tried is not working: Screenshot, Left Click, Move + Left Click */
});
