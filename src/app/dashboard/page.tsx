



export default function Dashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <div className="max-w-screen-sm mx-auto w-full flex flex-col gap-4">

        <p className="text-sm text-muted-foreground text-center">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>+ K
          </kbd>{" "}
          to see the magic
        </p>
      </div>

    </div>
  )
}
