import { Storage } from "@plasmohq/storage";

import {
   DEFAULT_LLM_MODEL,
   DEFAULT_LLM_PROVIDER,
   DEFAULT_LOCALHOST_ENDPOINT,
   type ProviderName,
} from "./configurations/llmProviders";

export const extensionStorage = new Storage();

export const STORAGE_KEYS = {
   activeTab: "activeTab",
   contextMenuItems: "contextMenuItems",
   debugInfo: "debugInfo",
   globalConfig: "globalConfig",
   llmCustomEndpoint: "llmCustomEndpoint",
   llmKeys: "llmKeys",
   llmModel: "llmModel",
   llmProvider: "llmProvider",
   voiceOutboundAuthToken: "voice_outbound_authToken",
   voiceOutboundPhoneNumberId: "voice_outbound_phoneNumberId",
} as const;

export type LlmKeys = Record<string, string>;

export const DEFAULT_STORAGE_VALUES = {
   activeTab: "general",
   debugInfo: "unchecked",
   llmCustomEndpoint: DEFAULT_LOCALHOST_ENDPOINT,
   llmKeys: {} as LlmKeys,
   llmModel: DEFAULT_LLM_MODEL,
   llmProvider: DEFAULT_LLM_PROVIDER as ProviderName | string,
   voiceOutboundAuthToken: "",
   voiceOutboundPhoneNumberId: "",
} as const;

export function storageKey<T>(key: string) {
   return {
      key,
      instance: extensionStorage,
   };
}

export async function getLlmSettings() {
   const [storedModel, storedVendor, llmKeys, customEndpoint] =
      await Promise.all([
         extensionStorage
            .get<string>(STORAGE_KEYS.llmModel)
            .then((model) => model ?? DEFAULT_STORAGE_VALUES.llmModel),
         extensionStorage
            .get<ProviderName | string>(STORAGE_KEYS.llmProvider)
            .then((provider) => provider ?? DEFAULT_STORAGE_VALUES.llmProvider),
         extensionStorage
            .get<LlmKeys>(STORAGE_KEYS.llmKeys)
            .then((keys) => keys ?? DEFAULT_STORAGE_VALUES.llmKeys),
         extensionStorage
            .get<string>(STORAGE_KEYS.llmCustomEndpoint)
            .then((endpoint) => endpoint ?? DEFAULT_STORAGE_VALUES.llmCustomEndpoint),
      ]);

   return {
      customEndpoint,
      llmKeys,
      storedModel,
      storedVendor,
   };
}

export async function getVoiceOutboundSettings() {
   const [authToken, phoneNumberId] = await Promise.all([
      extensionStorage
         .get<string>(STORAGE_KEYS.voiceOutboundAuthToken)
         .then((value) => value ?? DEFAULT_STORAGE_VALUES.voiceOutboundAuthToken),
      extensionStorage
         .get<string>(STORAGE_KEYS.voiceOutboundPhoneNumberId)
         .then((value) => value ?? DEFAULT_STORAGE_VALUES.voiceOutboundPhoneNumberId),
   ]);

   return {
      authToken,
      phoneNumberId,
   };
}
