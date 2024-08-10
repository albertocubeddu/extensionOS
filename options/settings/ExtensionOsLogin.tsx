import { useState, useEffect } from "react";
import { callAPI } from "~lib/fetcher/callApi";
import GoogleButton from "./GoogleButton"; // Changed to default import
import { ArrowBigLeftDash } from "lucide-react";
import GoogleButtonDark from "./GoogleButtonDark";

export const ExtensionOsLogin = () => {
    const [showLoginButton, setShowLoginButton] = useState(false);

    const handleToken = async (interactive = false) => {
        try {
            const token = await chrome.identity.getAuthToken({ interactive });
            if (token) {
                setShowLoginButton(false);
            } else {
                setShowLoginButton(true);
            }
        } catch (error) {
            console.error('Error getting token:', error);
            setShowLoginButton(true); // Show login button if error occurs, so that the user can login again.
        }
    };

    useEffect(() => {
        handleToken(); // Check token on component mount
    }, []);


    const handleFreeTier = async () => {
        try {
            const data = await callAPI('/api/premium-feature', { method: 'POST' });
            alert(data.code);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };

    return (
        <>
            {showLoginButton ? (
                <div className="flex flex-row gap-0 mt-2">
                    <GoogleButton
                        onClick={() => handleToken(true)} />
                    <ArrowBigLeftDash size={40} strokeWidth={1} className=" mx-5 text-[#ff66cc] animate-[wiggle_1s_ease-in-out_infinite]" />
                </div>
            ) :
                <button onClick={handleFreeTier}>
                    Your Key is Set, and you're enjoying the FREE tier.
                </button>
            }
        </>
    );
};