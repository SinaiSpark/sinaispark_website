import { Button } from "@workspace/ui/components/button"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Foundation ready</h1>
          <p className="text-muted-foreground">
            Design tokens, site chrome and shared components are in place. Home
            page sections arrive in Phase 1.
          </p>
          <Button className="mt-2">Button</Button>
        </div>
      </div>
    </div>
  )
}
