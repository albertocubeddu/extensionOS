import React from "react";
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
} from "~components/ui/tooltip";
import { Label } from "@/components/ui/label";

import { CircleHelp } from "lucide-react";

export default function TablePromptHeader() {
   return (
      <TableRow>
         <TableHead>
            <TooltipProvider delayDuration={200}>
               <Tooltip>
                  <TooltipTrigger className="flex flex-row gap-1">
                     <Label>Display Name</Label>
                     <span>
                        <CircleHelp size={12} />
                     </span>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p>
                        This is the display name for the prompt you wish to
                        utilize.
                     </p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         </TableHead>
         <TableHead>
            <TooltipProvider delayDuration={200}>
               <Tooltip>
                  <TooltipTrigger className="flex flex-row gap-1">
                     <Label>Context</Label>
                     <span>
                        <CircleHelp size={12} />
                     </span>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p>The different contexts a menu can appear in.</p>
                     <p>
                        <a
                           className="text-blue-400"
                           href="https://developer.chrome.com/docs/extensions/reference/api/contextMenus#enum"
                           target="_blank"
                           rel="noopener noreferrer"
                        >
                           Learn more
                        </a>
                     </p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         </TableHead>
         <TableHead>
            <TooltipProvider delayDuration={200}>
               <Tooltip>
                  <TooltipTrigger className="flex flex-row gap-1">
                     <Label>ID</Label>{" "}
                     <span>
                        <CircleHelp size={12} />
                     </span>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p>
                        The unique identifier utilized by the event listener to
                        trigger your function.
                     </p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         </TableHead>
      </TableRow>
   );
}
