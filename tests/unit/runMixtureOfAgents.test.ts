import { beforeEach, describe, expect, it, vi } from "vitest";

import handler, {
   type RequestBody,
   type RequestResponse,
} from "../../background/messages/runMixtureOfAgents";
import { callOpenAIReturn } from "~lib/openAITypeCall";

vi.mock("~lib/openAITypeCall", () => ({
   callOpenAIReturn: vi.fn(),
}));

function createResponseCollector() {
   const send = vi.fn<(body: RequestResponse) => void>();
   return {
      response: {
         send,
      },
      send,
   };
}

const body: RequestBody = {
   aggregatorModel: "aggregator-model",
   model1: "model-1",
   model2: "model-2",
   model3: "model-3",
   userMessage: "Explain the selection.",
};

describe("runMixtureOfAgents message handler", () => {
   beforeEach(() => {
      vi.mocked(callOpenAIReturn).mockReset();
   });

   it("runs three agent calls and one aggregator call in the background", async () => {
      vi.mocked(callOpenAIReturn)
         .mockResolvedValueOnce({ data: "agent 1 response" })
         .mockResolvedValueOnce({ data: "agent 2 response" })
         .mockResolvedValueOnce({ data: "agent 3 response" })
         .mockResolvedValueOnce({ data: "aggregated response" });

      const { response, send } = createResponseCollector();

      await handler(
         {
            body,
            name: "runMixtureOfAgents",
         },
         response
      );

      expect(callOpenAIReturn).toHaveBeenCalledTimes(4);
      expect(callOpenAIReturn).toHaveBeenNthCalledWith(
         1,
         "You're a helpful assistant",
         body.userMessage,
         body.model1,
         "groq"
      );
      expect(callOpenAIReturn).toHaveBeenNthCalledWith(
         4,
         expect.stringContaining("Responses from models:"),
         "agent 1 response\n\n\nagent 2 response\n\n\nagent 3 response",
         body.aggregatorModel,
         "groq"
      );
      expect(send).toHaveBeenCalledWith({
         data: {
            agent1: "agent 1 response",
            agent2: "agent 2 response",
            agent3: "agent 3 response",
            aggregator: "aggregated response",
         },
      });
   });

   it("returns an error response when any model call fails", async () => {
      vi.mocked(callOpenAIReturn)
         .mockResolvedValueOnce({ data: "agent 1 response" })
         .mockResolvedValueOnce({ errorMessage: "provider failed" })
         .mockResolvedValueOnce({ data: "agent 3 response" });

      const { response, send } = createResponseCollector();

      await handler(
         {
            body,
            name: "runMixtureOfAgents",
         },
         response
      );

      expect(send).toHaveBeenCalledWith({
         errorMessage: "provider failed",
      });
   });
});
