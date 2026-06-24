import type { PlasmoMessaging } from "@plasmohq/messaging";

import {
   saveContextMenuItems,
   type ContextMenuItemsResponse,
} from "~background/contextMenuStorage";
import type { ContextMenuItem } from "~lib/configurations/contextMenuItems";

export type RequestBody = {
   items: ContextMenuItem[];
};

export type RequestResponse =
   | ContextMenuItemsResponse
   | {
        errorMessage: string;
     };

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse
> = async (req, res) => {
   try {
      const result = await saveContextMenuItems(req.body?.items);
      res.send(result);
   } catch (error) {
      res.send({
         errorMessage: error instanceof Error ? error.message : String(error),
      });
   }
};

export default handler;
