import { expect, test } from "./fixtures";
import {
   configureLocalhostEndpoint,
   getPlasmoStorage,
   openOptionsPage,
   openSelectionFixtureAndSelectText,
} from "./helpers";

const SELECTED_TEXT_BADGE_TOOLTIP =
   "When you run this prompt, Extension | OS adds the text you highlighted on the page after your prompt. This badge is just a marker, not saved text.";

test("prompt factory edits persist and refresh the injected selection menu", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#promptFactory");
   await expect(page.locator("#title-1")).toBeVisible();
   await expect(page.getByText("Heads up!")).toHaveCount(0);

   const firstPromptCard = page.locator("[data-prompt-card-id]").first();
   await expect(
      firstPromptCard.getByText("Selected text added here")
   ).toBeVisible();
   await firstPromptCard.getByText("Selected text added here").hover();
   await expect(
      page.getByRole("tooltip").filter({ hasText: SELECTED_TEXT_BADGE_TOOLTIP })
   ).toBeVisible();

   await page.locator("#title-1").fill("QA Grammar Fixer");
   await page.locator("#prompt-1").fill("Return only the corrected text.");

   page.once("dialog", (dialog) => dialog.accept());
   await page.getByRole("button", { name: "Save All" }).click();

   const storedItems = await getPlasmoStorage<any[]>(page, "contextMenuItems");

   expect(storedItems).toEqual(
      expect.arrayContaining([
         expect.objectContaining({
            id: "grammarFixer",
            title: "QA Grammar Fixer",
            prompt: "Return only the corrected text.",
         }),
      ])
   );
   expect(
      storedItems?.find((item) => item.id === "grammarFixer")?.prompt
   ).not.toContain("Selected text added here");

   await openSelectionFixtureAndSelectText(page);
   await expect(page.getByRole("option", { name: "QA Grammar Fixer" })).toBeVisible();
   await expect(
      page.getByRole("option", { name: "❗Grammar Fixer" })
   ).toHaveCount(0);
});

test("prompt factory preserves the sidebar ID convention when functionality changes", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#promptFactory");
   await expect(page.locator("#title-2")).toBeVisible();

   const initialItems = await getPlasmoStorage(page, "contextMenuItems");

   expect(initialItems).toEqual(
      expect.arrayContaining([
         expect.objectContaining({
            id: "side_summariseText",
            functionType: "callAI-openSideBar",
         }),
      ])
   );

   await page.locator("button").filter({ hasText: "Write to Sidebar" }).click();
   await page.click('div[role="option"] >> text="Copy to Clipboard"');

   page.once("dialog", (dialog) => dialog.accept());
   await page.getByRole("button", { name: "Save All" }).click();

   const updatedItems = await getPlasmoStorage(page, "contextMenuItems");

   expect(updatedItems).toEqual(
      expect.arrayContaining([
         expect.objectContaining({
            id: "summariseText",
            functionType: "callAI-copyClipboard",
         }),
      ])
   );
});

test("prompt factory can add prompts without adding a 6th compact-menu item", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#promptFactory");
   await expect(page.locator("#title-4")).toBeVisible();

   await page.getByRole("button", { name: "Add Prompt" }).click();
   await expect(page.locator("#title-0")).toHaveValue("New Prompt");
   await expect(page.locator("#title-0")).toBeFocused();
   await page.locator("#title-0").fill("QA Added Prompt");
   await page.locator("#prompt-0").fill("Reply with a short answer.");

   page.once("dialog", (dialog) => dialog.accept());
   await page.getByRole("button", { name: "Save All" }).click();

   const storedItems = await getPlasmoStorage<any[]>(page, "contextMenuItems");
   expect(storedItems).toEqual(
      expect.arrayContaining([
         expect.objectContaining({
            title: "QA Added Prompt",
            prompt: "Reply with a short answer.",
            selectionMenuVisible: false,
         }),
      ])
   );

   await openSelectionFixtureAndSelectText(page);
   await expect(
      page.getByRole("option", { name: "QA Added Prompt" })
   ).toHaveCount(0);
});

