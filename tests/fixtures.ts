import { test as base, chromium, type BrowserContext } from "@playwright/test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "path";

export const test = base.extend<{
   context: BrowserContext;
   extensionId: string;
}>({
   context: async ({}, use) => {
      const pathToExtension = path.join(__dirname, "../build/chrome-mv3-prod");
      const userDataDir = await fs.mkdtemp(
         path.join(os.tmpdir(), "extensionos-playwright-")
      );
      const context = await chromium.launchPersistentContext(userDataDir, {
         headless: false,
         args: [
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
         ],
      });
      try {
         await use(context);
      } finally {
         await context.close();
         await fs.rm(userDataDir, { force: true, recursive: true });
      }
   },
   extensionId: async ({ context }, use) => {
      // for manifest v3:
      let [background] = context.serviceWorkers();
      if (!background) background = await context.waitForEvent("serviceworker");

      const extensionId = background.url().split("/")[2];
      await use(extensionId);
   },
});
export const expect = test.expect;
