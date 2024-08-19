import { Storage } from "@plasmohq/storage";

export async function getOrCreateClientUUID() {
   const storage = new Storage();
   let clientId = await storage.get("clientUUID");
   if (!clientId) {
      // Generate a unique client ID, the actual value is not relevant
      clientId = self.crypto.randomUUID();
      await storage.set("clientUUID", clientId);
   }
   return clientId;
}
