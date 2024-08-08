import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "~components/ui/scroll-area";

const contexts = [
    {
        key: "Copy to Clipboard",
        description: "This functionality enables users to copy the GPT output directly to their clipboard for convenient pasting into other applications."
    },
    {
        key: "Write to Sidebar",
        description: "This functionality allows users to have the GPT output directly to the sidebar for easy access and reference."
    },
    {
        key: "Call External Number",
        description: "The user will receive a phone call and can start to talk with the GPT"
    }
];

export default function HelpSheetFunctionality() {
    return (
        <SheetContent className="bg-white">
            <SheetHeader>
                <SheetTitle>Functionality Explaination</SheetTitle>
                <SheetDescription>
                    <ScrollArea className="h-[100vh] pr-4">
                        <div className="flex flex-col">
                            {contexts.map((context) => (
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