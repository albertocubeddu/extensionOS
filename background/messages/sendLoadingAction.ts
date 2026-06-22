import type { PlasmoMessaging } from "@plasmohq/messaging";
import {
   sendMessageToActiveTab,
   type ChromeApiResult,
} from "~lib/chromeApi";

export async function sendLoadingActionHandler(): Promise<
   ChromeApiResult<void>
> {
   return sendMessageToActiveTab({
      action: "loadingAction",
   });
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
   const result = await sendLoadingActionHandler();
   res.send(result);
};

export default handler;
