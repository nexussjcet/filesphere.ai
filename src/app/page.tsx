import { Badge } from "@/components/ui/badge";
import { Sparkle } from "lucide-react";
import { Suspense } from "react";
import Login from "@/components/auth/Login";

export default function Home() {
  return (
    <div className="h-screen  relative flex items-center justify-center">
      <div className=" flex flex-col gap-6 items-center max-w-screen-lg w-full text-center">
        <Badge className=" flex-1 gap-1 bg-transparent border-[0.5px] border-gray-500 text-violet-500 px-3 py-1 hover:bg-transparent">
          <Sparkle/> <span className=" font-semibold">New</span> <span>Powered By FileSphere AI</span>
        </Badge>
        <h1 className=" text-6xl font-semibold">Transforming Files into Insights, Collaborate Anywhere</h1>
        <p className='text-accent-foreground/40 font-medium max-w-screen-md text-balance'>Unleash AI&apos;s Potential for Deep Analysis, Summarization, and Collaborative Sharing.</p>
        <Suspense>
          <Login/>
        </Suspense>
        <footer className="absolute bottom-3 text-center text-foreground/50 font-semibold text-sm flex items-center gap-1">
         Made with <span className="text-xl">❤️</span>team Nexus.
        </footer>
      </div>
    </div>
  );
}
