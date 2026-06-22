import { test, expect } from "./fixtures";

test("option page loaded at the beginning", async ({ page, extensionId }) => {
   await page.goto(`chrome-extension://${extensionId}/options.html`);
   await expect(page).toHaveTitle("Extension-OS: Your AI Partner");
});

test("popup configuration button opens the options page", async ({
   context,
   page,
   extensionId,
}) => {
   await page.goto(`chrome-extension://${extensionId}/popup.html`);

   const [optionsPage] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("button", { name: "Configuration" }).click(),
   ]);

   await expect(optionsPage).toHaveURL(
      `chrome-extension://${extensionId}/options.html`
   );
   await expect(optionsPage).toHaveTitle("Extension-OS: Your AI Partner");
});
