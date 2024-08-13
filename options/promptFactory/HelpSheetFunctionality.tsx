import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "~components/ui/scroll-area";
import { functionalityParameters } from "./parameters/functionalityParameters";



export default function HelpSheetFunctionality() {
    return (
        <SheetContent className="bg-white">
            <SheetHeader>
                <SheetTitle>Functionality Explaination</SheetTitle>
                <SheetDescription>
                    <ScrollArea className="h-[100vh] pr-4">
                        <div className="flex flex-col">
                            {functionalityParameters.map((context) => (
                                <>
                                    <span className="bg-gray-800 rounded-lg p-2 w-fit text-white font-mono mb-2">{`${context.display.charAt(0).toUpperCase() + context.display.slice(1)}`}</span>
                                    <span className="mb-5">{context.description.charAt(0).toUpperCase() + context.description.slice(1)}</span>
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