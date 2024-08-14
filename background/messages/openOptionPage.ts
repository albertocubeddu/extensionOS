import type { PlasmoMessaging } from "@plasmohq/messaging";
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

export async function openOptionsPageHandler() {
   await storage.set("activeTab", "promptFactory");
   chrome.runtime.openOptionsPage();
   return {
      message: "Options page opened",
   };
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
   const result = await openOptionsPageHandler();
   res.send(result);
};

export default handler;
