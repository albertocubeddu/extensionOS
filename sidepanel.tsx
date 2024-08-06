import "./globals.css"

import { useEffect, useState } from "react"

import HeroTitle from "~components/blocks/HeroTitle"

function IndexSidePanel() {
    const [data, setData] = useState("Loading...")

    useEffect(() => {
        const messageListener = function (request, sender, sendResponse) {
            if (request.action === "send_to_sidepanel") {
                setData(request.payload)
            }
        }

        chrome.runtime.onMessage.addListener(messageListener)

        // Cleanup listener on component unmount
        return () => chrome.runtime.onMessage.removeListener(messageListener)
    }, [])

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 16,
                zIndex: 1000
            }}>
            <HeroTitle color="black" />
            <p className="text-lg">{data}</p>
        </div>
    )
}

export default IndexSidePanel
