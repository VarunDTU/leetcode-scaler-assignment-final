"use client";
import { ArrowDown, ThumbsDown, ThumbsUp } from "lucide-react";
import { forwardRef, useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { MessageInput } from "@/components/ui/message-input";
import { MessageList } from "@/components/ui/message-list";
import { PromptSuggestions } from "@/components/ui/prompt-suggestions";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { cn } from "@/lib/utils";

export function Chat({
  messages,
  handleSubmit,
  input,
  handleInputChange,
  stop,
  isGenerating,
  append,
  suggestions,
  className,
  onRateResponse,
}) {
  const lastMessage = messages.at(-1);
  const isEmpty = messages.length === 0;
  const isTyping = lastMessage?.role === "user";

  const messageOptions = useCallback(
    (message) => ({
      actions: onRateResponse ? (
        <>
          <div className="border-r pr-1">
            <CopyButton
              content={message.content}
              copyMessage="Copied response to clipboard!"
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, "thumbs-up")}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, "thumbs-down")}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <CopyButton
          content={message.content}
          copyMessage="Copied response to clipboard!"
        />
      ),
    }),
    [onRateResponse]
  );

  return (
    <ChatContainer className={className}>
      {isEmpty && append && suggestions ? (
        <PromptSuggestions
          label="Try these prompts ✨"
          append={append}
          suggestions={suggestions}
        />
      ) : null}
      {messages.length > 0 ? (
        <ChatMessages messages={messages}>
          <MessageList
            messages={messages}
            isTyping={isTyping}
            messageOptions={messageOptions}
          />
        </ChatMessages>
      ) : null}
      <ChatForm
        className="mt-auto"
        isPending={isGenerating || isTyping}
        handleSubmit={handleSubmit}
      >
        {({ files, setFiles }) => (
          <MessageInput
            value={input}
            onChange={handleInputChange}
            stop={stop}
            isGenerating={isGenerating}
          />
        )}
      </ChatForm>
    </ChatContainer>
  );
}
Chat.displayName = "Chat";

export function ChatMessages({ messages, children }) {
  const {
    containerRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
    handleTouchStart,
  } = useAutoScroll([messages]);

  return (
    <div
      className="grid grid-cols-1 overflow-y-auto pb-4"
      ref={containerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
    >
      <div className="max-w-full [grid-column:1/1] [grid-row:1/1]">
        {children}
      </div>
      <div className="flex flex-1 items-end justify-end [grid-column:1/1] [grid-row:1/1]">
        {!shouldAutoScroll && (
          <div className="sticky bottom-0 left-0 flex w-full justify-end">
            <Button
              onClick={scrollToBottom}
              className="h-8 w-8 rounded-full ease-in-out animate-in fade-in-0 slide-in-from-bottom-1"
              size="icon"
              variant="ghost"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export const ChatContainer = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid max-h-full w-full grid-rows-[1fr_auto]", className)}
      {...props}
    />
  );
});
ChatContainer.displayName = "ChatContainer";

export const ChatForm = forwardRef(
  ({ children, handleSubmit, isPending, className }, ref) => {
    const [files, setFiles] = useState(null);

    const onSubmit = (event) => {
      if (!files) {
        handleSubmit(event);
        return;
      }

      const fileList = createFileList(files);
      handleSubmit(event, { experimental_attachments: fileList });
      setFiles(null);
    };

    return (
      <form ref={ref} onSubmit={onSubmit} className={className}>
        {children({ files, setFiles })}
      </form>
    );
  }
);
ChatForm.displayName = "ChatForm";

function createFileList(files) {
  const dataTransfer = new DataTransfer();
  for (const file of Array.from(files)) {
    dataTransfer.items.add(file);
  }
  return dataTransfer.files;
}
