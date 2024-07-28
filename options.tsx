import "./globals.css"

import React, { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import OptionsAbout from "~options/OptionsAbout"
import OptionsGeneral from "~options/OptionsGeneral"
import OptionsHeader from "~options/OptionsHeader"
import OptionsMixtureOfAgents from "~options/OptionsMixtureOfAgents"
import OptionsPromptFactory from "~options/OptionsPromptFactory"

// ================================
// MAIN FUNCTION (OPTIONS)
// --------------------------------
export default function Options() {
  // Use Plasmo's useStorage hook to interact with chrome.storage
  const [yourCustomPrompt, setYourCustomPrompt] = useStorage(
    "yourCustomPrompt",
    ""
  )
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="flex min-h-screen w-full flex-col">
      <OptionsHeader></OptionsHeader>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground"
            x-chunk="dashboard-04-chunk-0">
            {["general", "promptFactory", "mixtureOfAgents", "about"].map(
              (tab) => (
                <Button
                  key={tab}
                  className={`font-semibold ${activeTab === tab ? "text-primary bg-black text-white" : "bg-white text-gray-400"} rounded-lg p-2 shadow-md`}
                  onClick={() => setActiveTab(tab)}
                  type="button">
                  {tab.charAt(0).toUpperCase() +
                    tab.slice(1).replace(/([A-Z])/g, " $1")}
                </Button>
              )
            )}
          </nav>
          {activeTab === "general" && <OptionsGeneral />}
          {activeTab === "promptFactory" && <OptionsPromptFactory />}
          {activeTab === "mixtureOfAgents" && <OptionsMixtureOfAgents />}
          {activeTab === "about" && <OptionsAbout />}
        </div>
      </main>
    </div>
  )
}
