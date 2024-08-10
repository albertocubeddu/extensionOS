// ------------------------------------------------------------------------------------
// This file helps to connect to any of the API supporting the OPEN AI standards
// ------------------------------------------------------------------------------------

import { Storage } from "@plasmohq/storage";

// Function to map vendor names to their respective API endpoints
function vendorToEndpoint(vendor: string): string {
   console.log(vendor);
   const endpoints: { [key: string]: string } = {
      "extension | OS": process.env.PLASMO_PUBLIC_EXTENSION_OS_API_ENDPOINT,
      openai: "https://api.openai.com/v1/chat/completions",
      groq: "https://api.groq.com/openai/v1/chat/completions",
      together: "https://api.together.xyz/v1/chat/completions",
      localhost: "http://localhost:11434/v1/chat/completions",
   };
   return endpoints[vendor] || endpoints["groq"];
}

// The T is to enable us to pass different structure in the future. And the errorMessage, give us an idea of what's wrong; Even the error should have a structure.
export type ApiResponse<T> = {
   data?: T; // Optional data field for successful responses
   errorMessage?: string; // Optional error message for failed responses
};

// May change the signature and make it streamlined.
export async function callOpenAIReturn(
   systemPrompt: string,
   message: any,
   overrideModel?: string,
   overrideProvider?: string
): Promise<ApiResponse<any>> {
   const storage = new Storage();

   try {
      const [storedModel, storedVendor, llmKeys] = await Promise.all([
         storage
            .get("llmModel")
            .then((model) => model ?? "llama-3.1-70b-versatile"),
         storage
            .get("llmProvider")
            .then((provider) => provider ?? "extension | OS"),
         ,
         storage.get("llmKeys").then((key) => key ?? ""),
      ]);

      const openAIModel = overrideModel || storedModel;
      const vendor = overrideProvider || storedVendor;
      const apiKey = llmKeys ? llmKeys[vendor] : "";

      const openAIEndpoint = vendorToEndpoint(vendor);

      const bodyReq = JSON.stringify({
         model: openAIModel,
         messages: [{ role: "user", content: `${systemPrompt}${message}` }],
         stream: false,
      });

      //   ///////////////
      //   TO REFACTOR
      //   ///////////////
      const getAccessToken = async () => {
         try {
            const result = await chrome.identity.getAuthToken({
               interactive: true,
            });
            if (result) {
               return result.token;
            } else {
               return "invalid";
            }
         } catch (error) {
            return "invalid";
         }
      };

      console.log(apiKey);

      const authHeader = apiKey
         ? `Bearer ${apiKey}`
         : `Bearer ${await getAccessToken()}`;

      const headers = {
         "Content-Type": "application/json",
         Authorization: authHeader,
      };
      // ********************

      const response = await fetch(openAIEndpoint, {
         method: "POST",
         headers,
         body: bodyReq,
      });

      const data = await response.json();

      //Open the option page if the request is unauthorised; Most of the time the user didn't insert the right API keys.
      if (response.status === 401) {
         setTimeout(() => {
            chrome.runtime.openOptionsPage();
         }, 2000);
      }

      if (response.ok && data.choices?.length > 0) {
         return { data: data.choices[0].message.content };
      } else {
         console.error("Unexpected response structure:", data);

         const errorMessage =
            data.error?.message ||
            data.error?.code ||
            "An unknown error occurred.";

         return {
            errorMessage: errorMessage ?? "Unexpected response structure.",
         };
      }
   } catch (error) {
      console.error("Failed to fetch from OpenAI API:", error);
      return { errorMessage: String(error) };
   }
}