test("prompt factory can add a visible prompt and execute it from the compact menu", async ({
   page,
   extensionId,
}) => {
   await configureLocalhostEndpoint(
      page,
      extensionId,
      "http://127.0.0.1:3210/v1/chat/completions"
   );
   await page.click("#promptFactory");
   await expect(page.locator("#title-4")).toBeVisible();

   await page.locator("#selection-menu-visible-0").click();
   await expect(page.locator("#selection-menu-visible-0")).toHaveAttribute(
      "aria-pressed",
      "false"
   );

   await page.getByRole("button", { name: "Add Prompt" }).click();
   await expect(page.locator("#title-0")).toHaveValue("New Prompt");
   await expect(page.locator("#selection-menu-visible-0")).toHaveAttribute(
      "aria-pressed",
      "true"
   );
   await page.locator("#title-0").fill("QA Executable Prompt");
   await page.locator("#prompt-0").fill("Return a deterministic QA response.");

   page.once("dialog", (dialog) => dialog.accept());
   await page.getByRole("button", { name: "Save All" }).click();

   await openSelectionFixtureAndSelectText(page);
   await page.getByRole("option", { name: "QA Executable Prompt" }).click();

   await expect(page.locator("#success")).toBeVisible();
   await expect(page.getByText("Error:")).toBeHidden();
});

test("prompt factory blocks marking a 6th prompt visible in the compact menu", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#promptFactory");
   await expect(page.locator("#title-4")).toBeVisible();

   await page.getByRole("button", { name: "Add Prompt" }).click();
   await page.locator("#selection-menu-visible-0").click();

   await expect(
      page.getByText(
         "Only 5 prompts can be visible in the selection menu at the same time. Deactivate one before adding another."
      )
   ).toBeVisible();
   await expect(page.locator("#selection-menu-visible-0")).toHaveAttribute(
      "aria-pressed",
      "false"
   );
});

test("prompt factory ordering controls persist menu order", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#promptFactory");
   await expect(page.locator("#title-0")).toHaveValue("💬 Comment Post");
   await expect(page.locator("#title-1")).toHaveValue("❗Grammar Fixer");

   await page.getByRole("button", { name: "Move ❗Grammar Fixer up" }).click();

   await expect(page.locator("#title-0")).toHaveValue("❗Grammar Fixer");
   await expect(page.locator("#title-1")).toHaveValue("💬 Comment Post");

   page.once("dialog", (dialog) => dialog.accept());
   await page.getByRole("button", { name: "Save All" }).click();

   const storedItems = await getPlasmoStorage<any[]>(
      page,
      "contextMenuItems"
   );
   expect(storedItems?.[0]).toEqual(
      expect.objectContaining({
         id: "grammarFixer",
      })
   );
   expect(storedItems?.[1]).toEqual(
      expect.objectContaining({
         id: "postComment",
      })
   );

   await openSelectionFixtureAndSelectText(page);
   const options = page.getByRole("option");
   await expect(options.nth(0)).toHaveText("❗Grammar Fixer");
   await expect(options.nth(1)).toHaveText("💬 Comment Post");
});

test("prompt factory keeps moved prompt controls in view when reordering down", async ({
   page,
   extensionId,
}) => {
   await page.setViewportSize({ width: 900, height: 420 });
   await openOptionsPage(page, extensionId);
   await page.click("#promptFactory");
   await expect(page.locator("#title-2")).toHaveValue("🔥 Summarise Text");

   const moveDownButton = page.getByRole("button", {
      name: "Move 🔥 Summarise Text down",
   });
   await moveDownButton.scrollIntoViewIfNeeded();
   await moveDownButton.click();

   await expect(page.locator("#title-3")).toHaveValue("🔥 Summarise Text");
   await expect(
      page.getByRole("button", { name: "Move 🔥 Summarise Text up" })
   ).toBeInViewport();
});

