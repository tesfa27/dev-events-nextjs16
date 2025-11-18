"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TagsInputProps {
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  className?: string
}

const TagsInput = React.forwardRef<HTMLDivElement, TagsInputProps>(
  ({ className, value = [], onValueChange, placeholder, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
        e.preventDefault()
        const newTag = inputValue.trim()
        if (newTag && !value.includes(newTag)) {
          onValueChange?.([...value, newTag])
          setInputValue("")
        }
      } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
        onValueChange?.(value.slice(0, -1))
      }
    }

    const removeTag = (tagToRemove: string) => {
      onValueChange?.(value.filter((tag) => tag !== tagToRemove))
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          className
        )}
        {...props}
      >
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="flex-1 border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    )
  }
)
TagsInput.displayName = "TagsInput"

export { TagsInput }