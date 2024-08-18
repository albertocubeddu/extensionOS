import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "~components/ui/scroll-area";
import { chromeContextsParameters } from "./parameters/chromeContextParameters";
import React from "react";


export default function HelpSheetContext() {
    return (
        <SheetContent className="bg-white">
            <SheetHeader>
                <SheetTitle>Context Explaination</SheetTitle>
                <SheetDescription>
                    <span className="flex flex-col">
                        {chromeContextsParameters.map((context, index) => (
                            <React.Fragment key={index}>
                                <span className="bg-gray-800 rounded-lg p-2 w-fit text-white font-mono mb-2">{context.key.charAt(0).toUpperCase() + context.key.slice(1)}</span>
                                <span className="mb-5">{context.description.charAt(0).toUpperCase() + context.description.slice(1)}</span>
                            </React.Fragment>
                        ))}
                    </span>
                    <span className="mb-20"></span>
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    )
}