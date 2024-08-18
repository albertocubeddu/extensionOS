import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "~components/ui/scroll-area";
import { functionalityParameters } from "./parameters/functionalityParameters";
import React from "react";



export default function HelpSheetFunctionality() {
    return (
        <SheetContent className="bg-white">
            <SheetHeader>
                <SheetTitle>Functionality Explaination</SheetTitle>
                <SheetDescription>
                    <span className="flex flex-col">
                        {functionalityParameters.map((context, index) => (
                            <React.Fragment key={index}>
                                <span className="bg-gray-800 rounded-lg p-2 w-fit text-white font-mono mb-2">{`${context.display.charAt(0).toUpperCase() + context.display.slice(1)}`}</span>
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