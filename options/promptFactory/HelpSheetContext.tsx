import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "~components/ui/scroll-area";
import { chromeContextsParameters } from "./parameters/chromeContextParameters";


export default function HelpSheetContext() {
    return (
        <SheetContent className="bg-white">
            <SheetHeader>
                <SheetTitle>Context Explaination</SheetTitle>
                <SheetDescription>
                    <ScrollArea className="h-[100vh] pr-4">
                        <div className="flex flex-col">
                            {chromeContextsParameters.map((context) => (
                                <>
                                    <span className="bg-gray-800 rounded-lg p-2 w-fit text-white font-mono mb-2">{`"${context.key}"`}</span>
                                    <span className="mb-5">{context.description}</span>
                                </>
                            ))}
                        </div>
                        <div className="mb-20"></div>
                    </ScrollArea>
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    )
}