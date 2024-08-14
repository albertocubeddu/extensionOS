import type { PlasmoMessaging } from "@plasmohq/messaging";

export type RequestBody = {
   data: string;
};

const handler: PlasmoMessaging.MessageHandler = async (request, response) => {
   try {
      await chrome.runtime.sendMessage({
         action: "send_to_sidepanel",
         payload: request.body.data,
      });
   } catch (error) {
      response.send("Ok");
   }
   response.send("Ok");
};

export default handler;
