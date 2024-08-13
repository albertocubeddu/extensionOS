import backgroundExt from "data-base64:~assets/popup.png"
import React from "react"
import "./globals.css"
import { Button } from "~components/ui/button"

function IndexPopup() {

    return (
        <div style={{ backgroundImage: `url(${backgroundExt})` }} className="bg-cover bg-center w-[300px] h-[300px] flex flex-col items-center justify-end gap-2">

            <Button
                className="bg-white text-white font-semibold py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
                onClick={() => chrome.runtime.openOptionsPage()}
            >
                Configuration
            </Button>


            <span className="flex pt-5 basis-1/12">
            </span>

        </div>
    )
}

export default IndexPopup