"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";

export function HeroHighlightTitle() {
  return (
    <>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        // className="mx-auto max-w-4xl px-4 text-center text-2xl font-bold leading-relaxed text-neutral-700 dark:text-white md:text-4xl lg:text-5xl lg:leading-snug "
        className="text-center text-6xl font-extrabold text-black"
      >
        Empower Your Productivity: Automate, Summarize, Convert, Email, and
        Create Slides with Ease
        <Highlight className="bg-gradient-to-r from-sky-400 to-yellow-400 bg-clip-text text-transparent dark:text-white">
          Using Drive.ai
        </Highlight>
      </motion.h1>
    </>
  );
}
