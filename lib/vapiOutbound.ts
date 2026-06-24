import { getVoiceOutboundSettings } from "~lib/storage";

export type CreateCallResponse =
   | {
        ok: true;
        data?: unknown;
     }
   | {
        ok: false;
        error: string;
     };

export const createCall = async (
   systemPrompt: string,
   message: string,
   customerNumber: string,
   firstMessageText: string
): Promise<CreateCallResponse> => {
   const { authToken, phoneNumberId } = await getVoiceOutboundSettings();

   // Create the header with Authorization token
   const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
   };

   const data = {
      assistant: {
         firstMessage: firstMessageText,
         model: {
            provider: "openai",
            model: "gpt-4o-mini",
            messages: [
               {
                  role: "system",
                  content: systemPrompt + message,
               },
            ],
         },
         voice: "jennifer-playht",
      },
      phoneNumberId: phoneNumberId,
      customer: {
         number: customerNumber,
      },
   };

   try {
      const response = await fetch("https://api.vapi.ai/call/phone", {
         method: "POST",
         headers: headers,
         body: JSON.stringify(data),
      });

      if (response.status === 201) {
         const responseData = await response.json();
         return {
            ok: true,
            data: responseData,
         };
      } else {
         const errorData = await response.text();
         return {
            ok: false,
            error: errorData || `Vapi responded with HTTP status ${response.status}`,
         };
      }
   } catch (error) {
      console.error("Error creating call:", error);
      return {
         ok: false,
         error: error instanceof Error ? error.message : String(error),
      };
   }
};
