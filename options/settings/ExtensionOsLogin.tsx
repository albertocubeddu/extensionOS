import { useState, useEffect } from "react";
import { Button } from "~components/ui/button";
import { callAPI } from "~lib/fetcher/callApi";

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
                <Button
                    onClick={() => handleToken(true)}>
                    Login To Use Our Models
                </Button>
            ) : (
                <button onClick={handleFreeTier}>
                    Your Key is Set, and you're enjoying the FREE tier.
                </button>
            )}
        </>
    );
};