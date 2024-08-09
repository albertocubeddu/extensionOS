import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

const UserInfoContext = createContext<chrome.identity.UserInfo | null>(null)

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
    const [userInfo, setUserInfo] = useState<chrome.identity.UserInfo | null>(null)

    useEffect(() => {
        let isMounted = true; // Track if the component is mounted
        chrome.identity.getProfileUserInfo((data) => {
            if (isMounted && data.email && data.id) {
                console.log(data)
                setUserInfo(data)
            }
        })
        return () => {
            isMounted = false; // Cleanup function to set the flag to false
        }
    }, [])

    return (
        <UserInfoContext.Provider value={userInfo}>
            {children}
        </UserInfoContext.Provider>
    )
}

export const useUserInfo = () => useContext(UserInfoContext)