import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Star, Trash2 } from "lucide-react";
import { sendToBackground } from "@plasmohq/messaging";
import type {
    RequestBody as InitializeContextMenuItemsBody,
    RequestResponse as InitializeContextMenuItemsResponse,
} from "~background/messages/initializeContextMenuItems";
import type {
    RequestBody as SaveContextMenuItemsBody,
    RequestResponse as SaveContextMenuItemsResponse,
} from "~background/messages/saveContextMenuItems";

import { Input } from "~components/ui/input";
import { Badge } from "~components/ui/badge";
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

import {
    MAX_SELECTION_MENU_ITEMS,
    isSelectionMenuEligibleContext,
    isSidebarMenuId,
    isBuiltInUtilityMenuId,
    isUserPromptMenuItem,
    withSidebarMenuPrefix,
    withoutSidebarMenuPrefix,
    type ContextMenuItem,
} from "~lib/configurations/contextMenuItems";

import LabelWithTooltip from "../components/blocks/LabelWithTooltip";
import CardHeaderIntro from "~components/blocks/CardHeaderIntro";
import VapiSpecificConfiguration from "./promptFactory/VapiSpecificConfiguration";
import HelpSheetFunctionality from "./promptFactory/HelpSheetFunctionality";
import { functionalityParameters } from "./promptFactory/parameters/functionalityParameters";
import { AutosizeTextarea } from "~components/shadcnui-expansions/AutosizeTextarea";
import { Alert, AlertDescription, AlertTitle } from "~components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "~components/ui/tooltip";

const SELECTION_MENU_LIMIT_ERROR = `Only ${MAX_SELECTION_MENU_ITEMS} prompts can be visible in the selection menu at the same time. Deactivate one before adding another.`;
const REORDER_ANIMATION_MS = 240;
const PROMPT_CARD_SELECTOR = "[data-prompt-card-id]";
const PROMPT_CONTROLS_SELECTOR = "[data-prompt-controls-id]";
const SELECTED_TEXT_BADGE_TOOLTIP = "When you run this prompt, Extension | OS adds the text you highlighted on the page after your prompt. This badge is just a marker, not saved text.";

function countVisibleSelectionPrompts(items: ContextMenuItem[]) {
    return items.filter(
        (item) =>
            isUserPromptMenuItem(item) &&
            item.selectionMenuVisible &&
            isSelectionMenuEligibleContext(item.contexts)
    ).length;
}

function createPromptId(existingItems: ContextMenuItem[]) {
    let id = "";

    do {
        const randomValue =
            typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        id = `customPrompt_${randomValue}`;
    } while (
        existingItems.some(
            (item) => item.id === id || item.id === withSidebarMenuPrefix(id)
        )
    );

    return id;
}

function insertPromptAtTop(items: ContextMenuItem[], item: ContextMenuItem) {
    const firstPromptIndex = items.findIndex(isUserPromptMenuItem);
    if (firstPromptIndex !== -1) {
        return [
            ...items.slice(0, firstPromptIndex),
            item,
            ...items.slice(firstPromptIndex),
        ];
    }

    const firstUtilityIndex = items.findIndex(
        (candidate) =>
            candidate.type === "separator" || isBuiltInUtilityMenuId(candidate.id)
    );

    if (firstUtilityIndex === -1) {
        return [...items, item];
    }

    return [
        ...items.slice(0, firstUtilityIndex),
        item,
        ...items.slice(firstUtilityIndex),
    ];
}

function reorderPromptItem(
    items: ContextMenuItem[],
    id: string,
    direction: -1 | 1
) {
    const promptItems = items.filter(isUserPromptMenuItem);
    const promptIndex = promptItems.findIndex((item) => item.id === id);
    const nextPromptIndex = promptIndex + direction;

    if (
        promptIndex === -1 ||
        nextPromptIndex < 0 ||
        nextPromptIndex >= promptItems.length
    ) {
        return items;
    }

    const reorderedPromptItems = [...promptItems];
    const [movedItem] = reorderedPromptItems.splice(promptIndex, 1);
    reorderedPromptItems.splice(nextPromptIndex, 0, movedItem);

    return [
        ...reorderedPromptItems,
        ...items.filter((item) => !isUserPromptMenuItem(item)),
    ];
}

function getPromptCardElements() {
    if (typeof document === "undefined") {
        return [];
    }

    return Array.from(
        document.querySelectorAll<HTMLDivElement>(PROMPT_CARD_SELECTOR)
    );
}

function getPromptCardRects() {
    const rects = new Map<string, DOMRect>();

    getPromptCardElements().forEach((element) => {
        const id = element.dataset.promptCardId;

        if (id) {
            rects.set(id, element.getBoundingClientRect());
        }
    });

    return rects;
}

