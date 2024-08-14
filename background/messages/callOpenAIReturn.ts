import type { PlasmoMessaging } from "@plasmohq/messaging";
import { callOpenAIReturn } from "~lib/openAITypeCall";

export type RequestBody = {
   prompt: string;
   selectedText: string;
};

const handler: PlasmoMessaging.MessageHandler = async (request, response) => {
   const { prompt, selectedText } = request.body;

   const responseFromApi = await callOpenAIReturn(prompt, selectedText);
   response.send(responseFromApi);
};

export default handler;
