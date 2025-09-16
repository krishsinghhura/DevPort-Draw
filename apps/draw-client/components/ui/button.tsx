"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
          variant === "default" &&
            "bg-indigo-600 text-white hover:bg-indigo-700 shadow",
          variant === "outline" &&
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
