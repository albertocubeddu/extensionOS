import backgroundExt from "data-base64:~assets/popup.png"
import React, { useEffect, useState } from "react"
import useSWR from "swr"


import "./globals.css"
import { Button } from "~components/ui/button"
import { UserInfoProvider, useUserInfo } from "~lib/providers/UserInfoContext"
import { callAPI } from "~lib/fetcher/callApi"

const EmailShowcase = () => {
    const userInfo = useUserInfo()

    return (
        <div className="text-white">
            Your email is: <b>{userInfo?.email}</b>
        </div>
    )
}

const PremiumFeatureButton = () => {
    const { data, error } = useSWR<{ active: boolean }, Error>(
        "/api/check-subscription",
        { fetcher: callAPI } // Use an object with the fetcher property
    )
    const userInfo = useUserInfo()

    if (!!error || !data?.active) {
        return (
            <button
                disabled={!userInfo}
                onClick={async () => {
                    chrome.identity.getAuthToken(
                        {
                            interactive: true
                        },
                        (token) => {
                            if (!!token) {
                                window.open(
                                    `https://buy.stripe.com/test_6oE4k08aba1XdigdQT
?client_reference_id=${userInfo.id
                                    }&prefilled_email=${encodeURIComponent(userInfo.email)}`,
                                    "_blank"
                                )
                            }
                        }
                    )
                }}>
                Subscribe to Paid feature
            </button>
        )
    }

    return (
        <button
            onClick={async () => {
                const data = await callAPI("/api/premium-feature", {
                    method: "POST"
                })

                alert(data.code)
            }}>
            Calling Awesome Premium Feature
        </button>
    )
}


function IndexPopup() {
    const [data, setData] = useState("")
    const userInfo = useUserInfo()



    useEffect(() => {
        const messageListener = (message, sender, sendResponse) => {
            setData(message.data)
            return true; // Keep the messaging channel open for asynchronous response
        }

        chrome.runtime.onMessage.addListener(messageListener)

        // Cleanup the listener when the component unmounts
        return () => chrome.runtime.onMessage.removeListener(messageListener);
    }, [])

    return (
        <UserInfoProvider>
            <div style={{ backgroundImage: `url(${backgroundExt})` }} className="bg-cover bg-center w-[300px] h-[300px] flex flex-col items-center justify-end gap-2">

                <Button
                    className="bg-white text-white font-semibold py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
                    onClick={() => chrome.runtime.openOptionsPage()}
                >
                    Configuration
                </Button>

                <EmailShowcase />

                <span className="flex pt-5 basis-[4%]">
                </span>

            </div>
        </UserInfoProvider>
    )
}

export default IndexPopup