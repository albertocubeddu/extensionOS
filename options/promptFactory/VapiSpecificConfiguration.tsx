import { useEffect, useState } from "react";
import type { IContextConfigItems } from "~background/init";
import LabelWithTooltip from "~components/blocks/LabelWithTooltip";
import { Input } from "~components/ui/input";

interface VapiSpecificConfigurationProps {
    contextMenuItems: IContextConfigItems;
    handleChange: (id: string, prop: string, value: any) => void;
}

interface VapiSpecificOptions {
    vapiFirstMessage: string;
    vapiRecipientPhoneNumber: string;
}

export default function VapiSpecificConfiguration({ contextMenuItems, handleChange }: VapiSpecificConfigurationProps) {
    const { id, extraArgs } = contextMenuItems;
    const [vapiSpecificOptions, setVapiSpecificOptions] = useState<VapiSpecificOptions>({
        vapiFirstMessage: extraArgs?.vapiFirstMessage || "",
        vapiRecipientPhoneNumber: extraArgs?.vapiRecipientPhoneNumber || ""
    });

    useEffect(() => {
        handleChange(id, "extraArgs", vapiSpecificOptions);
    }, [vapiSpecificOptions, handleChange]);

    const handleInputChange = (prop: keyof VapiSpecificOptions) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setVapiSpecificOptions(prevOptions => ({
            ...prevOptions,
            [prop]: e.target.value
        }));
    };

    return (
        <div className="flex flex-row gap-4">
            <div className="text-sm text-white w-1/2">
                <div className="flex flex-col gap-1">
                    <LabelWithTooltip
                        keyTooltip={`firstMessage-${id}`}
                        labelText="First Message:"
                        tooltipText="What the VAPI bot will say at the beginning of the call"
                    />
                    <Input
                        id={`firstMessage-${id}`}
                        className="text-lg font-semibold mb-2"
                        value={vapiSpecificOptions.vapiFirstMessage}
                        onChange={handleInputChange("vapiFirstMessage")}
                    />
                </div>
            </div>
            <div className="text-sm w-1/2">
                <div className="flex flex-col gap-1">
                    <LabelWithTooltip
                        keyTooltip={`vapiCustomerNumber-${id}`}
                        labelText="Customer Number to Call"
                        tooltipText="Enter the phone number to call in the international format (e.g., +61 for Australia)"
                    />
                    <Input
                        id={`vapiRecipientPhoneNumber-${id}`}
                        className="text-lg font-semibold mb-2"
                        value={vapiSpecificOptions.vapiRecipientPhoneNumber}
                        onChange={handleInputChange("vapiRecipientPhoneNumber")}
                    />
                </div>
            </div>
        </div>
    );
}