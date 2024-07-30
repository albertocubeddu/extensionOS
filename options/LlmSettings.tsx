import "@/globals.css"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import groqLogo from "data-base64:~assets/AppIcons/groq.png"
import React, { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"
import LabelWithTooltip from "~components/blocks/LabelWithTooltip"
import CardHeaderIntro from "~components/blocks/CardHeaderIntro"
import FakeSaveButton from "~components/blocks/FakeSaveButton"

// Add more combination here for the future
// TODO: I may refactor it to be easier to access but whatever.
export const providersData = {
    providers: [
        {
            name: "groq",
            models: [
                "llama-3.1-70b-versatile",
                "llama-3.1-8b-instant",
                "llama3-70b-8192",
                "llama3-8b-8192",
                "mixtral-8x7b-32768",
                "gemma2-9b-it"
            ]
        },
        {
            name: "openai",
            models: ["gpt-4", "gpt-4o-mini", "gpt-3.5-turbo"]
        },
        {
            name: "together",
            models: ["google/gemma-2b"]
        },
        {
            name: "localhost",
            models: ["llama3"]
        }
    ]
}

export default function LlmSettings({ debugInfo }: { debugInfo: string }) {
    const [llmModel, setLlmModel] = useStorage("llmModel", "")
    const [llmProvider, setLlmProvider] = useStorage("llmProvider", "")
    const [llmKeys, setLlmKeys] = useStorage("llmKeys", {})

    //To auto-assign a model when the provider is changed.
    useEffect(() => {
        if (llmProvider) {
            const selectedProvider = providersData.providers.find(
                (provider) => provider.name === llmProvider
            )
            const isModelValid = selectedProvider?.models.includes(llmModel)

            if (!isModelValid) {
                setLlmModel(selectedProvider.models[0])
            }
            console.log("Is model valid:", isModelValid)
        }
    }, [llmProvider])

    const handleKeyChange = (provider, key) => {
        setLlmKeys((prevKeys) => ({ ...prevKeys, [provider]: key }))
    }

    const getCurrentKey = () => llmKeys[llmProvider] || ""

    return (
        <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
                <CardHeaderIntro title={"LLM Settings"} description={" Provide which provider and model you want to use for Extension | OS"} />
            </CardHeader>
            <CardContent >
                <div>
                    {"groq" === llmProvider && (
                        <img
                            src={groqLogo}
                            alt="GROQ Logo"
                            className="block max-w-[300px] mb-10 mt-4"
                        />
                    )}
                    <div className="flex flex-col gap-1">
                        <LabelWithTooltip key={"llmProvider"} labelText={"Default LLM Provider"} tooltipText={"This is the LLM provider that will be used by default."} />
                        <Select value={llmProvider} onValueChange={setLlmProvider}>
                            <SelectTrigger className="w-[180px]">
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
                    </div>
                </div>
                <br />
                {providersData.providers.map(
                    (provider) =>
                        llmProvider === provider.name && (
                            <div key={provider.name}>
                                <div className="flex flex-col gap-1">

                                    <LabelWithTooltip key={"llmModel"} labelText={"Default LLM Model"} tooltipText={"This is the LLM model that will be used by default."} />
                                    {provider.models.length > 0 ? (
                                        <Select value={llmModel} onValueChange={setLlmModel}>
                                            <SelectTrigger className="w-full">
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
                                    ) : (
                                        <Input
                                            type="text"
                                            id="model-input"
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
                <br />
                <div>
                    <div className="flex flex-col gap-1">
                        <LabelWithTooltip key={"llmProviderKey"} labelText={"API Key"} tooltipText={"This API Key for the seleted provider."} />
                        <Input
                            type="password"
                            id="llmKey"
                            disabled={!llmProvider}
                            value={getCurrentKey()}
                            onChange={(e) => handleKeyChange(llmProvider, e.target.value)}
                        />
                    </div>
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
    )
}
