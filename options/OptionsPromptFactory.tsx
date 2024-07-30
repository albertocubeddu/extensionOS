import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { Label } from "~components/ui/label";
import { Storage } from "@plasmohq/storage";

import { Input } from "~components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~components/ui/select";
import { Textarea } from "~components/ui/textarea";
import { cleanProperties } from "~lib/cleanContextMenu";

const storage = new Storage();

import type { IContextConfigItems } from "~background/init";
import LabelWithTooltip from "../components/blocks/LabelWithTooltip";

export default function OptionsPromptFactory() {
    const [contextMenuItems, setContextMenuItems] = useState<IContextConfigItems[]>([]);
    const [myOwnPromptState, setMyOwnPromptState] = useState("");

    useEffect(() => {
        async function getStorage() {
            const items = await storage.get<Array<IContextConfigItems>>("contextMenuItems");
            setContextMenuItems(items);
        }

        async function getMyOwnPrompt() {
            const myOwnPrompt = await storage.get("myOwnPrompt");
            setMyOwnPromptState(myOwnPrompt ?? "");
        }

        getStorage();
        getMyOwnPrompt();
    }, []);

    /*
    This is needed, because we don't have any context when we are calling the listener on the background
    that is the one aware of opening the sidebar. Need to find a solution for the chrome.storage ASAP.
    */
    const handleChange = (id, prop, value) => {
        console.log(id, prop, value);

        setContextMenuItems((prevItems) =>
            prevItems.map(item => {
                if (item.id === id) {
                    let newId = item.id;
                    if ("callAI-openSideBar" === value && "functionType" === prop && !item.id.startsWith("side_")) {
                        newId = `side_${item.id}`;
                    } else if ("callAI-openSideBar" !== value && "functionType" === prop && item.id.startsWith("side_")) {
                        newId = item.id.replace(/^side_/, '');
                    }
                    return { ...item, [prop]: value, id: newId };
                }
                return item;
            })
        );
    };

    //What a shit show, saving two things together. Best practice thrown in the bin. TODO: Refactor the smelly code. (10:00PM - night)
    const handleSave = async () => {
        await storage.set("contextMenuItems", contextMenuItems);
        await storage.set("myOwnPrompt", myOwnPromptState);

        const cleanedContextMenuItems = cleanProperties(contextMenuItems);

        // Remove all existing context menu items
        chrome.contextMenus.removeAll(() => {
            // Create new context menu items
            cleanedContextMenuItems.forEach((item) => {
                chrome.contextMenus.create(item);
            });
        });

        alert("Changes saved!");
    };

    return (
        <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardTitle>Prompt Factory</CardTitle>
                    <CardDescription>
                        Welcome to the Prompt Factory, where you can set new prompts
                        in the Extension | OS. The section it's in is early version,
                        and it will allow to add/remove and modify every prompt.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {contextMenuItems ? (
                        <div>
                            {Object.keys(contextMenuItems).map((key) => {
                                return (
                                    <>
                                        <div
                                            key={key}
                                            className="p-4 mb-20 border-t-4 border-t-[#ff66cc] border rounded-lg shadow-md"
                                        >
                                            <div className="flex flex-row justify-between gap-4">
                                                <div className="flex flex-col gap-1 w-3/4">
                                                    <LabelWithTooltip key={key} labelText="Display Name" tooltipText="The name displayed in the menu visualised when the user clicks the right-click" />
                                                    <Input
                                                        id={`title-${key}`}
                                                        className="text-lg font-semibold mb-2"
                                                        value={contextMenuItems[key].title}
                                                        onChange={(e) => {
                                                            handleChange(
                                                                contextMenuItems[key].id,
                                                                "title",
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1 w-1/4">
                                                    <Label
                                                        className="text-sm text-gray-600"
                                                        htmlFor={`context-${key}`}
                                                    >
                                                        <LabelWithTooltip key={key} labelText="Context" tooltipText="The context in which the item should display" />
                                                    </Label>
                                                    <Select
                                                        value={contextMenuItems[key].contexts.join(", ")}
                                                        onValueChange={(value) =>
                                                            handleChange(
                                                                contextMenuItems[key].id,
                                                                "contexts",
                                                                value.split(", ")
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select contexts" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {[
                                                                "all",
                                                                "page",
                                                                "frame",
                                                                "selection",
                                                                "link",
                                                                "editable",
                                                                "image",
                                                                "video",
                                                                "audio",
                                                                "launcher",
                                                                "browser_action",
                                                                "page_action",
                                                                "action",
                                                            ].map((context) => (
                                                                <SelectItem
                                                                    key={context}
                                                                    value={context}
                                                                >
                                                                    {context}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-5 p-4 bg-gray-50 rounded-lg shadow-inner my-5">
                                                <div className="text-sm text-gray-800">
                                                    <LabelWithTooltip key={key} labelText="Prompt" tooltipText="The prompt for the GPT" />

                                                    <Textarea
                                                        id={`prompt-${key}`}
                                                        className="mt-1 p-2 border rounded-md"
                                                        value={contextMenuItems[key].prompt}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                contextMenuItems[key].id,
                                                                "prompt",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter your prompt here"
                                                    />
                                                </div>
                                                <div className="flex flex-row gap-4">
                                                    <div className="text-sm text-gray-800 w-1/2">
                                                        <div className="flex flex-col gap-1">
                                                            <LabelWithTooltip key={key} labelText="Functionality" tooltipText="The functionality after the prompt is executed" />
                                                            <Select
                                                                value={contextMenuItems[key].functionType}
                                                                onValueChange={(value) =>
                                                                    handleChange(contextMenuItems[key].id, "functionType", value)
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select function type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {[
                                                                        { key: "callAI-copyClipboard", value: "Copy to Clipboard" },
                                                                        { key: "callAI-openSideBar", value: "Write to Sidebar" },
                                                                        { key: "callVoice-ExternalNumber", value: "Call External Number" }
                                                                    ].map((type) => (
                                                                        <SelectItem key={type.key} value={type.key}>
                                                                            {type.value}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-600 w-1/2">
                                                        <div className="flex flex-col gap-1">
                                                            <LabelWithTooltip key={key} labelText="ID" tooltipText="Unique Identification used internally" />
                                                            <p className="p-2 h-10 border rounded-md bg-white">
                                                                {contextMenuItems[key].id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-row justify-center">
                                                <Button onClick={() => handleSave()}>
                                                    Save All
                                                </Button>
                                            </div>


                                        </div>
                                    </>

                                );
                            })}
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
