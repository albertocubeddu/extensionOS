import "@/globals.css";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useRef } from "react";

import { useStorage } from "@plasmohq/storage/hook";
import LabelWithTooltip from "~components/blocks/LabelWithTooltip";
import CardHeaderIntro from "~components/blocks/CardHeaderIntro";
import FakeSaveButton from "~components/blocks/FakeSaveButton";
import ProviderInstruction from "./promptFactory/ProviderInstruction";
import { ArrowBigLeftDash, ArrowBigUpDash } from "lucide-react";
import { ExtensionOsLogin } from "./settings/ExtensionOsLogin";

// Add more combination here for the future
// TODO: I may refactor it to be easier to access but whatever.
export const providersData = {
  providers: [
    {
      name: "extension | OS",
      models: [
        "llama-3.3-70b-versatile",
        "llama-3.1-70b-versatile",
        "llama-3.1-8b-instant",
        "llama3-70b-8192",
        "llama3-8b-8192",
        "mixtral-8x7b-32768",
        "gemma-7b-it",
        "gemma2-9b-it",
      ],
    },
    {
      name: "groq",
      models: [
        "llama-3.3-70b-versatile",
        "llama-3.1-70b-versatile",
        "llama-3.1-8b-instant",
        "llama3-70b-8192",
        "llama3-8b-8192",
        "mixtral-8x7b-32768",
        "gemma-7b-it",
        "gemma2-9b-it",
      ],
    },
    {
      name: "openai",
      models: ["gpt-4", "gpt-4o-mini", "gpt-3.5-turbo"],
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
    },
    {
      name: "localhost",
      models: ["llama3"],
    },
  ],
};

