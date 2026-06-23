import type { PlasmoMessaging } from "@plasmohq/messaging";

import { createCall, type CreateCallResponse } from "~lib/vapiOutbound";

export type RequestBody = {
   firstMessageText?: string;
   message?: string;
   recipientPhoneNumber?: string;
   systemPrompt?: string;
};

export type RequestResponse = CreateCallResponse;

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse
> = async (req, res) => {
   const result = await createCall(
      req.body?.systemPrompt ?? "",
      req.body?.message ?? "",
      req.body?.recipientPhoneNumber ??
         "Hi, this is your assistant calling. How can I help you?",
      req.body?.firstMessageText ?? ""
   );

   res.send(result);
};

export default handler;
