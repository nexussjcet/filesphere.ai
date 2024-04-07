"use client"

import {
    Calendar,
    User
} from "lucide-react"
import * as React from "react"

import {
    CommandDialog,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { UserBrowserState } from "@/lib/store"
import { Mentions } from "./mentions"
import { EmptyTrigger } from "./trigger"

export function PromptCommands() {
    const [open, setOpen] = React.useState(false)
    const { userState: { recentFilesAccessed, listOfContactsAvailable } } = UserBrowserState()
    const files = recentFilesAccessed ?? []
    const contacts = listOfContactsAvailable ?? []

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <p className="text-sm text-muted-foreground text-center">
                Press{" "}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>+ K
                </kbd>{" "}
                to see the magic
            </p>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <Mentions />
                <CommandList>
                    <EmptyTrigger />
                    <CommandGroup heading="Recent Files">
                        {files.map((e) => (<CommandItem key={e}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{e}</span>
                        </CommandItem>))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Recent Contacts">
                        {contacts.map(c => (<CommandItem key={c.email}>
                            <User className="mr-2 h-4 w-4" />
                            <span>{c.name}</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}