export default function LlmSettings({ debugInfo }: { debugInfo: string }) {
  const [llmModel, setLlmModel] = useStorage(
    "llmModel",
    "llama-3.1-70b-versatile"
  );
  const [llmProvider, setLlmProvider] = useStorage(
    "llmProvider",
    "extension | OS"
  );
  const [llmKeys, setLlmKeys] = useStorage("llmKeys", {});
  const [llmCustomEndpoint, setLlmCustomEndpoint] = useStorage(
    "llmCustomEndpoint",
    (v) => (v === undefined ? "http://localhost:11434/v1/chat/completions" : v)
  );

  const hasRun = useRef(false); // Add this line

  //To auto-assign a model when the provider is changed.
  useEffect(() => {
    if (!hasRun.current) {
      /* Plasmo storage is undefined here, it will read only the default value! */
      hasRun.current = true;
      return; // Skip the first cycle, so plasmo loads the useStorage correctly...
    }

    if (llmProvider) {
      validateAndSetModel(llmProvider);
    }
  }, [llmProvider]);

  const validateAndSetModel = (providerName) => {
    const selectedProvider = providersData.providers.find(
      (provider) => provider.name === providerName
    );

    const isModelValid = selectedProvider?.models.includes(llmModel);

    // We need to ensure the selectedProvider is valid
    // E.g. We do change a name in the config -> From OpenAI to ClosedAI (pun intended..)
    if (!isModelValid && selectedProvider) {
      setLlmModel(selectedProvider.models[0]);
    }
  };

  const handleKeyChange = (provider, key) => {
    setLlmKeys((prevKeys) => ({ ...prevKeys, [provider]: key }));
  };

  const getCurrentKey = () => llmKeys[llmProvider] || "";

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardHeaderIntro
          title={"LLM Settings"}
          description={
            " Provide which provider and model you want to use for Extension | OS"
          }
        />
      </CardHeader>
      <CardContent>
        <div className="flex flex-row pb-10 pt-5">
          <ProviderInstruction provider={llmProvider} />
          {!getCurrentKey() &&
            llmProvider &&
            llmProvider !== "extension | OS" && (
              <>
                {/* UX Note: This arrow indicates where users should click to obtain their API keys. */}
                <ArrowBigLeftDash
                  size={40}
                  strokeWidth={1}
                  className=" mx-5 text-[#ff66cc] animate-[wiggle_1s_ease-in-out_infinite]"
                />
              </>
            )}
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <div className="flex flex-col gap-1">
              <LabelWithTooltip
                keyTooltip={"llmProvider"}
                labelText={"Default Provider"}
                tooltipText={
                  "This is the LLM provider that will be used by default."
                }
              />
              <div className="flex flex-row gap-5">
                <Select value={llmProvider} onValueChange={setLlmProvider}>
                  <SelectTrigger id="llm-provider" className="w-[180px]">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providersData.providers.map((provider) => (
                      <SelectItem key={provider.name} value={provider.name}>
                        {provider.name.charAt(0).toUpperCase() +
                          provider.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {llmProvider === "extension | OS" && <ExtensionOsLogin />}

                {!llmProvider && (
                  <>
                    <ArrowBigLeftDash
                      size={40}
                      strokeWidth={1}
                      className=" mx-5 text-[#ff66cc] animate-[wiggle_1s_ease-in-out_infinite]"
                    />
                    <strong className="mr-2">Instructions:</strong> Choose a
                    provider from the list on your left.
                    <br /> The selected provider will be set as the default.
                  </>
                )}
              </div>
            </div>
          </div>
          {providersData.providers.map(
            (provider) =>
              llmProvider === provider.name && (
                <div key={provider.name}>
                  <div className="flex flex-col gap-1">
                    <LabelWithTooltip
                      keyTooltip={"llmModel"}
                      labelText={"Default Model"}
                      tooltipText={
                        "This is the LLM model that will be used by default."
                      }
                    />
                    {provider.models.length > 0 &&
                    provider.name !== "localhost" ? (
                      <>
                        <Select value={llmModel} onValueChange={setLlmModel}>
                          <SelectTrigger id="llm-model" className="w-full">
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent>
                            {provider.models.map((llmModel) => (
                              <SelectItem key={llmModel} value={llmModel}>
                                {llmModel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <Input
                        type="text"
                        id="llm-model"
                        value={llmModel}
                        onChange={(e) => setLlmModel(e.target.value)}
                        placeholder="Enter LLM model name"
                        className="border border-input rounded-md p-2 w-full"
                      />
                    )}
                  </div>
                </div>
              )
          )}
          {providersData.providers.map(
            (provider) =>
              llmProvider === provider.name &&
              provider.name === "localhost" && (
                <div key={provider.name}>
                  <div className="flex flex-col gap-1">
                    <LabelWithTooltip
                      keyTooltip={"llmModel"}
                      labelText={"Default Endpoint"}
                      tooltipText={
                        "This is the endpoint that will be used by default."
                      }
                    />
                    {
                      <Input
                        type="text"
                        id="model-input"
                        value={llmCustomEndpoint}
                        onChange={(e) => setLlmCustomEndpoint(e.target.value)}
                        placeholder="Enter LLM model name"
                        className="border border-input rounded-md p-2 w-full"
                      />
                    }
                  </div>
                </div>
              )
          )}
          {providersData.providers.map(
            (provider) =>
              llmProvider === provider.name && (
                <div key={provider.name}>
                  {provider.models.length > 0 &&
                  provider.name !== "extension | OS" &&
                  provider.name !== "localhost" ? (
                    <div className="flex flex-col gap-1">
                      <LabelWithTooltip
                        keyTooltip={"llmProviderKey"}
                        labelText={"API Key"}
                        tooltipText={"This API Key for the selected provider."}
                      />
                      <Input
                        type="password"
                        id="llm-key"
                        disabled={!llmProvider}
                        value={getCurrentKey()}
                        onChange={(e) =>
                          handleKeyChange(llmProvider, e.target.value)
                        }
                      />
                    </div>
                  ) : // Extension | OS do not need API key as it's integrated
                  null}
                </div>
              )
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <FakeSaveButton />
        {"checked" === debugInfo && (
          <div className="flex flex-col flex-1 px-4">
            <span> DEBUG</span>
            <span> Model selected: {llmModel}</span>
            <span> Provider selected: {llmProvider}</span>
            <span>
              {" "}
              Key redacted:{" "}
              {getCurrentKey().slice(0, 5) + "..." + getCurrentKey().slice(-3)}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
