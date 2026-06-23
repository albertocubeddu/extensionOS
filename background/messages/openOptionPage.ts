import type { PlasmoMessaging } from "@plasmohq/messaging";
import { extensionStorage, STORAGE_KEYS } from "~lib/storage";

export type RequestBody = undefined;
export type RequestResponse = {
   message: string;
};

type OptionsActiveTab =
   | "general"
   | "promptFactory"
   | "mixtureOfAgents"
   | "settings"
   | "about";

export async function openOptionsPageHandler(
   activeTab: OptionsActiveTab = "promptFactory"
) {
   await extensionStorage.set(STORAGE_KEYS.activeTab, activeTab);
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
