import backgroundExt from "data-base64:~assets/popup.png"
import React, { useEffect, useState } from "react"

import "./globals.css"


function IndexPopup() {
    const [data, setData] = useState("")

    useEffect(() => {
        // Register the onMessage listener
        const messageListener = (message, sender, sendResponse) => {
            // Assuming the message contains the data you want to display
            // You can add conditions to filter messages if necessary
            console.log(message)
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
        <div className="w-[300px] h-[300px]">
            <img src={backgroundExt} alt="Background Ext Osr" className="w-full h-full" />
        </div>
    )
}

export default IndexPopup
