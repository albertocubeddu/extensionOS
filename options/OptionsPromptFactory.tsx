import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { CircleHelp } from "lucide-react"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { Input } from "~components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~components/ui/select"
import { Textarea } from "~components/ui/textarea"

const storage = new Storage()

export default function OptionsPromptFactory() {
  const [contextMenuItems, setContextMenuItems] = useState([])
  const [myOwnPromptState, setMyOwnPromptState] = useState("")

  useEffect(() => {
    async function getStorage() {
      const items = await storage.get("contextMenuItems")
      setContextMenuItems(Array.isArray(items) ? items : [])
    }

    async function getMyOwnPrompt() {
      const myOwnPrompt = await storage.get("myOwnPrompt")
      setMyOwnPromptState(myOwnPrompt ?? "")
    }

    getStorage()
    getMyOwnPrompt()
  }, [])

  const handleChange = (index, field, value) => {
    const updatedItems = [...contextMenuItems]
    updatedItems[index][field] = value
    setContextMenuItems(updatedItems)
  }

  //What a shit show, saving two things together. Best practice thrown in the bin. TODO: Refactor the smelly code. (10:00PM - night)
  const handleSave = async () => {
    await storage.set("contextMenuItems", contextMenuItems)
    await storage.set("myOwnPrompt", myOwnPromptState)

    // Remove all existing context menu items
    chrome.contextMenus.removeAll(() => {
      // Create new context menu items
      contextMenuItems.forEach((item) => {
        chrome.contextMenus.create(item)
      })
    })

    alert("Changes saved!")
  }

  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>Prompt Factory</CardTitle>
          <CardDescription>
            Welcome to the Prompt Factory, where you can set new prompts in the
            Extension | OS. The section it's in is early version, and it will
            allow to add/remove and modify every prompt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contextMenuItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger className="flex flex-row gap-1">
                          <span>Display Name</span>{" "}
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
                          <span>Context</span>
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
                              rel="noopener noreferrer">
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
                          <span>ID</span>{" "}
                          <span>
                            <CircleHelp size={12} />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            The unique identifier utilized by the event listener
                            to trigger your function.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  {/* <TableHead>Target URL Patterns</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {contextMenuItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        type="text"
                        value={item.title || "Separator"}
                        onChange={(e) =>
                          handleChange(index, "title", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.contexts.join(", ")}
                        onValueChange={(value) =>
                          handleChange(index, "contexts", value.split(", "))
                        }>
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
                            "action"
                          ].map((context) => (
                            <SelectItem key={context} value={context}>
                              {context}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{item.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={() => handleSave()}>Save</Button>
        </CardFooter>
      </Card>

      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>Your Prompt</CardTitle>
          <CardDescription>
            In the near future you'll be able to create multiple prompts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={myOwnPromptState}
            onChange={(e) => setMyOwnPromptState(e.target.value)}
            placeholder="Enter your prompt here"
          />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={() => handleSave()}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
