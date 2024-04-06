import { HeroHighlightTitle } from "@/components/madeup/herohighlight";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { Meteors } from "@/components/ui/meteors";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import InputPrompt from "@/components/instances/input";
import { motion } from "framer-motion";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <AuroraBackground>
        {/* <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col items-center justify-center gap-4 px-4"
        > */}
        {/* <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700"> */}
        <div className="flex h-screen w-screen items-center justify-center bg-white">
          <div className="flex max-w-[80vw] flex-col items-center gap-10">
            {/* <h1 className="text-center text-6xl font-extrabold text-white">
          </h1> */}
            <HeroHighlightTitle />
            <Link
              href="/dashboard"
              className="relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-slate-800 bg-gradient-to-r from-black via-slate-800 to-black px-10 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              {/* <span className="animate-shimmer absolute inset-0 bg-gradient-to-r from-black via-slate-800 to-black">
                Get Started
              </span> */}
              Get Started
            </Link>
          </div>
          <Meteors number={20} />
        </div>
        {/* </motion.div> */}
      </AuroraBackground>
    </>
  );
}
