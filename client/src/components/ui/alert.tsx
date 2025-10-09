import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 flex items-start space-x-3",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        info: "bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-300/50",
        success: "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-300/50",
        warning: "bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 border-yellow-300/50",
        destructive:
          "bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-300/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  destructive: AlertCircle,
  default: Info
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
  description?: string
  icon?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, description, icon, children, ...props }, ref) => {
    const Icon = icons[variant ?? "default"]
    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
        <div className="pt-0.5">{icon || <Icon className="h-5 w-5 shrink-0" />}</div>
        <div className="flex-1 space-y-1">
          {title && <h5 className="font-medium leading-none tracking-tight">{title}</h5>}
          {(description || children) && (
            <div className="text-sm text-muted-foreground">
              {description || children}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert }
