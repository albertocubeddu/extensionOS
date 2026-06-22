import { expect, test } from "./fixtures";
import {
   configureLocalhostEndpoint,
   openSelectionFixtureAndSelectText,
   openOptionsPage,
} from "./helpers";

test("copy action calls a deterministic OpenAI-compatible endpoint and shows success", async ({
   page,
   extensionId,
}) => {
   await configureLocalhostEndpoint(
      page,
      extensionId,
      "http://127.0.0.1:3210/v1/chat/completions"
   );

   await openSelectionFixtureAndSelectText(page);
   await page.click('role=option[name="❗Grammar Fixer"]');

   await expect(page.locator("#success")).toBeVisible();
   await expect(page.getByText("Error:")).toBeHidden();
});

test("copy action surfaces provider errors to the active page", async ({
   page,
   extensionId,
}) => {
   await configureLocalhostEndpoint(
      page,
      extensionId,
      "http://127.0.0.1:3210/v1/error"
   );

   await openSelectionFixtureAndSelectText(page);
   await page.click('role=option[name="❗Grammar Fixer"]');

   await expect(page.getByText("Error: Simulated provider failure")).toBeVisible();
   await expect(page.locator("#success")).toBeHidden();
});

test("unauthorized provider responses open the options page", async ({
   context,
   page,
   extensionId,
}) => {
   await configureLocalhostEndpoint(
      page,
      extensionId,
      "http://127.0.0.1:3210/v1/unauthorized"
   );

   await openSelectionFixtureAndSelectText(page);
   await page.click('role=option[name="❗Grammar Fixer"]');

   const optionsPage = await context.waitForEvent("page", { timeout: 5_000 });
   await expect(optionsPage).toHaveURL(
      `chrome-extension://${extensionId}/options.html`
   );
});

test("voice action posts the configured Vapi payload", async ({
   context,
   page,
   extensionId,
}) => {
   let postedBody: Record<string, unknown> | undefined;

   await context.route("https://api.vapi.ai/call/phone", async (route) => {
      postedBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
         status: 201,
         contentType: "application/json",
         body: JSON.stringify({ id: "call_test_123" }),
      });
   });

   await openOptionsPage(page, extensionId);
   await page.locator("#voiceOutboundApiToken").fill("test-vapi-token");
   await page.locator("#voiceOutboundPhoneNumberID").fill("phone-number-id");

   await openSelectionFixtureAndSelectText(page);
   await page.getByRole("option", { name: /Let's Talk about this/ }).click();

   await expect.poll(() => postedBody).toBeTruthy();
   expect(postedBody).toMatchObject({
      phoneNumberId: "phone-number-id",
      customer: {
         number: "Hi, this is your assistant calling. How can I help you?",
      },
   });
});
