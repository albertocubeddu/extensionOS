export type ProviderName =
   | "extension | OS"
   | "groq"
   | "openai"
   | "together"
   | "localhost";

export type LlmProvider = {
   name: ProviderName;
   models: string[];
   endpoint?: string;
};

export const DEFAULT_LLM_PROVIDER: ProviderName = "extension | OS";
export const DEFAULT_LLM_MODEL = "llama-3.3-70b-versatile";
export const DEFAULT_LOCALHOST_ENDPOINT =
   "http://localhost:11434/v1/chat/completions";

export const LLM_PROVIDERS: LlmProvider[] = [
   {
      name: "extension | OS",
      models: [
         DEFAULT_LLM_MODEL,
         "llama-3.1-8b-instant",
         "openai/gpt-oss-120b",
         "openai/gpt-oss-20b",
      ],
      endpoint: process.env.PLASMO_PUBLIC_EXTENSION_OS_API_ENDPOINT,
   },
   {
      name: "groq",
      models: [
         DEFAULT_LLM_MODEL,
         "llama-3.1-8b-instant",
         "openai/gpt-oss-120b",
         "openai/gpt-oss-20b",
      ],
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
   },
   {
      name: "openai",
      models: [
         "gpt-4",
         "gpt-5",
         "gpt-5-mini",
         "gpt-5-nano",
         "gpt-5-pro",
         "gpt-4o-mini",
         "gpt-3.5-turbo",
         "gpt-4o",
         "gpt-4.1",
         "o1-mini",
         "o1",
         "o1-pro",
         "o3-mini",
         "o3",
      ],
      endpoint: "https://api.openai.com/v1/chat/completions",
   },
   {
      name: "together",
      models: [
         "Austism/chronos-hermes-13b",
         "Gryphe/MythoMax-L2-13b",
         "HuggingFaceH4/zephyr-7b-beta",
         "NousResearch/Hermes-2-Theta-Llama-3-70B",
         "NousResearch/Nous-Capybara-7B-V1p9",
         "NousResearch/Nous-Hermes-2-Mistral-7B-DPO",
         "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
         "NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT",
         "NousResearch/Nous-Hermes-2-Yi-34B",
         "NousResearch/Nous-Hermes-Llama2-13b",
         "NousResearch/Nous-Hermes-Llama2-70b",
         "NousResearch/Nous-Hermes-llama-2-7b",
         "Open-Orca/Mistral-7B-OpenOrca",
         "Qwen/Qwen1.5-0.5B-Chat",
         "Qwen/Qwen1.5-1.8B-Chat",
         "Qwen/Qwen1.5-110B-Chat",
         "Qwen/Qwen1.5-14B-Chat",
         "Qwen/Qwen1.5-32B-Chat",
         "Qwen/Qwen1.5-4B-Chat",
         "Qwen/Qwen1.5-72B-Chat",
         "Qwen/Qwen1.5-7B-Chat",
         "Qwen/Qwen2-1.5B-Instruct",
         "Qwen/Qwen2-72B",
         "Qwen/Qwen2-72B-Instruct",
         "Qwen/Qwen2-7B",
         "Qwen/Qwen2-7B-Instruct",
         "Snowflake/snowflake-arctic-instruct",
         "Undi95/ReMM-SLERP-L2-13B",
         "Undi95/Toppy-M-7B",
         "WizardLM/WizardLM-13B-V1.2",
         "allenai/OLMo-7B-Instruct",
         "carson/ml31405bit",
         "carson/ml3170bit",
         "carson/ml318bit",
         "carson/ml318br",
         "codellama/CodeLlama-13b-Instruct-hf",
         "codellama/CodeLlama-34b-Instruct-hf",
         "codellama/CodeLlama-70b-Instruct-hf",
         "codellama/CodeLlama-7b-Instruct-hf",
         "cognitivecomputations/dolphin-2.5-mixtral-8x7b",
         "databricks/dbrx-instruct",
         "deepseek-ai/deepseek-coder-33b-instruct",
         "deepseek-ai/deepseek-llm-67b-chat",
         "garage-bAInd/Platypus2-70B-instruct",
         "google/gemma-2-27b-it",
         "google/gemma-2-9b-it",
         "google/gemma-2b-it",
         "google/gemma-7b-it",
         "gradientai/Llama-3-70B-Instruct-Gradient-1048k",
         "lmsys/vicuna-13b-v1.3",
         "lmsys/vicuna-13b-v1.5",
         "lmsys/vicuna-13b-v1.5-16k",
         "lmsys/vicuna-7b-v1.3",
         "lmsys/vicuna-7b-v1.5",
         "meta-llama/Llama-2-13b-chat-hf",
         "meta-llama/Llama-2-70b-chat-hf",
         "meta-llama/Llama-2-7b-chat-hf",
         "meta-llama/Llama-3-70b-chat-hf",
         "meta-llama/Llama-3-8b-chat-hf",
         "meta-llama/Meta-Llama-3-70B-Instruct",
         "meta-llama/Meta-Llama-3-70B-Instruct-Lite",
         "meta-llama/Meta-Llama-3-70B-Instruct-Turbo",
         "meta-llama/Meta-Llama-3-8B-Instruct",
         "meta-llama/Meta-Llama-3-8B-Instruct-Lite",
         "meta-llama/Meta-Llama-3-8B-Instruct-Turbo",
         "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
         "meta-llama/Meta-Llama-3.1-70B-Instruct-Reference",
         "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
         "meta-llama/Meta-Llama-3.1-70B-Reference",
         "meta-llama/Meta-Llama-3.1-8B-Instruct-Reference",
         "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
         "microsoft/WizardLM-2-8x22B",
         "mistralai/Mistral-7B-Instruct-v0.1",
         "mistralai/Mistral-7B-Instruct-v0.2",
         "mistralai/Mistral-7B-Instruct-v0.3",
         "mistralai/Mixtral-8x22B-Instruct-v0.1",
         "mistralai/Mixtral-8x7B-Instruct-v0.1",
         "openchat/openchat-3.5-1210",
         "snorkelai/Snorkel-Mistral-PairRM-DPO",
         "teknium/OpenHermes-2-Mistral-7B",
         "teknium/OpenHermes-2p5-Mistral-7B",
         "togethercomputer/CodeLlama-13b-Instruct",
         "togethercomputer/CodeLlama-34b-Instruct",
         "togethercomputer/CodeLlama-7b-Instruct",
         "togethercomputer/Koala-13B",
         "togethercomputer/Koala-7B",
         "togethercomputer/Llama-2-7B-32K-Instruct",
         "togethercomputer/Llama-3-8b-chat-hf-int4",
         "togethercomputer/Llama-3-8b-chat-hf-int8",
         "togethercomputer/SOLAR-10.7B-Instruct-v1.0-int4",
         "togethercomputer/StripedHyena-Nous-7B",
         "togethercomputer/alpaca-7b",
         "togethercomputer/guanaco-13b",
         "togethercomputer/guanaco-33b",
         "togethercomputer/guanaco-65b",
         "togethercomputer/guanaco-7b",
         "togethercomputer/llama-2-13b-chat",
         "togethercomputer/llama-2-70b-chat",
         "togethercomputer/llama-2-7b-chat",
         "upstage/SOLAR-10.7B-Instruct-v1.0",
         "zero-one-ai/Yi-34B-Chat",
      ],
      endpoint: "https://api.together.xyz/v1/chat/completions",
   },
   {
      name: "localhost",
      models: ["llama3"],
   },
];

export const providersData = {
   providers: LLM_PROVIDERS,
};

export function isProviderName(provider: unknown): provider is ProviderName {
   return (
      typeof provider === "string" &&
      LLM_PROVIDERS.some((candidate) => candidate.name === provider)
   );
}

export function getProvider(provider: unknown): LlmProvider {
   if (isProviderName(provider)) {
      return (
         LLM_PROVIDERS.find((candidate) => candidate.name === provider) ??
         LLM_PROVIDERS[0]
      );
   }

   return LLM_PROVIDERS[0];
}

export function getDefaultModelForProvider(provider: unknown): string {
   const selectedProvider = getProvider(provider);
   return selectedProvider.models[0] ?? DEFAULT_LLM_MODEL;
}

export function getProviderEndpoint(
   provider: unknown,
   customEndpoint?: string
): string {
   if (provider === "localhost") {
      return customEndpoint || DEFAULT_LOCALHOST_ENDPOINT;
   }

   const selectedProvider = getProvider(provider);
   return (
      selectedProvider.endpoint ??
      getProvider(DEFAULT_LLM_PROVIDER).endpoint ??
      ""
   );
}
