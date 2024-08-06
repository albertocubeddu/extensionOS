import backgroundExt from "data-base64:~assets/popup.png"
import React, { useEffect, useState } from "react"

import "./globals.css"
import { Button } from "~components/ui/button"


function IndexPopup() {
    const [data, setData] = useState("")

    useEffect(() => {
        // Register the onMessage listener
        const messageListener = (message, sender, sendResponse) => {
            // Assuming the message contains the data you want to display
            // You can add conditions to filter messages if necessary
            setData(message.data)

            // Optional: send a response back
            // sendResponse({status: "Message received"});
            return true // Keep the messaging channel open for asynchronous response
        }

        chrome.runtime.onMessage.addListener(messageListener)

        // Cleanup the listener when the component unmounts
        // return () => chrome.runtime.onMessage.removeListener(messageListener);
    }, [])

    return (
        <div style={{ backgroundImage: `url(${backgroundExt})` }} className="bg-cover bg-center w-[300px] h-[300px] flex flex-col items-center justify-end gap-2">
            <Button
                className="bg-white text-white font-semibold py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
                onClick={() => chrome.runtime.openOptionsPage()}
            >
                Configuration
            </Button>
            <span className="flex basis-1/12">
            </span>
        </div>
    )
}

export default IndexPopup
