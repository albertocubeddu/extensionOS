import React from "react";

interface InstructionSnippetProps {
  logo: string;
  provider: string;
  links: { label: string; url: string; queryParams?: string }[];
  paragraph?: string;
}

export default function InstructionSnippet({
  logo,
  provider,
  links,
  paragraph,
}: InstructionSnippetProps) {
  return (
    <>
      <div className="flex flex-row flex-grow gap-5">
        <img
          src={logo}
          alt={`${provider} Logo`}
          className="block max-w-[163px]"
        />
        <div className="flex flex-row">
          <p className="border-l-2 border-[#ff66cc] pl-4">
            {links.map((link, index) => (
              <span key={index}>
                <b>{link.label}:</b>{" "}
                <a
                  href={
                    link.queryParams
                      ? `${link.url}?${link.queryParams}`
                      : `${link.url}?utm_campaign=extension-os`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.url}
                </a>{" "}
                <br />
              </span>
            ))}
            {provider === "localhost" && (
              <>
                <br />
                <p>
                  To run ollama locally you must follow this instruction:{" "}
                  <a
                    href="https://github.com/albertocubeddu/extensionOS?tab=readme-ov-file#localhost"
                    className="text-blue-500 hover:text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Github Instruction
                  </a>
                </p>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
