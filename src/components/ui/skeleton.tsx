import { cn } from "@/lib/utils"

/**
 * Pulsing placeholder block shown while content loads; size it with `className`
 * (`h-4 w-[250px]`, `size-12 rounded-full`). Stock shadcn/ui; not yet reconciled with Figma.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  )
}

export { Skeleton }
