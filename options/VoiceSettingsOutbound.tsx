import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import vapiLogo from "data-base64:~assets/AppIcons/vapi.png"
import React, { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"
import LabelWithTooltip from "~components/blocks/LabelWithTooltip"
import CardHeaderIntro from "~components/blocks/CardHeaderIntro"
import FakeSaveButton from "~components/blocks/FakeSaveButton"
import ProviderVoiceInstruction from "./promptFactory/ProviderVoiceInstruction"
import { ArrowBigLeftDash } from "lucide-react"

export default function VoiceSettingsOutbound({
    debugInfo
}: {
    debugInfo: string
}) {
    const [authToken, setauthToken] = useStorage("voice_outbound_authToken", "")
    const [phoneNumberId, setPhoneNumberId] = useStorage(
        "voice_outbound_phoneNumberId",
        ""
    )


    return (
        <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
                <CardHeaderIntro title={"Voice Outbound Settings"} description={"The provider you will use to establish an external phone call. At the moment we only support Vapi.ai"} />
            </CardHeader>
            <CardContent>
                <div className="flex flex-row pb-10 pt-5">
                    <ProviderVoiceInstruction provider="vapi" />
                    {/* UX Note: This arrow indicates where users should click to obtain their API keys. */}
                    <ArrowBigLeftDash size={40} strokeWidth={1} className=" mx-5 text-[#ff66cc] animate-[wiggle_1s_ease-in-out_infinite]" />
                </div>

                <div>
                    <div className="flex flex-col gap-1">

                        <LabelWithTooltip keyTooltip={"voiceOutboundProvider"} labelText={"Default Voice Outbound Provider"} tooltipText={"This is the Voice provider that will be used by default."} />
                        <Select value="vapi">
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="vapi">Vapi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <br />
                    <div className="flex flex-col gap-1">
                        <LabelWithTooltip keyTooltip={"voiceOutboundApiToken"} labelText={"VAPI Private API Key"} tooltipText={"Visit https://dashboard.vapi.ai/org/api-keys and copy your Private Key."} />
                        <Input
                            id="voiceOutboundApiToken"
                            type="text"
                            placeholder="Enter your Auth Token From VAPI"
                            value={authToken}
                            onChange={(e) => setauthToken(e.target.value)}
                            className="border border-input rounded-md p-2 w-full"
                        />
                    </div>
                    <br />
                    <div className="flex flex-col gap-1">

                        <LabelWithTooltip keyTooltip={"voiceOutboundPhoneNumberID"} labelText={"Phone Number ID"} tooltipText={"This is the Phone Number ID from VAPI."} />
                        <Input
                            id="voiceOutboundPhoneNumberID"
                            type="text"
                            placeholder="Enter your Phone Number ID"
                            value={phoneNumberId}
                            onChange={(e) => setPhoneNumberId(e.target.value)}
                            className="border border-input rounded-md p-2 w-full"
                        />
                    </div>
                    <br />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <FakeSaveButton />
                {"checked" === debugInfo && (
                    <div className="flex flex-col flex-1 px-4">
                        <span> DEBUG</span>
                        <span>
                            {" "}
                            VAPI Auth Token: {authToken.slice(0, authToken.length / 4)}
                        </span>
                        <span> VAPI Phone ID: {phoneNumberId}</span>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
