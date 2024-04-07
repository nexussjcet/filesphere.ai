import { TableDemo } from "./_components/FileList";
import Header from "./_components/Header";


import { PromptCommands } from "@/components/madeup/prompt";


export default function Dashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center w-full p-5">
      <div className="fixed top-5 w-full p-5">
        <Header />
      </div>
      <div className="max-w-screen-sm mx-auto w-full flex flex-col gap-4">
        <PromptCommands />
        {/* <TableDemo /> */}
      </div>

    </div>
  )
}

