import type { PlasmoMessaging } from "@plasmohq/messaging";

export async function sendLoadingActionHandler() {
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]?.id) {
         chrome.tabs.sendMessage(tabs[0].id, {
            action: "loadingAction",
         });
      } else {
         throw new Error("No active tab found.");
      }
   });
   return {
      message: "Options page opened",
   };
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
   const result = await sendLoadingActionHandler();
   res.send(result);
};

export default handler;
