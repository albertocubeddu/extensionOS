import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import { useCallback, useEffect, useState } from "react";
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

import {
    Sheet,
} from "@/components/ui/sheet"

import { Textarea } from "~components/ui/textarea";
import { cleanProperties } from "~lib/cleanContextMenu";

const storage = new Storage();

import type { IContextConfigItems } from "~background/init";
import LabelWithTooltip from "../components/blocks/LabelWithTooltip";
import CardHeaderIntro from "~components/blocks/CardHeaderIntro";
import VapiSpecificConfiguration from "./promptFactory/VapiSpecificConfiguration";
import HelpSheetContext from "./promptFactory/HelpSheetContext";
import HelpSheetFunctionality from "./promptFactory/HelpSheetFunctionality";
import { chromeContextsParameters } from "./promptFactory/parameters/chromeContextParameters";
import { functionalityParameters } from "./promptFactory/parameters/functionalityParameters";
import { AutosizeTextarea } from "~components/shadcnui-expansions/AutosizeTextarea";
import { Alert, AlertDescription, AlertTitle } from "~components/ui/alert";

export default function OptionsPromptFactory() {
    const [contextMenuItems, setContextMenuItems] = useState<IContextConfigItems[]>([]);
    const [openFunctionalitySheet, setOpenFunctionalitySheet] = useState(false);
    const [openContextSheet, setOpenContextSheet] = useState(false)

    useEffect(() => {
        async function getStorage() {
            const items = await storage.get<Array<IContextConfigItems>>("contextMenuItems");
            setContextMenuItems(items);
        }

        getStorage();
    }, []);

    /*
    This is needed, because we don't have any context when we are calling the listener on the background
    that is the one aware of opening the sidebar. Need to find a solution for the chrome.storage ASAP.
    */
    const handleChange = useCallback((id, prop, value) => {
        setContextMenuItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    let newId = item.id;

                    if (item.id.startsWith("side_") && prop === "functionType" && value !== "callAI-openSideBar") {
                        newId = item.id.replace(/^side_/, '');
                    } else if (!item.id.startsWith("side_") && value === "callAI-openSideBar") {
                        newId = `side_${item.id}`;
                    }

                    return { ...item, [prop]: value, id: newId };
                }
                return item;
            })
        );
    }, []);

    //What a shit show, saving two things together. Best practice thrown in the bin. TODO: Refactor the smelly code. (10:00PM - night)
    const handleSave = async () => {
        try {
            await storage.set("contextMenuItems", contextMenuItems);
            const cleanedContextMenuItems = cleanProperties(contextMenuItems);

            // Remove all existing context menu items
            chrome.contextMenus.removeAll(() => {
                cleanedContextMenuItems.forEach(item => chrome.contextMenus.create(item));
            });

            alert("Changes saved!");
        } catch (error) {
            console.error("Failed to save changes:", error);
            alert("Failed to save changes. Please try again.");
        }
    };



    return (
        <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardHeaderIntro title={"Prompt Factory"} description={"  Welcome to the Prompt Factory, where you can set new prompts in the Extension | OS. The section it's in is early version, and it will allow to add/remove and modify every prompt."} />
                </CardHeader>
                <CardContent>
                    {contextMenuItems ? (
                        <>
                            <div>
                                {/* We exclude the separrator and the configuration button as it's not essential for the user to see at this stage */}
                                {Object.keys(contextMenuItems).filter(key => !contextMenuItems[key].id.startsWith("separator") && contextMenuItems[key].id !== "configuration").map((key) => {
                                    return (
                                        <div
                                            key={key}
                                            className="p-4 pt-6 mb-20 border-t-8 border-l-8 border-2 rounded-lg shadow-lg"
                                        >
                                            <div className="flex flex-row justify-between gap-4 px-4">
                                                <div className="flex flex-col gap-1 w-3/4">
                                                    <LabelWithTooltip keyTooltip={key} labelText="Display Name" tooltipText="The name displayed in the menu visualised when the user clicks the right-click" />
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
                                                        <LabelWithTooltip onClick={() => setOpenContextSheet(true)} keyTooltip={key} labelText="Context" tooltipText="The context in which the item should display. Click for more info" sheetIncluded={true} />


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
                                                            {chromeContextsParameters.map(({ key, display }) => (
                                                                <SelectItem
                                                                    key={key}
                                                                    value={key}
                                                                >
                                                                    {display}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>



                                            <div className="flex flex-col gap-5 pt-4 px-4 rounded-lg shadow-inner mb-4">
                                                <Alert className="mt-1">
                                                    <AlertTitle className="text-[#f6c]">Heads up!</AlertTitle>
                                                    <AlertDescription>
                                                        When you choose "Selection" as the Context, any text you highlight while using Extension | OS will be added to the end of your prompt automatically.
                                                    </AlertDescription>
                                                </Alert>
                                                <div className="text-sm text-white">
                                                    <LabelWithTooltip keyTooltip={key} labelText="Prompt" tooltipText="The prompt for the GPT" />

                                                    <AutosizeTextarea
                                                        id={`prompt-${key}`}
                                                        className="mt-1 p-4 rounded-md border-none bg-gray-800 text-white"
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
                                                <div className="flex flex-row gap-4 justify-between">
                                                    <div className="text-sm text-white w-full">
                                                        <div className="flex flex-col gap-1 ">

                                                            <LabelWithTooltip onClick={() => setOpenFunctionalitySheet(true)} keyTooltip={key} labelText="Functionality" tooltipText="The functionality after the prompt is executed. Click for more info" sheetIncluded={true} />


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
                                                                    {functionalityParameters.map(({ key, display }) => (
                                                                        <SelectItem key={key} value={key}>
                                                                            {display}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    {/* <div className="text-sm text-gray-600 w-1/2">
                                                    <div className="flex flex-col gap-1">
                                                        <LabelWithTooltip keyTooltip={key} labelText="ID" tooltipText="Unique Identification used internally" />
                                                        <p className="p-2 h-10 border rounded-md bg-white">
                                                            {contextMenuItems[key].id}
                                                        </p>
                                                    </div>
                                                </div> */}

                                                    <div className="text-sm text-gray-600 pt-[1.85rem]">
                                                        <Button className="w-[155px] bg-gradient-to-r from-violet-500 to-orange-500 text-white" onClick={() => handleSave()}>
                                                            Save All
                                                        </Button>
                                                    </div>
                                                </div>
                                                {contextMenuItems[key].functionType === "callVoice-ExternalNumber" && (
                                                    <>
                                                        <VapiSpecificConfiguration contextMenuItems={contextMenuItems[key]} handleChange={handleChange} />
                                                    </>
                                                )}



                                            </div>
                                        </div>

                                    );
                                })}
                            </div >
                            {/* Need to stay here to respect ARIA and the REACT Warnings. */}
                            <Sheet open={openContextSheet} onOpenChange={setOpenContextSheet}>
                                <HelpSheetContext />
                            </Sheet>
                            <Sheet open={openFunctionalitySheet} onOpenChange={setOpenFunctionalitySheet}>
                                <HelpSheetFunctionality />
                            </Sheet>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CardContent>
            </Card>
        </div >
    );
}
