import "./globals.css"

import React, { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import OptionsAbout from "~options/OptionsAbout"
import OptionsGeneral from "~options/OptionsGeneral"
import OptionsHeader from "~options/OptionsHeader"
import OptionsMixtureOfAgents from "~options/OptionsMixtureOfAgents"
import OptionsPromptFactory from "~options/OptionsPromptFactory"
import OptionsSettings from "~options/OptionsSettings"

// ================================
// MAIN FUNCTION (OPTIONS)
// --------------------------------
export default function Options() {

    const [activeTab, setActiveTab] = useStorage<string>("activeTab", "general")

    return (
        <div className="flex min-h-screen w-full flex-col">
            <OptionsHeader></OptionsHeader>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-black p-4  md:gap-8 md:p-10">

                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <nav
                        className="grid gap-4 text-sm text-muted-foreground"
                        x-chunk="dashboard-04-chunk-0">
                        {["general", "promptFactory", "mixtureOfAgents", "settings", "about"].map(
                            (tab) => (
                                <div
                                    key={tab}
                                    id={tab}
                                    className={` font-light text-xl cursor-pointer rounded-lg  ${activeTab === tab ? "bg-black text-[#ff66cc] os-text-gradient" : "text-white"} shadow-md  `}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() +
                                        tab.slice(1).replace(/([A-Z])/g, " $1")}
                                </div>
                            )
                        )}
                    </nav>
                    {activeTab === "general" && <OptionsGeneral />}
                    {activeTab === "promptFactory" && <OptionsPromptFactory />}
                    {activeTab === "mixtureOfAgents" && <OptionsMixtureOfAgents />}
                    {activeTab === "settings" && <OptionsSettings />}
                    {activeTab === "about" && <OptionsAbout />}
                </div>
            </main>
        </div>
    )
}
