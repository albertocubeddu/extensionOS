import type { PlasmoMessaging } from "@plasmohq/messaging";

export type RequestBody = {
   errorMessage: string;
   data: string;
};

export type RequestResponse = string;

export async function copyTextToClipboardHandler(req) {
   if (!req.errorMessage) {
      try {
         chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
               if (tabs[0]?.id) {
                  chrome.tabs.sendMessage(tabs[0].id, {
                     action: "copyToClipboard",
                     text: req.data,
                  });
               } else {
                  throw new Error("No active tab found.");
               }
            }
         );
      } catch (error) {
         console.error("Failed to copy text to clipboard:", error);
      }
   } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, {
               action: "error",
               text: req.errorMessage,
            });
         } else {
            throw new Error("No active tab found.");
         }
      });
   }
}

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse | undefined
> = async (req, res) => {
   copyTextToClipboardHandler(req.body);
};

export default handler;
