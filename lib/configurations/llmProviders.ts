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
export const DEFAULT_LOCALHOST_MODEL = "llama3.1";
export const DEFAULT_LOCALHOST_ENDPOINT =
   "http://localhost:11434/v1/chat/completions";
export const CUSTOM_LLM_MODEL_VALUE = "__custom_llm_model__";
export const CUSTOM_LLM_MODEL_LABEL = "Other";

const GROQ_CHAT_MODELS = [
   DEFAULT_LLM_MODEL,
   "llama-3.1-8b-instant",
   "openai/gpt-oss-120b",
   "openai/gpt-oss-20b",
   "groq/compound",
   "groq/compound-mini",
   "meta-llama/llama-4-scout-17b-16e-instruct",
   "qwen/qwen3-32b",
   "qwen/qwen3.6-27b",
];

export const LLM_PROVIDERS: LlmProvider[] = [
   {
      name: "extension | OS",
      models: GROQ_CHAT_MODELS,
      endpoint: process.env.PLASMO_PUBLIC_EXTENSION_OS_API_ENDPOINT,
   },
   {
      name: "groq",
      models: GROQ_CHAT_MODELS,
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
   },
   {
      name: "openai",
      models: [
         "gpt-5.5",
         "gpt-5.5-pro",
         "gpt-5.4",
         "gpt-5.4-mini",
         "gpt-5.4-nano",
         "gpt-5.4-pro",
         "gpt-5.3-codex",
         "gpt-5.2",
         "gpt-5.2-pro",
         "gpt-5.2-chat-latest",
         "gpt-5.2-codex",
         "gpt-5.1",
         "gpt-5",
         "gpt-5-mini",
         "gpt-5-nano",
         "gpt-5-pro",
         "o3-pro",
         "o3",
         "o4-mini",
         "o3-mini",
         "o1",
         "o1-mini",
         "gpt-4.1",
         "gpt-4.1-mini",
         "gpt-4.1-nano",
         "gpt-4o-mini",
         "gpt-4o",
         "gpt-4",
         "gpt-3.5-turbo",
      ],
      endpoint: "https://api.openai.com/v1/chat/completions",
   },
   {
      name: "together",
      models: [
         "moonshotai/Kimi-K2.6",
         "MiniMaxAI/MiniMax-M3",
         "MiniMaxAI/MiniMax-M2.7",
         "Qwen/Qwen3.7-Max",
         "Qwen/Qwen3.6-Plus",
         "Qwen/Qwen3.5-9B",
         "moonshotai/Kimi-K2.7-Code",
         "zai-org/GLM-5.2",
         "zai-org/GLM-5.1",
         "openai/gpt-oss-120b",
         "openai/gpt-oss-20b",
         "deepseek-ai/DeepSeek-V4-Pro",
         "nvidia/nemotron-3-ultra-550b-a55b",
         "Qwen/Qwen3-235B-A22B-Instruct-2507-tput",
         "meta-llama/Llama-3.3-70B-Instruct-Turbo",
         "essentialai/rnj-1-instruct",
         "Qwen/Qwen2.5-7B-Instruct-Turbo",
         "google/gemma-4-31B-it",
         "pearl-ai/gemma-4-31b-it",
         "google/gemma-3n-E4B-it",
         "LiquidAI/LFM2-24B-A2B",
         "meta-llama/Meta-Llama-3-8B-Instruct-Lite",
         "deepcogito/cogito-v2-1-671b",
         "Qwen/Qwen3.5-397B-A17B",
         "Qwen/Qwen3.7-Plus",
      ],
      endpoint: "https://api.together.xyz/v1/chat/completions",
   },
   {
      name: "localhost",
      models: [DEFAULT_LOCALHOST_MODEL],
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
