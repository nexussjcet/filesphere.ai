"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/trpc/react";
import Timeline from "@/components/madeup/progress";
import { AllowALL } from "@/lib/schema";
import { FC, useState } from "react";
import { listGoogleContacts, listGoogleDriveFiles } from "../_actions";

const InputPrompt: FC<{
  files: Awaited<ReturnType<typeof listGoogleDriveFiles>>;
  contacts: Awaited<ReturnType<typeof listGoogleContacts>>;
}> = ({ contacts, files }) => {
  const [text, setText] = useState<string>();

  const { mutateAsync: func, data } = api.chain.initiative.useMutation();

  return (
    <>
      {data && <Timeline data={data} />}

      <div className="mt-40"/>
      <form
        className="relative mx-auto w-full max-w-md justify-center overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        onSubmit={async (e) => {
          e.preventDefault();
          const contactSorted = contacts?.map((c) => ({
            name: (c?.names ?? [])[0]?.givenName ?? [],
            email: (c?.emailAddresses ?? [])[0]?.value ?? [],
          }));
          await func({
            permissions: AllowALL,
            prompt: text ?? "",
          });
        }}
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          onChange={(e) => setText(e.target.value as unknown as string)}
          id="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="first-line: flex items-center justify-center p-3 pt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Paperclip className="size-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach File</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Mic className="size-4" />
                  <span className="sr-only">Use Microphone</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Use Microphone</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button type="submit" size="sm" className="ml-auto gap-1.5">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </>
  );
};

export default InputPrompt;
