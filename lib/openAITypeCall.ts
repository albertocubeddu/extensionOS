// ------------------------------------------------------------------------------------
// This file helps to connect to any of the API supporting the OPEN AI standards
// ------------------------------------------------------------------------------------

import { Storage } from "@plasmohq/storage";
import { useUserInfo } from "./providers/UserInfoContext";
import { getOrCreateClientUUID } from "./clientUUID";

// Function to map vendor names to their respective API endpoints
function vendorToEndpoint(vendor: string): string {
   const endpoints: { [key: string]: string } = {
      "extension | OS": process.env.PLASMO_PUBLIC_EXTENSION_OS_API_ENDPOINT,
      openai: "https://api.openai.com/v1/chat/completions",
      groq: "https://api.groq.com/openai/v1/chat/completions",
      together: "https://api.together.xyz/v1/chat/completions",
      localhost: "http://localhost:11434/v1/chat/completions",
   };
   return endpoints[vendor] || endpoints["groq"];
}

// Constants
const DEFAULT_MODEL = "llama-3.1-70b-versatile";
const DEFAULT_VENDOR = "extension | OS";

// TODO: move somewhere else
const getAccessToken = async (): Promise<string> => {
   try {
      const result = await chrome.identity.getAuthToken({ interactive: true });
      return result?.token || "invalid";
   } catch (error) {
      console.error("Failed to get auth token:", error);
      return "invalid";
   }
};

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

   const insertRow = async (table: string, data: any) => {
      const supabaseUrl = process.env.PLASMO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY; // Ensure this is set in your environment
      try {
         const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${supabaseKey}`,
               apikey: supabaseKey,
            },
            body: JSON.stringify(data),
         });

         if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            console.error("Error inserting row:", errorData);
            return {
               success: false,
               error: `Error inserting row: ${response.status} ${response.statusText}`,
            };
         }
         return { success: true }; // Indicate success
      } catch (error) {
         console.log("error");
         console.error("Unexpected error:", error);
         return { success: false, error: String(error) }; // Handle unexpected errors
      }
   };

   try {
      const [storedModel, storedVendor, llmKeys] = await Promise.all([
         storage.get("llmModel").then((model) => model ?? DEFAULT_MODEL),
         storage
            .get("llmProvider")
            .then((provider) => provider ?? DEFAULT_VENDOR),
         storage.get("llmKeys").then((key) => key ?? ""),
      ]);

      console.log("passing");

      try {
         await insertRow("statistics", {
            llmModel: storedModel,
            llmProvider: storedVendor,
            chromeUUID: await getOrCreateClientUUID(),
         });
      } catch (error) {}

      const openAIModel = overrideModel || storedModel;
      const vendor = overrideProvider || storedVendor;
      const apiKey = llmKeys ? llmKeys[vendor] : "";
      const openAIEndpoint = vendorToEndpoint(vendor);

      const headers = new Headers({
         "Content-Type": "application/json",
         Authorization: `Bearer ${apiKey || (await getAccessToken())}`,
      });

      const bodyReq = JSON.stringify({
         model: openAIModel,
         messages: [
            { role: "system", content: systemPrompt }, // Added system role
            { role: "user", content: message }, // Updated user content
         ],
         stream: false,
      });

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

      //Extension-os.com || Free Tier Exhausted
      if (response.status === 403 && vendor === "extension | OS") {
         chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
               if (tabs[0]?.id) {
                  chrome.tabs.sendMessage(tabs[0].id, {
                     action: "subscriptionLimitReached",
                     text: "3000",
                  });
               } else {
                  throw new Error("No active tab found.");
               }
            }
         );
      }

      if (!response.ok) {
         throw new Error(
            data.error?.message ||
               `3rd party API repsponded with HTTP error status: ${response.status}`
         );
      }

      if (!data.choices?.length) {
         throw new Error("Unexpected response structure");
      }

      return { data: data.choices[0].message.content };
   } catch (error) {
      return {
         errorMessage: error instanceof Error ? error.message : String(error),
      };
   }
}
