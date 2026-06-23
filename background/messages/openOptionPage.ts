import type { PlasmoMessaging } from "@plasmohq/messaging";
import { extensionStorage, STORAGE_KEYS } from "~lib/storage";

export type RequestBody = undefined;
export type RequestResponse = {
   message: string;
};

export async function openOptionsPageHandler() {
   await extensionStorage.set(STORAGE_KEYS.activeTab, "promptFactory");
   chrome.runtime.openOptionsPage();
   return {
      message: "Options page opened",
   };
}

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse
> = async (req, res) => {
   const result = await openOptionsPageHandler();
   res.send(result);
};

export default handler;
