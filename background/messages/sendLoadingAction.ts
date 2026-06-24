import type { PlasmoMessaging } from "@plasmohq/messaging";
import {
   sendMessageToActiveTab,
   type ChromeApiResult,
} from "~lib/chromeApi";

export type RequestBody = undefined;
export type RequestResponse = ChromeApiResult<void>;

export async function sendLoadingActionHandler(): Promise<
   ChromeApiResult<void>
> {
   return sendMessageToActiveTab({
      action: "loadingAction",
   });
}

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse
> = async (req, res) => {
   const result = await sendLoadingActionHandler();
   res.send(result);
};

export default handler;
