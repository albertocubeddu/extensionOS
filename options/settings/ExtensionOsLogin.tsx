import { useState, useEffect } from "react";
import GoogleButton from "./GoogleButton"; // Changed to default import
import { ArrowBigLeftDash } from "lucide-react";
import { Badge } from "~components/ui/badge";

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


    return (
        <>
            {showLoginButton ? (
                <div className="flex flex-row gap-0 pl-3">
                    <GoogleButton
                        onClick={() => handleToken(true)} />
                    <ArrowBigLeftDash size={40} strokeWidth={1} className=" mx-5 text-[#ff66cc] animate-[wiggle_1s_ease-in-out_infinite]" />
                    <Badge className="os-text-gradient" variant="outline"> Free Tier </Badge>
                </div>
            ) :
                <div className="flex flex-row gap-4 text-bases items-center">
                    <Badge className="os-text-gradient" variant="outline"> Free Tier </Badge>
                    <p className="font">20 Request / Day</p>
                </div>
            }
        </>
    );
};