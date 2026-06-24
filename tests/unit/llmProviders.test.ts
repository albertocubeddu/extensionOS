import { describe, expect, it } from "vitest";

import {
   CUSTOM_LLM_MODEL_VALUE,
   DEFAULT_LLM_MODEL,
   DEFAULT_LLM_PROVIDER,
   DEFAULT_LOCALHOST_MODEL,
   DEFAULT_LOCALHOST_ENDPOINT,
   getDefaultModelForProvider,
   getProvider,
   getProviderEndpoint,
   isProviderName,
} from "../../lib/configurations/llmProviders";

describe("LLM provider configuration", () => {
   it("recognizes supported provider names and rejects unknown names", () => {
      expect(isProviderName("groq")).toBe(true);
      expect(isProviderName(DEFAULT_LLM_PROVIDER)).toBe(true);
      expect(isProviderName("anthropic")).toBe(false);
      expect(isProviderName(undefined)).toBe(false);
   });

   it("falls back to the default provider for invalid stored values", () => {
      expect(getProvider("missing-provider").name).toBe(DEFAULT_LLM_PROVIDER);
      expect(getDefaultModelForProvider("missing-provider")).toBe(
         DEFAULT_LLM_MODEL
      );
   });

   it("selects the first model as the provider default", () => {
      expect(getDefaultModelForProvider("openai")).toBe("gpt-5.5");
      expect(getDefaultModelForProvider("together")).toBe("moonshotai/Kimi-K2.6");
      expect(getDefaultModelForProvider("localhost")).toBe(
         DEFAULT_LOCALHOST_MODEL
      );
   });

   it("keeps the custom model option out of provider API model lists", () => {
      expect(getProvider("openai").models).not.toContain(CUSTOM_LLM_MODEL_VALUE);
      expect(getProvider("together").models).not.toContain(
         CUSTOM_LLM_MODEL_VALUE
      );
   });

   it("uses custom localhost endpoints and stable third-party endpoints", () => {
      expect(getProviderEndpoint("localhost")).toBe(DEFAULT_LOCALHOST_ENDPOINT);
      expect(getProviderEndpoint("localhost", "http://127.0.0.1:9999/v1")).toBe(
         "http://127.0.0.1:9999/v1"
      );
      expect(getProviderEndpoint("groq")).toBe(
         "https://api.groq.com/openai/v1/chat/completions"
      );
      expect(getProviderEndpoint("openai")).toBe(
         "https://api.openai.com/v1/chat/completions"
      );
   });
});
