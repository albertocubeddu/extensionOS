import extensionAvatar from "data-base64:~assets/icon.png"
import { Menu } from "lucide-react"

import { Button } from "~components/ui/button"

import { Sheet, SheetContent, SheetTrigger } from "~components/ui/sheet"

export default function OptionsHeader() {
    return (
        <>
            <header className="top-0 flex h-24 items-center gap-4  bg-[#000] bg-gradient-to-b from-gray-700 to-transparent px-4 md:px-12">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full justify-center">
                    <a
                        href="#"
                        className="text-white transition-colors hover:text-grey text-3xl ">
                        Extension | OS - Configuration
                    </a>
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <a
                                href="#"
                                className="flex items-center gap-2 text-lg font-semibold">
                                <img
                                    style={{ width: "32px" }}
                                    src={extensionAvatar}
                                    alt="Some pretty cool image"
                                />
                                <span className="sr-only"> Extension | OS</span>
                            </a>
                            <a href="#" className="hover:text-foreground">
                                Extension | OS
                            </a>
                        </nav>
                    </SheetContent>
                </Sheet>
            </header>
        </>
    )
}
