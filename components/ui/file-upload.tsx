"use client"

import * as React from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[] | null
  onValueChange?: (files: File[] | null) => void
  dropzoneOptions?: Omit<DropzoneOptions, "onDrop">
}

const FileUploader = React.forwardRef<HTMLDivElement, FileUploaderProps>(
  ({ className, value, onValueChange, dropzoneOptions, children, ...props }, ref) => {
    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        const newFiles = value ? [...value, ...acceptedFiles] : acceptedFiles
        onValueChange?.(newFiles)
      },
      [value, onValueChange]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      ...dropzoneOptions,
    })

    return (
      <div
        ref={ref}
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-muted-foreground/50",
          isDragActive && "border-muted-foreground/50",
          className
        )}
        {...props}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    )
  }
)
FileUploader.displayName = "FileUploader"

const FileInput = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {children}
    </div>
  )
})
FileInput.displayName = "FileInput"

const FileUploaderContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-4 space-y-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
FileUploaderContent.displayName = "FileUploaderContent"

interface FileUploaderItemProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number
}

const FileUploaderItem = React.forwardRef<HTMLDivElement, FileUploaderItemProps>(
  ({ className, index, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between rounded-md border border-border bg-background p-2",
          className
        )}
        {...props}
      >
        <div className="flex items-center space-x-2">
          {children}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation()
            // Handle file removal logic here
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }
)
FileUploaderItem.displayName = "FileUploaderItem"

export { FileUploader, FileInput, FileUploaderContent, FileUploaderItem }