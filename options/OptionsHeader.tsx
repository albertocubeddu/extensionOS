import extensionAvatar from "data-base64:~assets/icon.png"
import { CircleUser, Menu, Search } from "lucide-react"

import { Button } from "~components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "~components/ui/dropdown-menu"
import { Input } from "~components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "~components/ui/sheet"

export default function OptionsHeader() {
    return (
        <>
            <header className="top-0 flex h-24 items-center gap-4  bg-[#000] bg-gradient-to-b from-gray-700 to-transparent px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-[300px] ">
                    <a
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base">
                        <img
                            style={{ width: "32px" }}
                            src={extensionAvatar}
                            alt="Some pretty cool image"
                        />
                        <span className="sr-only text-white">Extension | OS</span>
                    </a>
                    <a
                        href="#"
                        className="text-white transition-colors hover:text-grey">
                        Extension | OS
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
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Coming Soon..."
                                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                            />
                        </div>
                    </form>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end"  >
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                            {/* <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Logout</DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
        </>
    )
}
