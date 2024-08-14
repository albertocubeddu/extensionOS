import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

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


    const handleMouseUp = (event: MouseEvent) => {
        const selection = window.getSelection()
        const text = selection?.toString() || null


        if (null !== text && text.trim().length > 0) {
            setSelectedText(text)

            const viewportHeight = window.innerHeight
            const viewportWidth = window.innerWidth
            const menuHeight = 250 // approximate height of your menu (adjust as needed)
            const menuWidth = 300 // approximate width of your menu (adjust as needed)
            let xPos = event.pageX
            let yPos = event.pageY

            // Check for bottom edge case
            if (event.pageY + menuHeight > viewportHeight) {
                yPos = viewportHeight - menuHeight - 10 // small margin from the bottom
            }

            // Check for right edge case
            if (event.pageX + menuWidth > viewportWidth) {
                xPos = viewportWidth - menuWidth - 10 // small margin from the right
            }

            // Adjust for top edge case
            if (event.pageY < menuHeight && yPos < 0) {
                yPos = 10 // small margin from the top
            }

            // Adjust for left edge case
            if (event.pageX < menuWidth && xPos < 0) {
                xPos = 10 // small margin from the left
            }

            setMenuPosition({ x: xPos, y: yPos })
        } else {
            setMenuPosition({ x: 0, y: 0 })
        }
    }


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

        switch (info.id) {
            case element.id:
                if (element.id === "configuration") {
                    await sendToBackground({
                        name: "openOptionPage",
                    })
                }
                if (element.functionType === "callAI-copyClipboard") {
                    const a = await sendToBackground({
                        name: "sendLoadingAction",
                    })

                    const response = await sendToBackground({
                        name: "callOpenAIReturn",
                        body: {
                            prompt: element.prompt,
                            selectedText: selectedText
                        }
                    })

                    const copyToText = await sendToBackground({
                        name: "copyTextToClipboard",
                        body: { ...response }
                    })
                }

                if (element.functionType === "callVoice-ExternalNumber") {
                    //In this case we do know that the callVoice will have those argument setup.
                    await createCall(
                        element.prompt,
                        selectedText,
                        element.extraArgs?.vapiRecipientPhoneNumber ??
                        "Hi, this is your assistent calling. How can I help you?",
                        element.extraArgs?.vapiFirstMessage ?? ""
                    );
                    break;
                }

                if (element.functionType === "callAI-openSideBar") {
                    const response = await sendToBackground({
                        name: "callOpenAIReturn",
                        body: {
                            prompt: element.prompt,
                            selectedText: selectedText
                        }
                    })
                    const sendToSidepanel = await sendToBackground({
                        name: "sendToSidepanel",
                        body: { ...response }
                    })
                }
                break;
            default:
                console.warn("Unhandled menu item:", info.id);
        }
    }


    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp)

        const initialize = async () => {
            const contextConfigItems =
                (await initializeStorage()) as unknown as chrome.contextMenus.CreateProperties[];
            const cleanedContextMenuItems = cleanProperties(contextConfigItems);
            setMenuItems(cleanedContextMenuItems)
        }
        initialize();

        return () => {
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [])

    return (
        <>
            {menuPosition.x !== 0 && menuPosition.y !== 0 && ( // Check if .x and .y are not equal to 0
                <div>
                    <Command className="rounded-2xl shadow-md p-2 bg-[#161616] border border-black dark:border-slate-100 translate-x-1 translate-y-1 text-white " style={{
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
                                    <CommandItem className="cursor-pointer opacity-50 hover:opacity-100 hover:bg-[#505050] font-bold m-1 rounded-2xl" key={item.id} onSelect={() => handleMenuItemClick(item)}>
                                        <span>{item.title}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            )}
        </>
    )
}

export default SelectionMenu