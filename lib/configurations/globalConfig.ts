import deepmerge from "deepmerge";
import { Storage } from "@plasmohq/storage";
const storage = new Storage();

//We want to have everything as Partial (deep too) as the deepmerge will take care of matching with the default/stored configuration.
type DeepPartial<T> = {
   [P in keyof T]?: DeepPartial<T[P]>;
};

export const defaultGlobalConfig = {
   selectionMenu: {
      display: true,
   },
};

export async function getGlobalConfig() {
   let storagedConfig = {};
   try {
      storagedConfig = await storage.get("globalConfig");
   } catch (error) {}
   return deepmerge(
      {},
      defaultGlobalConfig,
      storagedConfig
   ) as typeof defaultGlobalConfig;
}

export async function setGlobalConfig(
   config: DeepPartial<typeof defaultGlobalConfig>
) {
   let storagedConfig: DeepPartial<typeof defaultGlobalConfig>;
   try {
      storagedConfig = (await storage.get("globalConfig")) as Partial<
         typeof defaultGlobalConfig
      >;
   } catch (error) {}
   config = deepmerge<
      DeepPartial<typeof defaultGlobalConfig>,
      DeepPartial<typeof defaultGlobalConfig>
   >(storagedConfig, config);
   await storage.set("globalConfig", config);
   return config;
}
