import * as React from "react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

export interface MarkdownProps
  extends React.ComponentPropsWithoutRef<typeof ReactMarkdown> {
  content: string
  title: string
  description: string
  table_name: string
  className?: string
}

const Markdown = React.forwardRef<HTMLDivElement, MarkdownProps>(
  ({ content, title, description, className, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("w-full", className)}
      >
        {(title || description) && (
          <div className="mb-4">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        <div 
          className={cn(
            "prose dark:prose-invert max-w-none",
            // Add custom styling for markdown elements
            "[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6",
            "[&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-5",
            "[&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:mt-4",
            "[&>p]:mb-4 [&>p]:leading-relaxed",
            "[&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4",
            "[&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4",
            "[&>li]:mb-1",
            "[&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mb-4",
            "[&>code]:bg-gray-100 [&>code]:rounded [&>code]:px-1 [&>code]:py-0.5",
            "[&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded [&>pre]:mb-4 [&>pre>code]:bg-transparent",
          )}
        >
          <ReactMarkdown {...props}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    )
  }
)
Markdown.displayName = "Markdown"

export { Markdown }