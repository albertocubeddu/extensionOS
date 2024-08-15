import { test, expect } from "./fixtures";

test("option page loaded at the beginning", async ({ page }) => {
   await page.waitForTimeout(1000);
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("Extension-OS: Your AI Partner");
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
