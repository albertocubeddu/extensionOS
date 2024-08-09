interface ProviderInstructionProps {
    provider: string;
}

/*
TODO: investigate if we can load this at runtime?
*/
import groqLogo from "data-base64:~assets/AppIcons/groq.png";
import openAiLogo from "data-base64:~assets/AppIcons/openai.svg";
import togetherAiLogo from "data-base64:~assets/AppIcons/togetherai.png";
import extensionOsLogo from "data-base64:~assets/AppIcons/extension-os.svg";

const providerData = {
    extensionos: {
        logo: extensionOsLogo,
        links: [
            { label: "Official Website", url: "https://extension-os.com" },
            { label: "Login on your google account", url: "https://console.groq.com/keys", }
        ]
    },
    groq: {
        logo: groqLogo,
        links: [
            { label: "Official Website", url: "https://groq.com" },
            { label: "Get API Key", url: "https://console.groq.com/keys", }
        ]
    },
    openai: {
        logo: openAiLogo,
        links: [
            { label: "Official Website", url: "https://openai.com" },
            { label: "Get API Key", url: "https://platform.openai.com/api-keys" }
        ]
    },
    together: {
        logo: togetherAiLogo,
        links: [
            { label: "Official Website", url: "https://www.together.ai" },
            { label: "Get API Key", url: "https://api.together.ai/settings/api-keys" }
        ]
    }
};


export default function ProviderInstruction({ provider }: ProviderInstructionProps) {
    const { logo, links } = providerData[provider] || { logo: extensionOsLogo, links: [] };

    return (
        <div className="flex flex-row gap-5">
            <img src={logo} alt={`${provider} Logo`} className="block max-w-[163px]" />
            <div className="flex flex-grow">
                <p className="border-l-2 border-[#ff66cc] pl-4">
                    {links.map((link, index) => (
                        <span key={index}>
                            <b>{link.label}:</b> <a href={link.url + '?utm_campaign=extension-os'} target="_blank" rel="noopener noreferrer">{link.url}</a> <br />
                        </span>

                    ))}
                </p>
            </div>
        </div>
    );
}