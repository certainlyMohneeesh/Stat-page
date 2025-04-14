import * as React from "react"
import { useToast } from "../../hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 right-0 z-50 p-4">
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <div
            key={id}
            className="mb-4 rounded-lg bg-background p-4 shadow-lg"
            {...props}
          >
            <div className="flex items-start">
              <div className="flex-1">
                {title && <p className="font-medium">{title}</p>}
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              {action}
            </div>
          </div>
        )
      })}
    </div>
  )
} 

export { useToast }
