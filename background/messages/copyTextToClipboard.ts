import type { PlasmoMessaging } from "@plasmohq/messaging";
import {
   sendMessageToActiveTab,
   type ChromeApiResult,
} from "~lib/chromeApi";

export type RequestBody = {
   errorMessage: string;
   data: string;
};

export type RequestResponse = ChromeApiResult<void>;

export async function copyTextToClipboardHandler(
   req: Partial<RequestBody>
): Promise<ChromeApiResult<void>> {
   if (!req.errorMessage) {
      return sendMessageToActiveTab({
         action: "copyToClipboard",
         text: req.data,
      });
   }

   return sendMessageToActiveTab({
      action: "error",
      text: req.errorMessage,
   });
}

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse | undefined
> = async (req, res) => {
   const result = await copyTextToClipboardHandler(req.body);
   res.send(result);
};

export default handler;
