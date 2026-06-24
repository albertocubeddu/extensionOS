import { expect, test } from "./fixtures";
import {
   openOptionsPage,
   openSelectionFixtureAndSelectText,
   setPlasmoStorage,
} from "./helpers";

test("reads existing user settings from the original Plasmo sync storage keys", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await setPlasmoStorage(page, {
      globalConfig: {
         selectionMenu: {
            display: false,
         },
      },
      llmKeys: {
         openai: "legacy-openai-key",
      },
      llmModel: "gpt-4o",
      llmProvider: "openai",
      voice_outbound_authToken: "legacy-vapi-token",
      voice_outbound_phoneNumberId: "legacy-phone-number-id",
   });

   await page.reload();

   await expect(page.locator("#llm-provider > span")).toHaveText("Openai");
   await expect(page.locator("#llm-model > span")).toHaveText("gpt-4o");
   await expect(page.locator("#llm-key")).toHaveValue("legacy-openai-key");
   await expect(page.locator("#voiceOutboundApiToken")).toHaveValue(
      "legacy-vapi-token"
   );
   await expect(page.locator("#voiceOutboundPhoneNumberID")).toHaveValue(
      "legacy-phone-number-id"
   );

   await page.click("#settings");
   await expect(page.getByRole("switch", { name: /Display Selection Menu/ }))
      .toHaveAttribute("aria-checked", "false");

   await openSelectionFixtureAndSelectText(page);
   await expect(page.getByRole("option")).toHaveCount(0);
});

test("reads existing custom prompt factory items from the original storage key", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await setPlasmoStorage(page, {
      contextMenuItems: [
         {
            contexts: ["selection"],
            functionType: "callAI-copyClipboard",
            id: "legacyGrammarFixer",
            prompt: "Fix this legacy text.",
            title: "Legacy Grammar Fixer",
         },
      ],
   });

   await openSelectionFixtureAndSelectText(page);

   await expect(
      page.getByRole("option", { name: "Legacy Grammar Fixer" })
   ).toBeVisible();
   await expect(page.getByRole("option", { name: "❗Grammar Fixer" })).toHaveCount(
      0
   );
});

test("legacy prompt factory items default the first 5 prompts into the compact selection menu", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await setPlasmoStorage(page, {
      contextMenuItems: Array.from({ length: 6 }, (_, index) => ({
         contexts: ["selection"],
         functionType: "callAI-copyClipboard",
         id: `legacyPrompt${index}`,
         prompt: `Legacy prompt ${index}.`,
         title: `Legacy Prompt ${index}`,
      })),
   });

   await openSelectionFixtureAndSelectText(page);

   for (let index = 0; index < 5; index += 1) {
      await expect(
         page.getByRole("option", { name: `Legacy Prompt ${index}` })
      ).toBeVisible();
   }

   await expect(
      page.getByRole("option", { name: "Legacy Prompt 5" })
   ).toHaveCount(0);
   await expect(page.getByRole("option")).toHaveCount(7);
});
