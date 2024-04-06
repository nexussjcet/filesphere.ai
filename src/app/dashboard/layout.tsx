import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  SquareTerminal,
  SquareUser,
  Triangle,
  Turtle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  listGoogleContacts,
  listGoogleDriveFiles,
} from "@/app/dashboard/_actions";
import Link from "next/link";
import { Providers } from "./provider";
import SignoutButton from "./_components/signout";
import SearchItems from "./_components/SearchItems";
import Timeline from "@/components/madeup/progress";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardDemo } from "@/components/madeup/permission_false";
import InputPrompt from "./_components/sentprompt";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const files = await listGoogleDriveFiles();
  const contacts = await listGoogleContacts();

  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Providers>
      <>
        <div className="grid h-screen w-full pl-[53px]">
          <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
            <div className="border-b p-2">
              <Button variant="outline" size="icon" aria-label="Home">
                <Triangle className="size-5 fill-foreground" />
              </Button>
            </div>
            <nav className="grid gap-1 p-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg bg-muted"
                      aria-label="Playground"
                    >
                      <SquareTerminal className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Playground
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label="Models"
                    >
                      <Bot className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Models
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label="API"
                    >
                      <Code2 className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    API
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label="Documentation"
                    >
                      <Book className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Documentation
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label="Settings"
                    >
                      <Settings2 className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Settings
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
            <nav className="mt-auto grid gap-1 p-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-auto rounded-lg"
                      aria-label="Help"
                    >
                      <LifeBuoy className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Help
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-auto rounded-lg"
                          aria-label="Account"
                        >
                          <SquareUser className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="absolute bottom-0 w-auto"
                      >
                        <CardDemo />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Account
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          </aside>
          <div className="flex flex-col">
            <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
              <div className="flex w-full items-center justify-between">
                <h1 className="text-xl font-semibold">Drive.ai</h1>
                <SignoutButton />
              </div>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Settings className="size-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[300px]">
                  <DrawerHeader>
                    <DrawerTitle>Configuration</DrawerTitle>
                    <DrawerDescription>
                      Configure the settings for the model and messages.
                    </DrawerDescription>
                  </DrawerHeader>
                  <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                      <legend className="-ml-1 px-1 text-sm font-medium">
                        Settings
                      </legend>
                      <div className="grid gap-3">
                        <Label htmlFor="model">Model</Label>
                        <Select>
                          <SelectTrigger
                            id="model"
                            className="items-start [&_[data-description]]:hidden"
                          >
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="genesis">
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <Rabbit className="size-5" />
                                <div className="grid gap-0.5">
                                  <p>
                                    Neural{" "}
                                    <span className="font-medium text-foreground">
                                      Genesis
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                    Our fastest model for general use cases.
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="explorer">
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <Bird className="size-5" />
                                <div className="grid gap-0.5">
                                  <p>
                                    Neural{" "}
                                    <span className="font-medium text-foreground">
                                      Explorer
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                    Performance and speed for efficiency.
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="quantum">
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <Turtle className="size-5" />
                                <div className="grid gap-0.5">
                                  <p>
                                    Neural{" "}
                                    <span className="font-medium text-foreground">
                                      Quantum
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                    The most powerful model for complex
                                    computations.
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="temperature">Temperature</Label>
                        <Input
                          id="temperature"
                          type="number"
                          placeholder="0.4"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="top-p">Top P</Label>
                        <Input id="top-p" type="number" placeholder="0.7" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="top-k">Top K</Label>
                        <Input id="top-k" type="number" placeholder="0.0" />
                      </div>
                    </fieldset>
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                      <legend className="-ml-1 px-1 text-sm font-medium">
                        Messages
                      </legend>
                      <div className="grid gap-3">
                        {/* <Label htmlFor="role">Role</Label> */}
                        <Input type="text" placeholder="Search" />
                      </div>
                      <div className="grid gap-3">
                        {/* <Label htmlFor="content">Content</Label>
                    <Textarea id="content" placeholder="You are a..." /> */}
                      </div>
                    </fieldset>
                  </form>
                </DrawerContent>
              </Drawer>
            </header>
            <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-4 ">
              <div className="relative hidden flex-col items-start gap-8 rounded-xl bg-muted/90 p-3 md:flex">
                <div className="grid-flow-rows grid w-full items-start gap-6">
                  <fieldset className="grid gap-6 rounded-lg border bg-white p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">
                      Files
                    </legend>
                    <SearchItems files={files} />
                  </fieldset>
                  <fieldset className="grid gap-6 rounded-lg border bg-white p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">
                      Contacts
                    </legend>
                    <div className="no-scrollbar flex h-[140px] flex-row flex-wrap gap-3 overflow-y-auto">
                      {!contacts ? (
                        <div className="s flex w-full                                                                                                                                                                items-center text-center">
                          No contacts found
                        </div>
                      ) : (
                        contacts?.map((contact, i) => (
                          <TooltipProvider key={i}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full   text-opacity-10 ${getRandomColor()}`}
                                >
                                  {contact.names?.[0]?.givenName?.slice(0, 1) ??
                                    ""}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{contact.names?.[0]?.givenName}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))
                      )}
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="relative flex h-full min-h-[50vh] flex-col self-center rounded-xl bg-muted/70 p-4 lg:col-span-2">
                <Badge variant="outline" className="absolute right-3 top-3">
                  Process
                </Badge>
                <InputPrompt />
              </div>
              <div className="relative hidden flex-col items-start gap-8 md:flex">
                {children}
              </div>
            </main>
          </div>
        </div>
      </>
    </Providers>
  );
}
