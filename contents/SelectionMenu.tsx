import type {
    PlasmoCSConfig,
    PlasmoGetShadowHostId,
    PlasmoGetStyle,
    PlasmoMountShadowHost,
} from "plasmo"
import { useCallback, useEffect, useState } from "react"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import cssText from "data-text:~/globals.css"

import { sendToBackground } from "@plasmohq/messaging"
import type {
    RequestBody as InitializeContextMenuItemsBody,
    RequestResponse as InitializeContextMenuItemsResponse,
} from "~background/messages/initializeContextMenuItems"
import type {
    RequestBody as OpenSidePanelBody,
    RequestResponse as OpenSidePanelResponse,
} from "~background/messages/openSidePanel"
import type {
    RequestBody as RunContextMenuActionBody,
    RequestResponse as RunContextMenuActionResponse,
} from "~background/messages/runContextMenuAction"
import { adjustXYSelectionMenu, getRealXY } from "~lib/calculationXY"
import { useStorage } from "@plasmohq/storage/hook"
import {
    DEFAULT_CONTEXT_MENU_ITEMS,
    isSidebarMenuId,
    toChromeContextMenuItems,
} from "~lib/configurations/contextMenuItems"
import { defaultGlobalConfig } from "~lib/configurations/globalConfig"
import {
    extensionStorage,
    storageKey,
    STORAGE_KEYS,
} from "~lib/storage"
import deepmerge from "deepmerge"

// We enable the extension to be used in anywebsite with an http/https protocol.
export const config: PlasmoCSConfig = {
    matches: ["https://*/*", "http://*/*"]
}

export const getShadowHostId: PlasmoGetShadowHostId = () =>
    "extension-os-selection-menu-shadow-host"

export const mountShadowHost: PlasmoMountShadowHost = ({ shadowHost }) => {
    const existingHost = document.getElementById(
        "extension-os-selection-menu-shadow-host"
    )

    if (existingHost && existingHost !== shadowHost) {
        existingHost.remove()
    }

    document.documentElement.appendChild(shadowHost)
}

export const getStyle: PlasmoGetStyle = () => {
    const style = document.createElement("style")
    style.textContent = `${cssText}
      :host {
        all: initial;
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147483647;
      }

      #plasmo-shadow-container {
        position: static !important;
        pointer-events: none;
      }

      #extension-os-selection-menu {
        pointer-events: auto;
      }
    `
    return style
}

const SelectionMenu = () => {
    const [selectedText, setSelectedText] = useState("")
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [menuItems, setMenuItems] = useState<chrome.contextMenus.CreateProperties[]>(
        () => toChromeContextMenuItems(DEFAULT_CONTEXT_MENU_ITEMS)
    )
    let [config] = useStorage<typeof defaultGlobalConfig>(
        storageKey(STORAGE_KEYS.globalConfig),
        defaultGlobalConfig
    )
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

    const handleKeyDown = useCallback((event: KeyboardEvent) => { // Use useCallback
        setMenuPosition({ x: 0, y: 0 })
    }, []);

    const handleMenuItemClick = async (info: chrome.contextMenus.CreateProperties) => {

        //Close the menu
        setMenuPosition({ x: 0, y: 0 })

        //THIS THING NEED TO BE BEFORE THE BLOODY storage yet again... 
        const itemId = String(info.id);
        if (isSidebarMenuId(itemId)) {
            await sendToBackground<OpenSidePanelBody, OpenSidePanelResponse>({
                name: "openSidePanel"
            })
        }

        const result = await sendToBackground<
            RunContextMenuActionBody,
            RunContextMenuActionResponse
        >({
            name: "runContextMenuAction",
            body: {
                itemId,
                selectedText,
            },
        })

        if (result.ok === false) {
            console.warn(result.error)
        }
    }


    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp)
        document.addEventListener("keydown", handleKeyDown)

        const initialize = async () => {
            const response = await sendToBackground<
                InitializeContextMenuItemsBody,
                InitializeContextMenuItemsResponse
            >({
                name: "initializeContextMenuItems",
                body: {},
            })
            setMenuItems(response.chromeItems)
        }
        initialize();

        //Listen for changes, this allow the user to modify is own prompts, and see the value reflected on the UI straight away.
        const watchMap = {
            [STORAGE_KEYS.contextMenuItems]: (c) => {
                const cleanedContextMenuItems = toChromeContextMenuItems(c.newValue);
                setMenuItems(cleanedContextMenuItems)
            },
        }
        extensionStorage.watch(watchMap)

        return () => {
            document.removeEventListener("mouseup", handleMouseUp)
            document.removeEventListener("keydown", handleKeyDown)
            extensionStorage.unwatch(watchMap)
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
