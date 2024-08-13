import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
   const data = await chrome.identity.getProfileUserInfo({});
   res.send({
      data,
   });
};

export default handler;
