import { test, expect } from "./fixtures";

//This test is useless as i can't find the way to click the chrome button as it is not part of the UI.
test("To be able to uninstall and visit a specific url", async ({
   page,
   extensionId,
}) => {
   await page.waitForTimeout(300);
   const pageTitle = await page.title();
   await expect(pageTitle).toBe("Extension-OS: Your AI Partner");
   await page.goto(`chrome://extensions/?id=${extensionId}`);
   await page.locator('text="Remove extension"');
   //TODO FIND A WAY TO CLICK THE REAL BUTTON IN CHROME
});
