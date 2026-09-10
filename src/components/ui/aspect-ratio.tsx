import { AspectRatio as AspectRatioPrimitive } from "radix-ui"

/**
 * Constrains its child to a fixed width/height ratio (`ratio={16 / 9}`) — images, video,
 * maps. Stock shadcn/ui on Radix AspectRatio; not yet reconciled with Figma.
 */
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
