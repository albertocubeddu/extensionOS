import type { PlasmoMessaging } from "@plasmohq/messaging";

import {
   runContextMenuActionById,
   type ContextMenuActionResponse,
} from "~background/contextMenuActions";

export type RequestBody = {
   itemId: string;
   selectedText?: string;
};

export type RequestResponse = ContextMenuActionResponse;

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse
> = async (req, res) => {
   const result = await runContextMenuActionById(
      req.body?.itemId,
      req.body?.selectedText
   );

   res.send(result);
};

export default handler;
