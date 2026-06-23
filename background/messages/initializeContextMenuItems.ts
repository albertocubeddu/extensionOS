import type { PlasmoMessaging } from "@plasmohq/messaging";

import {
   initializeContextMenuItems,
   type ContextMenuItemsResponse,
} from "~background/contextMenuStorage";

export type RequestBody = {
   recreateMenus?: boolean;
};

export type RequestResponse = ContextMenuItemsResponse;

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse
> = async (req, res) => {
   const result = await initializeContextMenuItems(
      req.body?.recreateMenus ?? false
   );

   res.send(result);
};

export default handler;
