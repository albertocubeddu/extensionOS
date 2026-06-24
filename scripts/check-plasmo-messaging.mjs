import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = process.cwd();
const messagesDir = join(root, "background", "messages");
const metadataPath = join(root, "plasmo-messaging.d.ts");

const messageFiles = readdirSync(messagesDir)
   .filter((fileName) => fileName.endsWith(".ts"))
   .map((fileName) => basename(fileName, ".ts"))
   .sort();

const metadataText = readFileSync(metadataPath, "utf8");
const metadataBody = metadataText.match(/interface MessagesMetadata\s*\{([\s\S]*?)\n\s*\}/)?.[1] ?? "";
const metadataKeys = [...metadataBody.matchAll(/^\s*([A-Za-z0-9_]+)\s*:/gm)]
   .map((match) => match[1])
   .sort();

const missing = messageFiles.filter((fileName) => !metadataKeys.includes(fileName));
const extra = metadataKeys.filter((key) => !messageFiles.includes(key));

if (missing.length || extra.length) {
   console.error("plasmo-messaging.d.ts is out of sync with background/messages.");
   if (missing.length) {
      console.error(`Missing metadata: ${missing.join(", ")}`);
   }
   if (extra.length) {
      console.error(`Extra metadata: ${extra.join(", ")}`);
   }
   process.exit(1);
}

console.log("Plasmo messaging metadata is in sync.");
