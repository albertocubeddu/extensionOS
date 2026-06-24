import type { PlasmoMessaging } from "@plasmohq/messaging";

import { callOpenAIReturn } from "~lib/openAITypeCall";

export type RequestBody = {
   aggregatorModel: string;
   model1: string;
   model2: string;
   model3: string;
   userMessage: string;
};

export type RequestResponse =
   | {
        data: {
           agent1: string;
           agent2: string;
           agent3: string;
           aggregator: string;
        };
     }
   | {
        errorMessage: string;
     };

function getResponseData(response: { data?: string; errorMessage?: string }) {
   if (response.errorMessage) {
      throw new Error(response.errorMessage);
   }

   if (!response.data) {
      throw new Error("LLM response was empty.");
   }

   return response.data;
}

const handler: PlasmoMessaging.MessageHandler<
   RequestBody,
   RequestResponse
> = async (req, res) => {
   try {
      const systemMessage = "You're a helpful assistant";
      const aggregatorMessage = `You have been provided with a set of responses from various open-source models to the latest user query. Your task is to synthesize these responses into a single, high-quality response. It is crucial to critically evaluate the information provided in these responses, recognizing that some of it may be biased or incorrect. Your response should not simply replicate the given answers but should offer a refined, accurate, and comprehensive reply to the instruction. Ensure your response is well-structured, coherent, and adheres to the highest standards of accuracy and reliability.

Responses from models:`;

      const [agent1Response, agent2Response, agent3Response] = await Promise.all([
         callOpenAIReturn(systemMessage, req.body.userMessage, req.body.model1, "groq"),
         callOpenAIReturn(systemMessage, req.body.userMessage, req.body.model2, "groq"),
         callOpenAIReturn(systemMessage, req.body.userMessage, req.body.model3, "groq"),
      ]);

      const agent1 = getResponseData(agent1Response);
      const agent2 = getResponseData(agent2Response);
      const agent3 = getResponseData(agent3Response);

      const combinedResponse = `${agent1}\n\n\n${agent2}\n\n\n${agent3}`;
      const aggregatorResponse = await callOpenAIReturn(
         aggregatorMessage,
         combinedResponse,
         req.body.aggregatorModel,
         "groq"
      );

      res.send({
         data: {
            agent1,
            agent2,
            agent3,
            aggregator: getResponseData(aggregatorResponse),
         },
      });
   } catch (error) {
      res.send({
         errorMessage: error instanceof Error ? error.message : String(error),
      });
   }
};

export default handler;
