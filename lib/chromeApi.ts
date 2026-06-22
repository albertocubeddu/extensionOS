export type ChromeApiResult<T = void> =
   | {
        ok: true;
        data: T;
     }
   | {
        ok: false;
        error: string;
     };

export function ok<T>(data: T): ChromeApiResult<T> {
   return { ok: true, data };
}

export function fail<T = void>(error: string): ChromeApiResult<T> {
   return { ok: false, error };
}

export function isChromeApiError<T>(
   result: ChromeApiResult<T>
): result is { ok: false; error: string } {
   return !result.ok;
}

function lastRuntimeError(): string | undefined {
   return chrome.runtime.lastError?.message;
}

export async function getActiveTab(): Promise<ChromeApiResult<chrome.tabs.Tab>> {
   return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
         const runtimeError = lastRuntimeError();
         if (runtimeError) {
            resolve(fail(runtimeError));
            return;
         }

         const activeTab = tabs[0];
         if (!activeTab?.id) {
            resolve(fail("No active tab found."));
            return;
         }

         resolve(ok(activeTab));
      });
   });
}

export async function sendMessageToTab(
   tabId: number,
   message: unknown
): Promise<ChromeApiResult<void>> {
   return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, message, () => {
         const runtimeError = lastRuntimeError();
         resolve(runtimeError ? fail(runtimeError) : ok(undefined));
      });
   });
}

export async function sendMessageToActiveTab(
   message: unknown
): Promise<ChromeApiResult<void>> {
   const activeTab = await getActiveTab();
   if (isChromeApiError(activeTab)) {
      return fail(activeTab.error);
   }

   return sendMessageToTab(activeTab.data.id!, message);
}

export async function sendRuntimeMessage(
   message: unknown
): Promise<ChromeApiResult<void>> {
   return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, () => {
         const runtimeError = lastRuntimeError();
         resolve(runtimeError ? fail(runtimeError) : ok(undefined));
      });
   });
}

export async function openSidePanelForTab(
   tabId?: number
): Promise<ChromeApiResult<void>> {
   if (!tabId) {
      return fail("No tab id available for side panel.");
   }

   try {
      await chrome.sidePanel.open({ tabId });
      return ok(undefined);
   } catch (error) {
      return fail(error instanceof Error ? error.message : String(error));
   }
}

async function removeAllContextMenus(): Promise<ChromeApiResult<void>> {
   return new Promise((resolve) => {
      chrome.contextMenus.removeAll(() => {
         const runtimeError = lastRuntimeError();
         resolve(runtimeError ? fail(runtimeError) : ok(undefined));
      });
   });
}

async function createContextMenu(
   item: chrome.contextMenus.CreateProperties
): Promise<ChromeApiResult<void>> {
   return new Promise((resolve) => {
      chrome.contextMenus.create(item, () => {
         const runtimeError = lastRuntimeError();
         resolve(runtimeError ? fail(runtimeError) : ok(undefined));
      });
   });
}

export async function recreateContextMenus(
   items: chrome.contextMenus.CreateProperties[]
): Promise<ChromeApiResult<void>> {
   const removeResult = await removeAllContextMenus();
   if (!removeResult.ok) {
      return removeResult;
   }

   for (const item of items) {
      const createResult = await createContextMenu(item);
      if (!createResult.ok) {
         return createResult;
      }
   }

   return ok(undefined);
}
