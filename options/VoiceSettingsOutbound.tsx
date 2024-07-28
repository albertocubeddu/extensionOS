import "@/globals.css"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
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
  const [recipientPhoneNumber, setCustomerNumber] = useStorage(
    "voice_outbound_recipientPhoneNumber",
    ""
  )

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Voice Outbound Settings</CardTitle>
        <CardDescription>
          The provide you will use to establish an external phone call. At the
          moment we only support Vapi.ai
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <img
            src={vapiLogo}
            alt="VAPI Logo"
            className="block max-w-sm mx-auto my-5"
          />
          <label htmlFor="model-select">Choose a provider:</label>
          <Select value="vapi">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vapi">Vapi</SelectItem>
            </SelectContent>
          </Select>
          <br />
          <div>
            <label htmlFor="auth-token">Auth Token</label>
            <Input
              id="auth-token"
              type="text"
              placeholder="Enter your Auth Token From VAPI"
              value={authToken}
              onChange={(e) => setauthToken(e.target.value)}
              className="border border-input rounded-md p-2 w-full"
            />
          </div>
          <br />
          <div>
            <label htmlFor="phone-number-id">Phone Number ID</label>
            <Input
              id="phone-number-id"
              type="text"
              placeholder="Enter your Phone Number ID"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              className="border border-input rounded-md p-2 w-full"
            />
          </div>
          <br />
          <div>
            <label htmlFor="customer-number">Recipient Phone Number</label>
            <Input
              id="customer-number"
              type="text"
              placeholder="Enter your Customer Number"
              value={recipientPhoneNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              className="border border-input rounded-md p-2 w-full"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save</Button>
        {"checked" === debugInfo && (
          <div className="flex flex-col flex-1 px-4">
            <span> DEBUG</span>
            <span>
              {" "}
              VAPI Auth Token: {authToken.slice(0, authToken.length / 4)}
            </span>
            <span> VAPI Phone ID: {phoneNumberId}</span>
            <span> Recipient Phone Number: {recipientPhoneNumber}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