function findPromptCardElement(id: string) {
    return getPromptCardElements().find(
        (element) => element.dataset.promptCardId === id
    );
}

function findPromptControlsElement(id: string) {
    if (typeof document === "undefined") {
        return undefined;
    }

    return Array.from(
        document.querySelectorAll<HTMLDivElement>(PROMPT_CONTROLS_SELECTOR)
    ).find((element) => element.dataset.promptControlsId === id);
}

function SelectedTextBadge() {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span
                        className="absolute bottom-3 right-3 inline-flex cursor-help"
                        tabIndex={0}
                    >
                        <Badge
                            variant="outline"
                            className="border-violet-400/70 bg-gray-950/95 px-2.5 py-1 text-[11px] font-semibold text-violet-100 shadow-sm"
                        >
                            Selected text will be added at the end.
                        </Badge>
                    </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <p>{SELECTED_TEXT_BADGE_TOOLTIP}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default function OptionsPromptFactory() {
    const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>([]);
    const [openFunctionalitySheet, setOpenFunctionalitySheet] = useState(false);
    const [promptFactoryError, setPromptFactoryError] = useState<string | null>(null);
    const [addedPromptId, setAddedPromptId] = useState<string | null>(null);
    const reorderAnimationFrameRef = useRef<number | null>(null);
    const reorderScrollTimeoutRef = useRef<number | null>(null);

    const promptItems = contextMenuItems.filter(isUserPromptMenuItem);
    const visibleSelectionPromptCount = countVisibleSelectionPrompts(contextMenuItems);

    useEffect(() => {
        async function getStorage() {
            const response = await sendToBackground<
                InitializeContextMenuItemsBody,
                InitializeContextMenuItemsResponse
            >({
                name: "initializeContextMenuItems",
                body: {},
            });

            setContextMenuItems(response.items);
        }

        getStorage();
    }, []);

    useEffect(() => {
        if (!addedPromptId) {
            return;
        }

        const promptIndex = contextMenuItems
            .filter(isUserPromptMenuItem)
            .findIndex((item) => item.id === addedPromptId);

        if (promptIndex === -1) {
            return;
        }

        document.getElementById(`title-${promptIndex}`)?.focus();
        setAddedPromptId(null);
    }, [addedPromptId, contextMenuItems]);

    useEffect(() => {
        return () => {
            if (reorderAnimationFrameRef.current !== null) {
                window.cancelAnimationFrame(reorderAnimationFrameRef.current);
            }

            if (reorderScrollTimeoutRef.current !== null) {
                window.clearTimeout(reorderScrollTimeoutRef.current);
            }
        };
    }, []);

    const playPromptReorderFeedback = useCallback((movedPromptId: string, previousRects: Map<string, DOMRect>) => {
        const shouldReduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reorderScrollTimeoutRef.current !== null) {
            window.clearTimeout(reorderScrollTimeoutRef.current);
            reorderScrollTimeoutRef.current = null;
        }

        if (!shouldReduceMotion) {
            getPromptCardElements().forEach((element) => {
                const id = element.dataset.promptCardId;

                if (!id) {
                    return;
                }

                const previousRect = previousRects.get(id);

                if (!previousRect) {
                    return;
                }

                const nextRect = element.getBoundingClientRect();
                const deltaX = previousRect.left - nextRect.left;
                const deltaY = previousRect.top - nextRect.top;

                if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
                    return;
                }

                element.animate(
                    [
                        {
                            transform: `translate(${deltaX}px, ${deltaY}px)`,
                        },
                        {
                            transform: "translate(0, 0)",
                        },
                    ],
                    {
                        duration: REORDER_ANIMATION_MS,
                        easing: "cubic-bezier(0.2, 0, 0, 1)",
                    }
                );
            });

            findPromptCardElement(movedPromptId)?.animate(
                [
                    {
                        outline: "2px solid rgba(250, 204, 21, 0)",
                        outlineOffset: "8px",
                    },
                    {
                        outline: "2px solid rgba(250, 204, 21, 0.85)",
                        outlineOffset: "2px",
                    },
                    {
                        outline: "2px solid rgba(250, 204, 21, 0)",
                        outlineOffset: "8px",
                    },
                ],
                {
                    duration: REORDER_ANIMATION_MS * 3,
                    easing: "ease-out",
                }
            );
        }

        const scrollMovedPromptIntoView = () => {
            const movedPromptControls =
                findPromptControlsElement(movedPromptId) ??
                findPromptCardElement(movedPromptId);

            movedPromptControls?.scrollIntoView({
                behavior: shouldReduceMotion ? "auto" : "smooth",
                block: "center",
                inline: "nearest",
            });
        };

        if (shouldReduceMotion) {
            requestAnimationFrame(scrollMovedPromptIntoView);
            return;
        }

        reorderScrollTimeoutRef.current = window.setTimeout(() => {
            scrollMovedPromptIntoView();
            reorderScrollTimeoutRef.current = null;
        }, REORDER_ANIMATION_MS);
    }, []);

    /*
    This is needed, because we don't have any context when we are calling the listener on the background
    that is the one aware of opening the sidebar. Need to find a solution for the chrome.storage ASAP.
    */
    const handleChange = useCallback((id: string, prop: string, value: any) => {
        setPromptFactoryError(null);
        setContextMenuItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    let newId = item.id;

                    if (isSidebarMenuId(item.id) && prop === "functionType" && value !== "callAI-openSideBar") {
                        newId = withoutSidebarMenuPrefix(item.id);
                    } else if (!isSidebarMenuId(item.id) && prop === "functionType" && value === "callAI-openSideBar") {
                        newId = withSidebarMenuPrefix(item.id);
                    }

                    const updatedItem = { ...item, [prop]: value, id: newId };

                    if (
                        prop === "contexts" &&
                        !isSelectionMenuEligibleContext(value as ContextMenuItem["contexts"])
                    ) {
                        updatedItem.selectionMenuVisible = false;
                    }

                    return updatedItem;
                }
                return item;
            })
        );
    }, []);

    const handleSelectionMenuVisibleChange = useCallback((id: string, checked: boolean) => {
        setPromptFactoryError(null);

        const item = contextMenuItems.find((candidate) => candidate.id === id);
        if (!item) {
            return;
        }

        if (checked && !isSelectionMenuEligibleContext(item.contexts)) {
            setPromptFactoryError("Only prompts using the Selection or All context can be visible in the selection menu.");
            return;
        }

        const visibleCountWithoutCurrentItem = countVisibleSelectionPrompts(
            contextMenuItems.filter((candidate) => candidate.id !== id)
        );

        if (checked && visibleCountWithoutCurrentItem >= MAX_SELECTION_MENU_ITEMS) {
            setPromptFactoryError(SELECTION_MENU_LIMIT_ERROR);
            return;
        }

        handleChange(id, "selectionMenuVisible", checked);
    }, [contextMenuItems, handleChange]);

    const handleAddPrompt = useCallback(() => {
        setPromptFactoryError(null);
        const id = createPromptId(contextMenuItems);

        const newPrompt: ContextMenuItem = {
            id,
            title: "New Prompt",
            contexts: ["selection"],
            prompt: "",
            functionType: "callAI-copyClipboard",
            selectionMenuVisible:
                countVisibleSelectionPrompts(contextMenuItems) <
                MAX_SELECTION_MENU_ITEMS,
        };

        setContextMenuItems((prevItems) =>
            insertPromptAtTop(prevItems, newPrompt)
        );
        setAddedPromptId(id);
    }, [contextMenuItems]);

    const handleMovePrompt = useCallback((id: string, direction: -1 | 1) => {
        setPromptFactoryError(null);

        const promptIndex = promptItems.findIndex((item) => item.id === id);
        const nextPromptIndex = promptIndex + direction;

        if (
            promptIndex === -1 ||
            nextPromptIndex < 0 ||
            nextPromptIndex >= promptItems.length
        ) {
            return;
        }

        const previousPromptRects = getPromptCardRects();

        if (reorderAnimationFrameRef.current !== null) {
            window.cancelAnimationFrame(reorderAnimationFrameRef.current);
            reorderAnimationFrameRef.current = null;
        }

        if (reorderScrollTimeoutRef.current !== null) {
            window.clearTimeout(reorderScrollTimeoutRef.current);
            reorderScrollTimeoutRef.current = null;
        }

        setContextMenuItems((prevItems) =>
            reorderPromptItem(prevItems, id, direction)
        );
        reorderAnimationFrameRef.current = window.requestAnimationFrame(() => {
            reorderAnimationFrameRef.current = null;
            playPromptReorderFeedback(id, previousPromptRects);
        });
    }, [playPromptReorderFeedback, promptItems]);

    const handleRemovePrompt = useCallback((item: ContextMenuItem) => {
        const promptTitle = item.title || "this prompt";
        if (!confirm(`Remove "${promptTitle}"?`)) {
            return;
        }

        setPromptFactoryError(null);
        setContextMenuItems((prevItems) =>
            prevItems.filter((candidate) => candidate.id !== item.id)
        );
    }, []);

    //What a shit show, saving two things together. Best practice thrown in the bin. TODO: Refactor the smelly code. (10:00PM - night)
    const handleSave = async () => {
        try {
            const result = await sendToBackground<
                SaveContextMenuItemsBody,
                SaveContextMenuItemsResponse
            >({
                name: "saveContextMenuItems",
                body: {
                    items: contextMenuItems,
                },
            });

            if ("errorMessage" in result) {
                throw new Error(result.errorMessage);
            }

            setContextMenuItems(result.items);
            setPromptFactoryError(null);
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
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {visibleSelectionPromptCount}/{MAX_SELECTION_MENU_ITEMS} prompts visible in the selection menu
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" onClick={handleAddPrompt}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Prompt
                                    </Button>
                                    <Button className="bg-gradient-to-r from-violet-500 to-orange-500 text-white" onClick={() => handleSave()}>
                                        Save All
                                    </Button>
                                </div>
                            </div>
                            {promptFactoryError && (
                                <Alert variant="destructive" className="mb-6">
                                    <AlertTitle>Prompt Factory Error</AlertTitle>
                                    <AlertDescription>{promptFactoryError}</AlertDescription>
                                </Alert>
                            )}
                            <div>
                                {promptItems.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        No prompts configured yet.
                                    </p>
                                )}
                                {promptItems.map((item, index) => {
                                    const isSelectionMenuEligible = isSelectionMenuEligibleContext(item.contexts);
                                    return (
                                        <div
                                            key={item.id}
                                            data-prompt-card-id={item.id}
                                            className="p-4 pt-6 mb-20 border-t-8 border-l-8 border-2 rounded-lg shadow-lg will-change-transform"
                                        >
                                            <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-end sm:justify-between">
                                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                    <LabelWithTooltip keyTooltip={item.id} labelText="Display Name" tooltipText="The name displayed in the menu visualised when the user clicks the right-click" />
                                                    <Input
                                                        id={`title-${index}`}
                                                        className="text-lg font-semibold mb-2"
                                                        value={item.title ?? ""}
                                                        onChange={(e) => {
                                                            handleChange(
                                                                item.id,
                                                                "title",
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    data-prompt-controls-id={item.id}
                                                    className="mb-2 flex shrink-0 items-center justify-end gap-2"
                                                >
                                                    <Button
                                                        id={`selection-menu-visible-${index}`}
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-10 w-10 p-0"
                                                        aria-label={`${item.selectionMenuVisible ? "Hide" : "Show"} ${item.title || "prompt"} in selection menu`}
                                                        aria-pressed={Boolean(item.selectionMenuVisible && isSelectionMenuEligible)}
                                                        disabled={!isSelectionMenuEligible}
                                                        onClick={() =>
                                                            handleSelectionMenuVisibleChange(
                                                                item.id,
                                                                !Boolean(item.selectionMenuVisible && isSelectionMenuEligible)
                                                            )
                                                        }
                                                    >
                                                        <Star className={`h-4 w-4 ${item.selectionMenuVisible && isSelectionMenuEligible ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-10 w-10 p-0"
                                                        aria-label={`Move ${item.title || "prompt"} up`}
                                                        disabled={index === 0}
                                                        onClick={() => handleMovePrompt(item.id, -1)}
                                                    >
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-10 w-10 p-0"
                                                        aria-label={`Move ${item.title || "prompt"} down`}
                                                        disabled={index === promptItems.length - 1}
                                                        onClick={() => handleMovePrompt(item.id, 1)}
                                                    >
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="h-10 w-10 p-0"
                                                        aria-label="Remove"
                                                        onClick={() => handleRemovePrompt(item)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>



                                            <div className="flex flex-col gap-5 pt-4 px-4 rounded-lg shadow-inner mb-4">
                                                <div className="text-sm text-white">
                                                    <LabelWithTooltip keyTooltip={item.id} labelText="Prompt" tooltipText="The prompt for the GPT" />
                                                    <div className="relative mt-1">
                                                        <AutosizeTextarea
                                                            id={`prompt-${index}`}
                                                            className="p-4 pb-14 rounded-md border-none bg-gray-800 text-white"
                                                            value={item.prompt ?? ""}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    item.id,
                                                                    "prompt",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter your prompt here"
                                                        />
                                                        <SelectedTextBadge />
                                                    </div>

                                                </div>
                                                <div className="flex flex-row gap-4 justify-between">
                                                    <div className="text-sm text-white w-full">
                                                        <div className="flex flex-col gap-1 ">

                                                            <LabelWithTooltip onClick={() => setOpenFunctionalitySheet(true)} keyTooltip={item.id} labelText="Functionality" tooltipText="The functionality after the prompt is executed. Click for more info" sheetIncluded={true} />


                                                            <Select
                                                                value={item.functionType}
                                                                onValueChange={(value) =>
                                                                    handleChange(item.id, "functionType", value)
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
                                                </div>
                                                {item.functionType === "callVoice-ExternalNumber" && (
                                                    <>
                                                        <VapiSpecificConfiguration contextMenuItems={item} handleChange={handleChange} />
                                                    </>
                                                )}



                                            </div>
                                        </div>

                                    );
                                })}
                            </div >
                            {/* Need to stay here to respect ARIA and the REACT Warnings. */}
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
