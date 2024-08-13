import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "~components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { Label } from "~components/ui/label";

import { MousePointerClick } from 'lucide-react';


interface LabelWithTooltipProps {
    keyTooltip: string
    labelText: string
    tooltipText: string
    sheetIncluded?: boolean
}

export default function LabelWithTooltip({ keyTooltip, labelText, tooltipText, sheetIncluded = false }: LabelWithTooltipProps) {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger className="flex flex-row gap-1 items-center">

                    <Label
                        className="text-sm text-gray-200"
                        htmlFor={`${labelText}-${keyTooltip}`}
                    >
                        {labelText}
                    </Label>
                    <span className="inline-flex items-center gap-1 mb-2">
                        {sheetIncluded ? (
                            <MousePointerClick color="#ff66cc" className="animate-[pulse_1s_ease-in-out_10]" size={18} />
                        ) : (
                            <CircleHelp color="white" size={18} />
                        )}
                    </span>

                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        {tooltipText}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )

}