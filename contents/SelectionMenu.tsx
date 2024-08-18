import type { PlasmoCSConfig } from "plasmo"
import { useCallback, useEffect, useState } from "react"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import cssText from "data-text:~/globals.css"
import { initializeStorage } from "~background/init"
import { cleanProperties } from "~lib/cleanContextMenu"
import { createCall } from "~lib/vapiOutbound"

import { Storage } from "@plasmohq/storage";
import { sendToBackground } from "@plasmohq/messaging"
import { adjustXYSelectionMenu, getRealXY } from "~lib/calculationXY"
import { useStorage } from "@plasmohq/storage/hook"
import { defaultGlobalConfig, setGlobalConfig } from "~lib/configurations/globalConfig"
import deepmerge from "deepmerge"
const storage = new Storage();

// We enable the extension to be used in anywebsite with an http/https protocol.
export const config: PlasmoCSConfig = {
    matches: ["https://*/*", "http://*/*"]
}

export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = cssText
    return style
}

const SelectionMenu = () => {
    const [selectedText, setSelectedText] = useState("")
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [menuItems, setMenuItems] = useState<chrome.contextMenus.CreateProperties[]>([]) // Initialize with an empty array
    let [config] = useStorage("globalConfig", defaultGlobalConfig)
    config = deepmerge(defaultGlobalConfig, config)


    const handleMouseUp = useCallback((event: MouseEvent) => { // Use useCallback
        const selection = window.getSelection()
        const text = selection?.toString() || null

        //Check if the text is at least two words: WHY? To avoid the menu popping out all the time.
        //TODO: Make a configuration for this.
        if (text && text.trim().split(/\s+/).length >= 2) {
            setSelectedText(text);
            //Get Real Coordinate and Adjust them according to the menu size.
            const { xPos, yPos } = adjustXYSelectionMenu(getRealXY(event));
            setMenuPosition({ x: xPos, y: yPos })
        } else {
            // Some elements may lose the window.getSelection() (e.g., Gmail's reply box). This causes the event to fire before the onSelect from the menu, resulting in an empty selection and the menu closing prematurely. To mitigate this, we add a 1-millisecond delay to queue the event, effectively preventing the menu from closing too quickly.
            setTimeout(() => {
                setMenuPosition({ x: 0, y: 0 })
            }, 1);
        }
    }, []);

    const handleKeyDown = useCallback((event: MouseEvent) => { // Use useCallback
        setMenuPosition({ x: 0, y: 0 })
    }, []);

    // Separate functions for handling different actions
    const handleCopyClipboard = async (element) => {
        const r = await sendToBackground({
            name: "sendLoadingAction"
        });

        const response = await sendToBackground({
            name: "callOpenAIReturn",
            body: { prompt: element.prompt, selectedText }
        });
        await sendToBackground({ name: "copyTextToClipboard", body: { ...response } });
    };

    const handleVoiceCall = async (element) => {
        await createCall(
            element.prompt,
            selectedText,
            element.extraArgs?.vapiRecipientPhoneNumber ?? "Hi, this is your assistant calling. How can I help you?",
            element.extraArgs?.vapiFirstMessage ?? ""
        );
    };

    const handleOpenSidebar = async (element) => {
        const response = await sendToBackground({
            name: "callOpenAIReturn",
            body: { prompt: element.prompt, selectedText }
        });
        await sendToBackground({ name: "sendToSidepanel", body: { ...response } });
    };


    const handleMenuItemClick = async (info: chrome.contextMenus.CreateProperties) => {

        //Close the menu
        setMenuPosition({ x: 0, y: 0 })

        //THIS THING NEED TO BE BEFORE THE BLOODY storage yet again... 
        const itemId = info.id as String;
        if (itemId.startsWith("side_")) {
            await sendToBackground({
                name: "openSidePanel"
            })
        }

        const items = (await storage.get("contextMenuItems")) as any[];

        //In the past we've used the hashmap, however it would overcomplicated the rest of the codebase always because we are not able to use the chrome.storage and the sidebar.open in the same function. This can be reviewed and use an hashmap if we find the solution for that bug. At the moment i don't expect having more than 20 prompt per user, so readability and clean code beats efficiency.
        const element = items.find((item) => item.id === info.id);

        if (!element) {
            console.warn("Unhandled menu item:", info.id);
            return;
        }

        if (element.id === "configuration") {
            await sendToBackground({
                name: "openOptionPage",
            })
        }

        switch (element.functionType) {
            case "callAI-copyClipboard":
                await handleCopyClipboard(element);
                break;
            case "callVoice-ExternalNumber":
                await handleVoiceCall(element);
                break;
            case "callAI-openSideBar":
                await handleOpenSidebar(element);
                break;
            default:
                console.warn("Unhandled function type:", element.functionType);
        }
    }


    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp)
        document.addEventListener("keydown", handleKeyDown)

        const initialize = async () => {
            const contextConfigItems =
                (await initializeStorage()) as unknown as chrome.contextMenus.CreateProperties[];
            const cleanedContextMenuItems = cleanProperties(contextConfigItems);
            setMenuItems(cleanedContextMenuItems)
        }
        initialize();

        //Listen for changes, this allow the user to modify is own prompts, and see the value reflected on the UI straight away.
        storage.watch({
            "contextMenuItems": (c) => {
                const cleanedContextMenuItems = cleanProperties(c.newValue);
                setMenuItems(cleanedContextMenuItems)
            },
        })

        return () => {
            document.removeEventListener("mouseup", handleMouseUp)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    return (
        <>
            {config.selectionMenu.display && menuPosition.x !== 0 && menuPosition.y !== 0 && ( // Check if .x and .y are not equal to 0
                <div id="extension-os-selection-menu" className="w-max">
                    <Command className="rounded-2xl shadow-lg p-0 bg-[#161616] border border-[#505050] dark:border-[#fff] translate-x-1 translate-y-1" style={{
                        position: "relative",
                        top: `${menuPosition.y}px`,
                        left: `${menuPosition.x}px`,
                        zIndex: 1000,
                        maxWidth: "300px", // Ensure it fits smaller screens
                        overflowY: "auto", // Scroll if content overflows
                    }}>
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup >
                                {menuItems.map((item) => (
                                    <CommandItem className="cursor-pointer opacity-50 hover:opacity-100 hover:bg-[#505050] font-bold m-1 rounded-[5px] py-1 text-[16px]" key={item.id} value={item.title} onSelect={() => handleMenuItemClick(item)}>
                                        <span className="text-white">{item.title}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div >
            )}
        </>
    )
}

export default SelectionMenu


