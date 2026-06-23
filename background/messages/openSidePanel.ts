import type { PlasmoMessaging } from "@plasmohq/messaging";
import {
   openSidePanelForTab,
   type ChromeApiResult,
} from "~lib/chromeApi";

export type RequestBody = undefined;
export type RequestResponse = ChromeApiResult<void>;

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse
> = async (req, res) => {
   const result = await openSidePanelForTab(req.sender.tab?.id);
   res.send(result);
};

export default handler;
