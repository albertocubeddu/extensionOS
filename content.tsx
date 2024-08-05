import successImage from "data-base64:~assets/AppIcons/success.gif"
import loadingImage from "data-base64:~assets/AppIcons/loading.png"
import cssText from "data-text:~/plasmo-overlay.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

// We enable the extension to be used in anywebsite with an http/https protocol.
export const config: PlasmoCSConfig = {
    matches: ["https://*/*", "http://*/*"]
}

export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = cssText
    return style
}

const PlasmoOverlay = () => {
    const [responseText, setResponseText] = useState("")
    const [successDivVisibe, setSuccessDivVisibile] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorDivVisibe, setErrorDivVisibe] = useState(false)
    const [llmModel] = useStorage("llmModel")
    const [debugInfo] = useStorage("debugInfo")

    useEffect(() => {
        const handleClipboardCopy = async (text) => {
            try {
                await navigator.clipboard.writeText(text)
                setTimeout(() => {
                    setSuccessDivVisibile(false)
                }, 5000)
            } catch (err) {
                console.error("Could not copy text: ", err)
            }
        }

        const messageListener = (request) => {
            switch (request.action) {
                case "copyToClipboard":
                    setResponseText(request.text)
                    setIsLoading(false)
                    setSuccessDivVisibile(true)
                    handleClipboardCopy(request.text)
                    break
                case "loadingAction":
                    setIsLoading(true)
                    break
                case "error":
                    setResponseText(request.text)
                    setIsLoading(false)
                    setErrorDivVisibe(true)
                    setTimeout(() => {
                        setErrorDivVisibe(false)
                    }, 15000)
                    break
                default:
                    console.warn("Unknown action:", request.action)
            }
        }

        chrome.runtime.onMessage.addListener(messageListener)

        // Cleanup listener on component unmount
        return () => chrome.runtime.onMessage.removeListener(messageListener)
    }, [])

    return (
        <>
            {/* DEBUG BOX */}
            <div
                style={{
                    padding: "12px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 6px",
                    borderRadius: "8px",
                    width: "500px",
                    maxWidth: "1300px",
                    wordBreak: "break-word",
                    display: successDivVisibe && debugInfo ? "block" : "none",
                    color: "black"
                }}>
                <h1 style={{ fontSize: "16px" }}>Debug Info</h1>{" "}
                <p>
                    <b>Model used:</b> {llmModel}{" "}
                </p>
                <p>
                    <b>Response from AI: </b>
                    <span>{responseText}</span>
                </p>
            </div>

            {/* Executed */}
            <div
                style={{
                    position: "fixed",
                    textAlign: "center",
                    bottom: "16px",
                    right: "16px",
                    maxWidth: "1300px",
                    wordBreak: "break-word",
                    display: successDivVisibe ? "block" : "none"
                }}>
                <img src={successImage} className="w-full h-auto" />
            </div>

            {/* Loading box */}
            <div
                style={{
                    position: "fixed",
                    textAlign: "center",
                    bottom: "7px",
                    right: "30px",
                    maxWidth: "1300px",
                    wordBreak: "break-word",
                    display: isLoading ? "block" : "none",
                }}>
                <img src={loadingImage} className="w-full h-auto" />
            </div>

            {/* Error box */}
            <div
                style={{
                    position: "fixed",
                    textAlign: "center",
                    bottom: "16px",
                    right: "16px",
                    padding: "12px",
                    backgroundColor: "red",
                    boxShadow: "0 4px 6px",
                    borderRadius: "8px",
                    width: "fit",
                    maxWidth: "1300px",
                    wordBreak: "break-word",
                    display: errorDivVisibe ? "block" : "none",
                    color: "white"
                }}>
                <h1 style={{ fontSize: "16px" }}>Error: {responseText}</h1>{" "}
            </div>
        </>
    )
}

export default PlasmoOverlay
