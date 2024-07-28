import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
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

// Reusable component for model selection
const ModelSelect = ({ label, value, onValueChange, models }) => (
  <div className="mb-4">
    <label className="block mb-2">{label}</label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
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
  const [aggregatorResponse, setAggregatorResponse] = useState("")

  // Filter GROQ provider and its models
  const groqProvider = providersData.providers.find(
    (provider) => provider.name === "groq"
  )
  const groqModels = groqProvider ? groqProvider.models : []

  const asyncMoA = async () => {
    try {
      const systemMessage = "You're a helpful assistant"
      const userMessage =
        "Tell me a story about a great pirate called jack sparrow in less than 300 characters."
      const aggregatorMessage = `You have been provided with a set of responses from various open-source models to the latest user query. Your task is to synthesize these responses into a single, high-quality response. It is crucial to critically evaluate the information provided in these responses, recognizing that some of it may be biased or incorrect. Your response should not simply replicate the given answers but should offer a refined, accurate, and comprehensive reply to the instruction. Ensure your response is well-structured, coherent, and adheres to the highest standards of accuracy and reliability.

Responses from models:`

      const agent1 = await callOpenAIReturn(
        systemMessage,
        userMessage,
        mixtureOfAgentsModel1,
        "groq"
      )
      const agent2 = await callOpenAIReturn(
        systemMessage,
        userMessage,
        mixtureOfAgentsModel2,
        "groq"
      )
      const agent3 = await callOpenAIReturn(
        systemMessage,
        userMessage,
        mixtureOfAgentsModel3,
        "groq"
      )

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
    }
  }

  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle className="flex flex-col items-start">
            <div className="flex justify-between w-full">
              <span>Mixture Of Agents</span>
              <Badge
                variant="outline"
                className="mb-2 text-white border-violet-500 bg-indigo-500">
                Beta
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Mixture of Agents is a technique where multiple agents work
            together:{" "}
            <a
              className="text-blue-500"
              href="https://arxiv.org/pdf/2406.04692"
              target="_blank"
              rel="noopener noreferrer">
              Read the paper
            </a>
            . This feature is currently in beta and is subject to change over
            time. It exclusively supports GROQ and the models within GROQ, with
            a maximum of three calls to different or the same model. At present,
            only one call is permitted; multiple calls to the model with varying
            parameters (e.g., different temperatures) are not yet supported.
            <b>Why?</b> Because Groq is bloody fast, upgrade your hardware!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <img
            src={groqLogo}
            alt="GROQ Logo"
            className="block max-w-[300px] mx-auto my-5"
          />
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
          <ModelSelect
            label="Choose an Aggregator model:"
            value={mixtureOfAgentsModelAggregator}
            onValueChange={setMixtureOfAgentsModelAggregator}
            models={groqModels}
          />
          <button
            onClick={asyncMoA}
            className="mt-4 bg-blue-500 text-white p-2 rounded">
            Run Mixture of Agents
          </button>

          <div className="mt-4">
            <h3 className="font-bold">Agent 1 Response:</h3>
            <p>{agent1Response}</p>
          </div>
          <div className="mt-4">
            <h3 className="font-bold">Agent 2 Response:</h3>
            <p>{agent2Response}</p>
          </div>
          <div className="mt-4">
            <h3 className="font-bold">Agent 3 Response:</h3>
            <p>{agent3Response}</p>
          </div>
          <div className="mt-4">
            <h3 className="font-bold">Combined Response:</h3>
            <p>{aggregatorResponse}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
