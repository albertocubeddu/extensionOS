

export const getAccessToken = () =>
    new Promise((resolve) =>
        chrome.identity.getAuthToken(null, (token) => {
            if (!!token) {
                resolve(token)
            }
        })
    )



export const callAPI = async (
    uri: string,
    opts: RequestInit
): Promise<any> => // Specify return type
    fetch(`http://localhost:8472/${uri}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`
        },
        ...opts
    }).then((res) => res.json())
