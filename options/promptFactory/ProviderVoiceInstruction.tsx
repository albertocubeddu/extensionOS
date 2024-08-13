interface ProviderVoiceInstructionProps {
    provider: string;
}

import vapiLogo from "data-base64:~assets/AppIcons/vapi.png";
import extensionOsLogo from "data-base64:~assets/AppIcons/extension-os.svg";
import InstructionSnippet from "./components/InstructionSnippet";

const providerData = {
    vapi: {
        logo: vapiLogo,
        links: [
            { label: "Official Website", url: "https://vapi.ai", queryParams: "aff=extension-os" },
            { label: "Get API Key", url: "https://vapi.ai/", queryParams: "aff=extension-os" }
        ]
    },
};


export default function ProviderVoiceInstruction({ provider }: ProviderVoiceInstructionProps) {
    const { logo, links } = providerData[provider] || { logo: extensionOsLogo, links: [] };

    return (
        <InstructionSnippet logo={logo} provider={provider} links={links} />
    );
}