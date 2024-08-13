import { useUserInfo } from "./UserInfoContext"

export default function EmailShowCase() {
    const userInfo = useUserInfo()

    return (<div>{userInfo?.email}</div>)
}