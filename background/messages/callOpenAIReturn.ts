import type { PlasmoMessaging } from "@plasmohq/messaging";
import { callOpenAIReturn, type ApiResponse } from "~lib/openAITypeCall";
import type { ProviderName } from "~lib/configurations/llmProviders";

export type RequestBody = {
   overrideModel?: string;
   overrideProvider?: ProviderName | string;
   prompt: string;
   selectedText: string;
};

export type RequestResponse = ApiResponse<string>;

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse
> = async (request, response) => {
   const { overrideModel, overrideProvider, prompt, selectedText } = request.body;

   const responseFromApi = await callOpenAIReturn(
      prompt,
      selectedText,
      overrideModel,
      overrideProvider
   );
   response.send(responseFromApi);
};

export default handler;
