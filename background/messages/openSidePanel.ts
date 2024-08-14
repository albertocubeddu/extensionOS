import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
   console.log(req.sender.tab.id);
   await chrome.sidePanel.open({
      tabId: req.sender.tab.id ?? undefined, // Use nullish coalescing to handle undefined or null
   });

   res.send("");
};

export default handler;
