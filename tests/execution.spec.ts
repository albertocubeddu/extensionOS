import { expect, test } from "./fixtures";
import {
   configureLocalhostEndpoint,
   openSelectionFixtureAndSelectText,
   openOptionsPage,
   setPlasmoStorage,
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

test("side panel action calls the configured LLM endpoint", async ({
   context,
   page,
   extensionId,
}) => {
   let requestCount = 0;

   await context.route(
      "http://127.0.0.1:3210/v1/chat/completions",
      async (route) => {
         requestCount += 1;
         await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
               choices: [
                  {
                     message: {
                        content: "Side panel response",
                     },
                  },
               ],
            }),
         });
      }
   );

   await configureLocalhostEndpoint(
      page,
      extensionId,
      "http://127.0.0.1:3210/v1/chat/completions"
   );

   await openSelectionFixtureAndSelectText(page);
   await page.getByRole("option", { name: /Summarise Text/ }).click();

   await expect.poll(() => requestCount).toBe(1);
   await expect(page.getByText("Error:")).toBeHidden();
});

test("mixture of agents runs through the background message handler", async ({
   context,
   page,
   extensionId,
}) => {
   const requestedModels: string[] = [];

   await context.route(
      "https://api.groq.com/openai/v1/chat/completions",
      async (route) => {
         const body = route.request().postDataJSON() as { model: string };
         requestedModels.push(body.model);
         await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
               choices: [
                  {
                     message: {
                        content: `response from ${body.model}`,
                     },
                  },
               ],
            }),
         });
      }
   );

   await openOptionsPage(page, extensionId);
   await setPlasmoStorage(page, {
      llmKeys: {
         groq: "test-groq-key",
      },
      mixtureOfAgentsModel1: "llama-3.3-70b-versatile",
      mixtureOfAgentsModel2: "llama-3.1-8b-instant",
      mixtureOfAgentsModel3: "openai/gpt-oss-20b",
      mixtureOfAgentsModelAggregator: "openai/gpt-oss-120b",
   });

   await page.click("#mixtureOfAgents");
   await page.getByRole("button", { name: "Run Mixture of Agents" }).click();

   await expect.poll(() => requestedModels.length).toBe(4);
   expect(requestedModels.slice(0, 3).sort()).toEqual(
      [
         "llama-3.3-70b-versatile",
         "llama-3.1-8b-instant",
         "openai/gpt-oss-20b",
      ].sort()
   );
   expect(requestedModels[3]).toBe("openai/gpt-oss-120b");
   await expect(page.getByText("response from openai/gpt-oss-120b")).toBeVisible();
});
