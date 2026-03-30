import * as React from "react"
import { cn } from "@/lib/utils"

const ListGroup = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "flex flex-col rounded-lg border border-outline-variant/20 overflow-hidden bg-surface",
      className
    )}
    {...props}
  />
))
ListGroup.displayName = "ListGroup"

const ListGroupItem = React.forwardRef(({ className, active, disabled, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "px-4 py-3 border-b border-outline-variant/10 last:border-b-0 transition-colors",
      {
        "bg-brand-primary/10 text-brand-primary font-medium": active,
        "text-on-surface-variant cursor-not-allowed opacity-50": disabled,
        "hover:bg-surface-container/50 cursor-pointer": !disabled && !active,
        "text-on-surface": !active && !disabled,
      },
      className
    )}
    {...props}
  />
))
ListGroupItem.displayName = "ListGroupItem"

export { ListGroup, ListGroupItem }
