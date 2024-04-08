import { CommandEmpty, SimpleCommandGroup, SimpleCommandItem } from "@/components/ui/command"
import { AllowALL } from "@/lib/schema"
import { UserBrowserState } from "@/lib/store"
import { TimeLineState } from "@/lib/timeline"
import { api } from "@/trpc/react"
import { useCommandState } from "cmdk"
import { ChevronRight, Loader2, Zap } from "lucide-react"
import { KeyboardEventHandler, useEffect } from "react"
import { toast } from "sonner"
import Timeline from "./progress"



export const EmptyTrigger = () => {
    const { userState } = UserBrowserState()
    const search = useCommandState((state) => state.search)
    const { status, setStatus, setSuccessData } = TimeLineState()



    const { mutate } = api.chain.initiative.useMutation({
        onError: () => setStatus("error"),
        onSuccess: (data) => {
            setSuccessData(data)
            toast("Event has been created", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
                style: {
                    width: "24rem",
                }
            })
        }
        ,
    })



    useEffect(() => {
        if (search && status !== "idle") setStatus("idle")
    }, [search])

    function handleSearch() {

        if (search.length === 0) return;

        setStatus("searching")

        mutate({
            permissions: AllowALL,
            prompt: search,
            state: userState
        })
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleSearch()
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    if (!search) return null

    const onEnter: KeyboardEventHandler<HTMLButtonElement> = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            handleSearch()
        }
    }




    function Switcher() {
        switch (status) {
            case "searching":
                return <SimpleCommandItem asChild>
                    <Loader2 className="animate-spin" />
                </SimpleCommandItem>
            case "idle":
                return <button type="button" className="inline-flex h-10 animate-shimmer items-center justify-center rounded-xs border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onKeyDown={onEnter} onClick={handleSearch}>
                    <>Execute <Zap className="w-4 ms-1 fill-white" /></>
                </button>
            case "error":
                return <SimpleCommandItem>
                    <>error, retry searching <ChevronRight /></>
                </SimpleCommandItem>
            default: return <SimpleCommandGroup className="w-full flex flex-row">
                <Timeline/>
            </SimpleCommandGroup>
        }
    }
    return <CommandEmpty className="flex flex-row justify-center items-center py-6">
        <Switcher />
    </CommandEmpty>
}