test("prompt factory supports ordering with add, remove, and visibility changes before save", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#promptFactory");
   await expect(page.locator("#title-0")).toHaveValue("💬 Comment Post");
   await expect(page.locator("#title-1")).toHaveValue("❗Grammar Fixer");

   await page.getByRole("button", { name: "Move ❗Grammar Fixer up" }).click();
   await page.getByRole("button", { name: "Add Prompt" }).click();
   await page.locator("#title-0").fill("QA Mixed Prompt");
   await page.locator("#prompt-0").fill("Mixed prompt body.");
   await page.getByRole("button", { name: "Move QA Mixed Prompt down" }).click();

   page.once("dialog", (dialog) => dialog.accept());
   await page.getByRole("button", { name: "Remove" }).nth(2).click();
   await page.locator("#selection-menu-visible-1").click();

   await expect(page.locator("#title-0")).toHaveValue("❗Grammar Fixer");
   await expect(page.locator("#title-1")).toHaveValue("QA Mixed Prompt");
   await expect(page.locator("#title-2")).toHaveValue("🔥 Summarise Text");
   await expect(page.locator("#selection-menu-visible-1")).toHaveAttribute(
      "aria-pressed",
      "true"
   );

   page.once("dialog", (dialog) => dialog.accept());
   await page.getByRole("button", { name: "Save All" }).click();

   const storedItems = await getPlasmoStorage<any[]>(
      page,
      "contextMenuItems"
   );
   expect(storedItems?.[0]).toEqual(
      expect.objectContaining({
         id: "grammarFixer",
      })
   );
   expect(storedItems?.[1]).toEqual(
      expect.objectContaining({
         title: "QA Mixed Prompt",
         selectionMenuVisible: true,
      })
   );
   expect(storedItems?.[2]).toEqual(
      expect.objectContaining({
         id: "side_summariseText",
      })
   );
   expect(storedItems).not.toEqual(
      expect.arrayContaining([
         expect.objectContaining({
            id: "postComment",
         }),
      ])
   );

   await openSelectionFixtureAndSelectText(page);
   const options = page.getByRole("option");
   await expect(options.nth(0)).toHaveText("❗Grammar Fixer");
   await expect(options.nth(1)).toHaveText("QA Mixed Prompt");
   await expect(options.nth(2)).toHaveText("🔥 Summarise Text");
});

test("prompt factory hard deletes removed prompts after saving", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#promptFactory");
   await expect(page.locator("#title-1")).toHaveValue("❗Grammar Fixer");

   page.once("dialog", (dialog) => {
      expect(dialog.message()).toContain("Remove");
      dialog.accept();
   });
   await page.getByRole("button", { name: "Remove" }).nth(1).click();

   page.once("dialog", (dialog) => dialog.accept());
   await page.getByRole("button", { name: "Save All" }).click();

   const storedItems = await getPlasmoStorage<any[]>(page, "contextMenuItems");
   expect(storedItems).not.toEqual(
      expect.arrayContaining([
         expect.objectContaining({
            id: "grammarFixer",
         }),
      ])
   );

   await openSelectionFixtureAndSelectText(page);
   await expect(
      page.getByRole("option", { name: "❗Grammar Fixer" })
   ).toHaveCount(0);
});

test("prompt factory can remove every prompt without restoring defaults", async ({
   page,
   extensionId,
}) => {
   await openOptionsPage(page, extensionId);
   await page.click("#promptFactory");
   await expect(page.locator("#title-4")).toBeVisible();

   while (await page.getByRole("button", { name: "Remove" }).count()) {
      page.once("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "Remove" }).first().click();
   }

   await expect(page.getByText("No prompts configured yet.")).toBeVisible();
   await expect(page.locator('[id^="title-"]')).toHaveCount(0);

   page.once("dialog", (dialog) => dialog.accept());
   await page.getByRole("button", { name: "Save All" }).click();

   const storedItems = await getPlasmoStorage<any[]>(
      page,
      "contextMenuItems"
   );
   expect(storedItems?.filter((item) => item.functionType)).toHaveLength(0);

   await openSelectionFixtureAndSelectText(page);
   const options = page.getByRole("option");
   await expect(options).toHaveCount(2);
   await expect(options.nth(0)).toHaveText("Setup Your Own Prompt");
   await expect(options.nth(1)).toHaveText("Deactivate this menu");
});
