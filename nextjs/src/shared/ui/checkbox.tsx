import * as React from "react"
import { cn } from "../lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
      props.onChange?.(e)
    }

    const handleClick = () => {
      inputRef.current?.click()
    }

    return (
      <div className="relative inline-block">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={inputRef}
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <div
          onClick={handleClick}
          className={cn(
            "h-5 w-5 rounded border border-input bg-background",
            "flex items-center justify-center",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
            "peer-checked:bg-primary peer-checked:border-primary",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            "cursor-pointer transition-colors",
            className
          )}
        >
          <Check
            className={cn(
              "h-4 w-4 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity"
            )}
          />
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

