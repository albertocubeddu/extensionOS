import type { PlasmoMessaging } from "@plasmohq/messaging";
import { sendRuntimeMessage } from "~lib/chromeApi";
import type { ChromeApiResult } from "~lib/chromeApi";

export type RequestBody = {
   data: string;
};

export type RequestResponse = ChromeApiResult<void>;

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse
> = async (request, response) => {
   const result = await sendRuntimeMessage({
      action: "send_to_sidepanel",
      payload: request.body.data,
   });
   response.send(result);
};

export default handler;
