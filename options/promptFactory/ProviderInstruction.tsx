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
import ollama from "data-base64:~assets/AppIcons//ollama.png";

import InstructionSnippet from "./components/InstructionSnippet";

const providerData = {
  "extension | OS": {
    logo: extensionOsLogo,
    links: [
      { label: "Official Website", url: "https://extension-os.com" },
      { label: "More Tiers Available Soon", url: "https://extension-os.com" },
    ],
  },
  groq: {
    logo: groqLogo,
    links: [
      { label: "Official Website", url: "https://groq.com" },
      { label: "Get API Key", url: "https://console.groq.com/keys" },
    ],
  },
  openai: {
    logo: openAiLogo,
    links: [
      { label: "Official Website", url: "https://openai.com" },
      { label: "Get API Key", url: "https://platform.openai.com/api-keys" },
    ],
  },
  together: {
    logo: togetherAiLogo,
    links: [
      { label: "Official Website", url: "https://www.together.ai" },
      {
        label: "Get API Key",
        url: "https://api.together.ai/settings/api-keys",
      },
    ],
  },
  localhost: {
    logo: ollama,
    links: [
      { label: "Official Website", url: "https://ollama.com/" },
      { label: "Running on", url: "http://localhost:11434" },
    ],
  },
};

export default function ProviderInstruction({
  provider,
}: ProviderInstructionProps) {
  const { logo, links } = providerData[provider] || {
    logo: extensionOsLogo,
    links: [],
  };

  return <InstructionSnippet logo={logo} provider={provider} links={links} />;
}
