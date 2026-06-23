import { describe, expect, it } from "vitest";

import {
   DEFAULT_STORAGE_VALUES,
   STORAGE_KEYS,
   storageKey,
} from "../../lib/storage";
import {
   DEFAULT_LLM_MODEL,
   DEFAULT_LLM_PROVIDER,
   DEFAULT_LOCALHOST_ENDPOINT,
} from "../../lib/configurations/llmProviders";

describe("Plasmo storage configuration", () => {
   it("keeps shared storage keys stable", () => {
      expect(STORAGE_KEYS).toMatchObject({
         activeTab: "activeTab",
         contextMenuItems: "contextMenuItems",
         globalConfig: "globalConfig",
         llmKeys: "llmKeys",
         voiceOutboundAuthToken: "voice_outbound_authToken",
      });
   });

   it("centralizes default values used by Plasmo storage hooks and services", () => {
      expect(DEFAULT_STORAGE_VALUES.llmModel).toBe(DEFAULT_LLM_MODEL);
      expect(DEFAULT_STORAGE_VALUES.llmProvider).toBe(DEFAULT_LLM_PROVIDER);
      expect(DEFAULT_STORAGE_VALUES.llmCustomEndpoint).toBe(
         DEFAULT_LOCALHOST_ENDPOINT
      );
      expect(DEFAULT_STORAGE_VALUES.debugInfo).toBe("unchecked");
   });

   it("creates hook keys with the shared storage instance", () => {
      const rawKey = storageKey(STORAGE_KEYS.llmModel);

      expect(rawKey.key).toBe(STORAGE_KEYS.llmModel);
      expect(rawKey.instance.area).toBe("sync");
   });
});
