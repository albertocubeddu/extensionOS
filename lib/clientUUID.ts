import { extensionStorage } from "~lib/storage";

export async function getOrCreateClientUUID() {
   let clientId = await extensionStorage.get("clientUUID");
   if (!clientId) {
      // Generate a unique client ID, the actual value is not relevant
      clientId = self.crypto.randomUUID();
      await extensionStorage.set("clientUUID", clientId);
   }
   return clientId;
}
