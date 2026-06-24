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
import React, { useEffect } from "react";

import { useStorage } from "@plasmohq/storage/hook";
import LabelWithTooltip from "~components/blocks/LabelWithTooltip";
import CardHeaderIntro from "~components/blocks/CardHeaderIntro";
import FakeSaveButton from "~components/blocks/FakeSaveButton";
import {
  LLM_PROVIDERS,
  getDefaultModelForProvider,
  type ProviderName,
} from "~lib/configurations/llmProviders";
import ProviderInstruction from "./promptFactory/ProviderInstruction";
import { ArrowBigLeftDash } from "lucide-react";
import { ExtensionOsLogin } from "./settings/ExtensionOsLogin";
import {
  DEFAULT_STORAGE_VALUES,
  storageKey,
  STORAGE_KEYS,
} from "~lib/storage";

function formatProviderName(providerName: string) {
  return providerName.charAt(0).toUpperCase() + providerName.slice(1);
}

export default function LlmSettings({ debugInfo }: { debugInfo: string }) {
  const [llmModel, setLlmModel] = useStorage<string>(
    storageKey(STORAGE_KEYS.llmModel),
    (value) => value ?? DEFAULT_STORAGE_VALUES.llmModel
  );
  const [llmProvider, setLlmProvider, { isLoading: isLlmProviderLoading }] =
    useStorage<ProviderName | string>(
      storageKey(STORAGE_KEYS.llmProvider),
      (value) => value ?? DEFAULT_STORAGE_VALUES.llmProvider
  );
  const [llmKeys, setLlmKeys] = useStorage<Record<string, string>>(
    storageKey(STORAGE_KEYS.llmKeys),
    (value) => value ?? DEFAULT_STORAGE_VALUES.llmKeys
  );
  const [llmCustomEndpoint, setLlmCustomEndpoint] = useStorage<string>(
    storageKey(STORAGE_KEYS.llmCustomEndpoint),
    (value) => value ?? DEFAULT_STORAGE_VALUES.llmCustomEndpoint
  );

  const selectedProvider = LLM_PROVIDERS.find(
    (provider) => provider.name === llmProvider
  );

  //To auto-assign a model when the provider is changed.
  useEffect(() => {
    if (isLlmProviderLoading) {
      return;
    }

    if (!selectedProvider) {
      return;
    }

    if (!selectedProvider.models.includes(llmModel)) {
      setLlmModel(getDefaultModelForProvider(llmProvider));
    }
  }, [isLlmProviderLoading, llmModel, llmProvider, selectedProvider, setLlmModel]);

  const handleKeyChange = (provider: string, key: string) => {
    setLlmKeys((prevKeys) => ({ ...prevKeys, [provider]: key }));
  };

  const getCurrentKey = () => llmKeys?.[llmProvider] || "";

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
                    {LLM_PROVIDERS.map((provider) => (
                      <SelectItem key={provider.name} value={provider.name}>
                        {formatProviderName(provider.name)}
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

          {selectedProvider && (
            <div>
              <div className="flex flex-col gap-1">
                <LabelWithTooltip
                  keyTooltip={"llmModel"}
                  labelText={"Default Model"}
                  tooltipText={
                    "This is the LLM model that will be used by default."
                  }
                />
                {selectedProvider.models.length > 0 &&
                selectedProvider.name !== "localhost" ? (
                  <Select value={llmModel} onValueChange={setLlmModel}>
                    <SelectTrigger id="llm-model" className="w-full">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvider.models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          )}

          {selectedProvider?.name === "localhost" && (
            <div>
              <div className="flex flex-col gap-1">
                <LabelWithTooltip
                  keyTooltip={"llmModel"}
                  labelText={"Default Endpoint"}
                  tooltipText={
                    "This is the endpoint that will be used by default."
                  }
                />
                <Input
                  type="text"
                  id="model-input"
                  value={llmCustomEndpoint}
                  onChange={(e) => setLlmCustomEndpoint(e.target.value)}
                  placeholder="Enter LLM endpoint"
                  className="border border-input rounded-md p-2 w-full"
                />
              </div>
            </div>
          )}

          {selectedProvider &&
            selectedProvider.models.length > 0 &&
            selectedProvider.name !== "extension | OS" &&
            selectedProvider.name !== "localhost" && (
              <div>
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
              </div>
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
