"use client";
import { cva } from "class-variance-authority";
import { Code2, Loader2, Terminal } from "lucide-react";
import { useMemo } from "react";

import { FilePreview } from "@/components/ui/file-preview";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

const MarkdownParser = ({ markdown }) => {
  // Check if markdown is undefined or null
  if (!markdown) {
    return <div>No content to display</div>;
  }

  // Try to safely parse the markdown if it's a JSON string
  let parsedMarkdown = markdown;
  try {
    if (
      typeof markdown === "string" &&
      (markdown.startsWith("{") || markdown.startsWith("["))
    ) {
      const parsed = JSON.parse(markdown);
      parsedMarkdown =
        typeof parsed === "string" ? parsed : JSON.stringify(parsed, null, 2);
    }
  } catch (e) {
    console.log("Not a JSON string, using as-is");
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Add basic table handling
          table: ({ node, ...props }) => (
            <table
              className="border-collapse border border-slate-300"
              {...props}
            />
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-slate-100" {...props} />
          ),
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr: ({ node, ...props }) => (
            <tr className="border-b border-slate-300" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-slate-300 px-4 py-2 text-left"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-slate-300 px-4 py-2" {...props} />
          ),
        }}
      >
        {parsedMarkdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownParser;

// Example Usage:
// Assuming you have the markdown string stored in a variable called 'markdownString'
// <MarkdownParser markdown={markdownString} />

// Example markdownString
// const markdownString = `
// Let's solidify your understanding of the sliding window technique...
//
// \`\`\`python
// def longest_substring_without_repeating_characters(s):
//     # ... your python code ...
// \`\`\`
// `;

const chatBubbleVariants = cva(
  "group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[70%]",
  {
    variants: {
      isUser: {
        true: "bg-primary text-primary-foreground",
        false: "bg-muted text-foreground",
      },
      animation: {
        none: "",
        slide: "duration-300 animate-in fade-in-0",
        scale: "duration-300 animate-in fade-in-0 zoom-in-75",
        fade: "duration-500 animate-in fade-in-0",
      },
    },
    compoundVariants: [
      {
        isUser: true,
        animation: "slide",
        class: "slide-in-from-right",
      },
      {
        isUser: false,
        animation: "slide",
        class: "slide-in-from-left",
      },
      {
        isUser: true,
        animation: "scale",
        class: "origin-bottom-right",
      },
      {
        isUser: false,
        animation: "scale",
        class: "origin-bottom-left",
      },
    ],
  }
);

export const ChatMessage = ({
  role,
  content,
  createdAt,
  showTimeStamp = false,
  animation = "scale",
  actions,
  className,
  experimental_attachments,
  toolInvocations,
}) => {
  const files = useMemo(() => {
    return experimental_attachments?.map((attachment) => {
      const dataArray = dataUrlToUint8Array(attachment.url);
      const file = new File([dataArray], attachment.name ?? "Unknown");
      return file;
    });
  }, [experimental_attachments]);

  if (toolInvocations && toolInvocations.length > 0) {
    return <ToolCall toolInvocations={toolInvocations} />;
  }

  const isUser = role === "user";

  const formattedTime = createdAt?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      {files ? (
        <div className="mb-1 flex flex-wrap gap-2">
          {files.map((file, index) => {
            return <FilePreview file={file} key={index} />;
          })}
        </div>
      ) : null}
      <div className={cn(chatBubbleVariants({ isUser, animation }), className)}>
        <div>
          <MarkdownParser markdown={content} />
        </div>

        {role === "assistant" && actions ? (
          <div className="absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
            {actions}
          </div>
        ) : null}
      </div>
      {showTimeStamp && createdAt ? (
        <time
          dateTime={createdAt.toISOString()}
          className={cn(
            "mt-1 block px-1 text-xs opacity-50",
            animation !== "none" && "duration-500 animate-in fade-in-0"
          )}
        >
          {formattedTime}
        </time>
      ) : null}
    </div>
  );
};

function dataUrlToUint8Array(data) {
  const base64 = data.split(",")[1];
  const buf = Buffer.from(base64, "base64");
  return new Uint8Array(buf);
}

function ToolCall({ toolInvocations }) {
  if (!toolInvocations?.length) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      {toolInvocations.map((invocation, index) => {
        switch (invocation.state) {
          case "partial-call":
          case "call":
            return (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground"
              >
                <Terminal className="h-4 w-4" />
                <span>Calling {invocation.toolName}...</span>
                <Loader2 className="h-3 w-3 animate-spin" />
              </div>
            );
          case "result":
            return (
              <div
                key={index}
                className="flex flex-col gap-1.5 rounded-lg border bg-muted px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Code2 className="h-4 w-4" />
                  <span>Result from {invocation.toolName}</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-foreground">
                  {JSON.stringify(invocation.result, null, 2)}
                </pre>
              </div>
            );
        }
      })}
    </div>
  );
}
