import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import groqLogo from "data-base64:~assets/AppIcons/groq.png"
import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { callOpenAIReturn } from "~lib/openAITypeCall"

import { providersData } from "./LlmSettings"
import { Textarea } from "~components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Button } from "~components/ui/button"
import CardHeaderIntro from "~components/blocks/CardHeaderIntro"


// Reusable component for model selection
const ModelSelect = ({ label, value, onValueChange, models }) => (
    <div className="mb-4 w-full">
        <label className="block mb-2">{label}</label>
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className=" flex flex-row basis-1/2">
                <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
                {models.map((model) => (
                    <SelectItem key={model} value={model}>
                        {model}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
)

export default function OptionsMixtureOfAgents() {
    // Use Plasmo storage for LLM models
    const [mixtureOfAgentsModel1, setMixtureOfAgentsModel1] = useStorage(
        "mixtureOfAgentsModel1",
        ""
    )
    const [mixtureOfAgentsModel2, setMixtureOfAgentsModel2] = useStorage(
        "mixtureOfAgentsModel2",
        ""
    )
    const [mixtureOfAgentsModel3, setMixtureOfAgentsModel3] = useStorage(
        "mixtureOfAgentsModel3",
        ""
    )
    const [mixtureOfAgentsModelAggregator, setMixtureOfAgentsModelAggregator] =
        useStorage("mixtureOfAgentsModelAggregator", "")

    const [agent1Response, setAgent1Response] = useState("")
    const [agent2Response, setAgent2Response] = useState("")
    const [agent3Response, setAgent3Response] = useState("")
    const [userMessage, setUserMessage] = useState("Tell me a story about a great pirate called jack sparrow in less than 300 characters.")
    const [aggregatorResponse, setAggregatorResponse] = useState("")
    const [loading, setLoading] = useState(false) // Loading state


    // Filter GROQ provider and its models
    const groqProvider = providersData.providers.find(
        (provider) => provider.name === "groq"
    )
    const groqModels = groqProvider ? groqProvider.models : []

    const asyncMoA = async () => {
        setLoading(true) // Set loading to true
        try {
            const systemMessage = "You're a helpful assistant"
            const aggregatorMessage = `You have been provided with a set of responses from various open-source models to the latest user query. Your task is to synthesize these responses into a single, high-quality response. It is crucial to critically evaluate the information provided in these responses, recognizing that some of it may be biased or incorrect. Your response should not simply replicate the given answers but should offer a refined, accurate, and comprehensive reply to the instruction. Ensure your response is well-structured, coherent, and adheres to the highest standards of accuracy and reliability.

Responses from models:`

            const [agent1, agent2, agent3] = await Promise.all([
                callOpenAIReturn(systemMessage, userMessage, mixtureOfAgentsModel1, "groq"),
                callOpenAIReturn(systemMessage, userMessage, mixtureOfAgentsModel2, "groq"),
                callOpenAIReturn(systemMessage, userMessage, mixtureOfAgentsModel3, "groq")
            ])

            const combinedResponse = `${agent1.data}\n\n\n${agent2.data}\n\n\n${agent3.data}`

            const aggregator = await callOpenAIReturn(
                aggregatorMessage,
                combinedResponse,
                mixtureOfAgentsModelAggregator,
                "groq"
            )
            setAgent1Response(agent1.data)
            setAgent2Response(agent2.data)
            setAgent3Response(agent3.data)
            setAggregatorResponse(aggregator.data)

        } catch (error) {
            console.error("Error during Mixture of Agents processing:", error)
        } finally {
            setLoading(false) // Set loading to false
        }
    }

    return (
        <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Mixture Of Agents"} description={" Mixture of Agents is a technique where multiple agents work together. This feature is currently in beta and is subject to change over time. It exclusively supports GROQ and the models within GROQ, with a maximum of three calls to different or the same model. Groq is bloody fast, upgrade your hardware!"} badgeText="beta" />
                </CardHeader>
                <CardContent className="flex flex-col gap-5">

                    <img
                        src={groqLogo}
                        alt="GROQ Logo"
                        className="block max-w-[150px] mx-auto my-5"
                    />

                    <div className="flex flex-row gap-10 justify-between">
                        <ModelSelect
                            label="Choose a LLM model 1:"
                            value={mixtureOfAgentsModel1}
                            onValueChange={setMixtureOfAgentsModel1}
                            models={groqModels}
                        />
                        <ModelSelect
                            label="Choose a LLM model 2:"
                            value={mixtureOfAgentsModel2}
                            onValueChange={setMixtureOfAgentsModel2}
                            models={groqModels}
                        />
                        <ModelSelect
                            label="Choose a LLM model 3:"
                            value={mixtureOfAgentsModel3}
                            onValueChange={setMixtureOfAgentsModel3}
                            models={groqModels}
                        />
                    </div>
                    <ModelSelect
                        label="Choose an Aggregator model:"
                        value={mixtureOfAgentsModelAggregator}
                        onValueChange={setMixtureOfAgentsModelAggregator}
                        models={groqModels}
                    />

                    <Separator className="w-3/4 mx-auto" />

                    <div>
                        <label className="block mb-2">User Message:</label>
                        <Textarea
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your message here"
                        />
                    </div>
                    <Button className="bg-gradient-to-r from-violet-500 to-orange-500 text-white mt-0" onClick={asyncMoA} disabled={loading}>
                        {loading ? "Processing..." : "Run Mixture of Agents"}
                    </Button>



                    {!loading && aggregatorResponse && (
                        <>
                            <div className="mt-4 ">
                                <h3 className="text-xl font-bold text-[#ff66cc]">Agent 1 Response:</h3>
                                <p>{agent1Response}</p>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-[#ff66cc]">Agent 2 Response:</h3>
                                <p>{agent2Response}</p>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-[#ff66cc]">Agent 3 Response:</h3>
                                <p>{agent3Response}</p>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-[#ff66cc]">Combined Response:</h3>
                                <p className="text-base">{aggregatorResponse}</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div >
    )
}
