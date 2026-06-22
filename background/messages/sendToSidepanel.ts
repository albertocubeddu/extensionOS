import type { PlasmoMessaging } from "@plasmohq/messaging";
import { sendRuntimeMessage } from "~lib/chromeApi";

export type RequestBody = {
   data: string;
};

const handler: PlasmoMessaging.MessageHandler = async (request, response) => {
   const result = await sendRuntimeMessage({
      action: "send_to_sidepanel",
      payload: request.body.data,
   });
   response.send(result);
};

export default handler;
