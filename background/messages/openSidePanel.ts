import type { PlasmoMessaging } from "@plasmohq/messaging";
import { openSidePanelForTab } from "~lib/chromeApi";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
   const result = await openSidePanelForTab(req.sender.tab?.id);
   res.send(result);
};

export default handler;
