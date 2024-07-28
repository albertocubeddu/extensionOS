import extensionAvatar from "data-base64:~assets/icon.png"
import React, { useEffect, useState } from "react"

import "./globals.css"

import HeroTitle from "~components/blocks/HeroTitle"

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
    <div style={{ padding: 16, width: "300px", textAlign: "center" }}>
      <HeroTitle />
      <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 leading-tight pb-4">
        Skyrocket Your Productivity
      </p>

      <div className="flex justify-center">
        <img
          style={{ width: "200px" }}
          src={extensionAvatar}
          alt="Some pretty cool image"
        />
      </div>

      <a className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Hello World!
        {/* <span className="inline-flex items-center justify-center w-8 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
          0
        </span> */}
      </a>
    </div>
  )
}

export default IndexPopup
