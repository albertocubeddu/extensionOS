import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { useEffect, useState } from "react";

import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";

import { Input } from "~components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "~components/ui/select";
import { Textarea } from "~components/ui/textarea";
import { cleanProperties } from "~lib/cleanContextMenu";

const storage = new Storage();

export default function OptionsPromptFactory() {
   const [contextMenuItems, setContextMenuItems] = useState({});
   const [myOwnPromptState, setMyOwnPromptState] = useState("");

   useEffect(() => {
      async function getStorage() {
         const items = await storage.get("contextMenuItems");
         setContextMenuItems(items);
      }

      async function getMyOwnPrompt() {
         const myOwnPrompt = await storage.get("myOwnPrompt");
         setMyOwnPromptState(myOwnPrompt ?? "");
      }

      getStorage();
      getMyOwnPrompt();
   }, []);

   const handleChange = (key, prop, value) => {
      setContextMenuItems((prevItems) => ({
         ...prevItems,
         [key]: {
            ...prevItems[key],
            [prop]: value,
         },
      }));
   };

   //What a shit show, saving two things together. Best practice thrown in the bin. TODO: Refactor the smelly code. (10:00PM - night)
   const handleSave = async () => {
      await storage.set("contextMenuItems", contextMenuItems);
      await storage.set("myOwnPrompt", myOwnPromptState);

      const menuStorage = cleanProperties(contextMenuItems);

      // Remove all existing context menu items
      chrome.contextMenus.removeAll(() => {
         // Create new context menu items
         menuStorage.forEach((item) => {
            chrome.contextMenus.create(item);
         });
      });

      alert("Changes saved!");
   };

   return (
      <div className="grid gap-6">
         <Card x-chunk="dashboard-04-chunk-2">
            <CardHeader>
               <CardTitle>Prompt Factory</CardTitle>
               <CardDescription>
                  Welcome to the Prompt Factory, where you can set new prompts
                  in the Extension | OS. The section it's in is early version,
                  and it will allow to add/remove and modify every prompt.
               </CardDescription>
            </CardHeader>
            <CardContent>
               {contextMenuItems ? (
                  <div>
                     {Object.keys(contextMenuItems).map((key) => {
                        console.log(contextMenuItems[key]);
                        return (
                           <>
                              <div
                                 key={key}
                                 className="p-4 mb-4 border rounded-lg shadow-sm"
                              >
                                 <span className="flex flex-row justify-between">
                                    <Input
                                       className="text-lg font-semibold mb-2 w-[50%]"
                                       value={contextMenuItems[key].title}
                                       onChange={(e) => {
                                          handleChange(
                                             key,
                                             "title",
                                             e.target.value
                                          );
                                       }}
                                    />
                                    <div className="text-sm text-gray-600 mb-2">
                                       <Select
                                          value={contextMenuItems[
                                             key
                                          ].contexts.join(", ")}
                                          onValueChange={(value) =>
                                             handleChange(
                                                key,
                                                "contexts",
                                                value.split(", ")
                                             )
                                          }
                                       >
                                          <SelectTrigger className="w-full">
                                             <SelectValue placeholder="Select contexts" />
                                          </SelectTrigger>
                                          <SelectContent>
                                             {[
                                                "all",
                                                "page",
                                                "frame",
                                                "selection",
                                                "link",
                                                "editable",
                                                "image",
                                                "video",
                                                "audio",
                                                "launcher",
                                                "browser_action",
                                                "page_action",
                                                "action",
                                             ].map((context) => (
                                                <SelectItem
                                                   key={context}
                                                   value={context}
                                                >
                                                   {context}
                                                </SelectItem>
                                             ))}
                                          </SelectContent>
                                       </Select>
                                    </div>
                                 </span>

                                 <span className="flex flex-col gap-5">
                                    <div className="text-sm text-gray-600 mb-2">
                                       ID: {contextMenuItems[key].id}
                                    </div>
                                    <div className="text-sm text-gray-800">
                                       <label htmlFor={`prompt-${key}`}>
                                          Prompt:
                                       </label>
                                       <Textarea
                                          id={`prompt-${key}`}
                                          value={contextMenuItems[key].prompt}
                                          onChange={(e) =>
                                             handleChange(
                                                key,
                                                "prompt",
                                                e.target.value
                                             )
                                          }
                                          placeholder="Enter your prompt here"
                                       />
                                    </div>
                                    <div className="text-sm text-gray-800">
                                       Function Type:{" "}
                                       {contextMenuItems[key].functionType}
                                    </div>
                                 </span>

                                 <div className="flex flex-row justify-end">
                                    <Button onClick={() => handleSave()}>
                                       Save All
                                    </Button>
                                 </div>
                              </div>
                           </>
                        );
                     })}
                  </div>
               ) : (
                  <p>Loading...</p>
               )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
               <Button onClick={() => handleSave()}>Save</Button>
            </CardFooter>
         </Card>
      </div>
   );
}
