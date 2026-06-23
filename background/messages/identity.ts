import type { PlasmoMessaging } from "@plasmohq/messaging";

export type RequestBody = undefined;
export type RequestResponse = {
   data: chrome.identity.ProfileUserInfo;
};

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse
> = async (req, res) => {
   const data = await chrome.identity.getProfileUserInfo({});
   res.send({
      data,
   });
};

export default handler;
