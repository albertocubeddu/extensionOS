import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "~components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { Label } from "~components/ui/label";

interface LabelWithTooltipProps {
    keyTooltip: string
    labelText: string
    tooltipText: string
}

export default function LabelWithTooltip({ keyTooltip, labelText, tooltipText }: LabelWithTooltipProps) {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger className="flex flex-row gap-1">
                    <Label
                        className="text-sm text-gray-200"
                        htmlFor={`${labelText}-${keyTooltip}`}
                    >
                        {labelText}
                    </Label>
                    <span className="inline-flex items-center gap-1">
                        <CircleHelp color="white" size={12} />
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