import { Storage } from "@plasmohq/storage";

export const createCall = async (
   systemPrompt: string,
   message: string,
   customerNumber: string,
   firstMessageText: string
) => {
   const storage = new Storage();

   // Your Vapi API Authorization token
   const authToken = await storage.get("voice_outbound_authToken");
   // The Phone Number ID, and the Customer details for the call
   const phoneNumberId = await storage.get("voice_outbound_phoneNumberId");

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
      } else {
         const errorData = await response.text();
      }
   } catch (error) {
      console.error("Error creating call:", error);
   }
};
