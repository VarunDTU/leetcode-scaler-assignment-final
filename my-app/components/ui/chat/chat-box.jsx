"use client";

import { useChat } from "@/hooks/use-ai";

import { Chat } from "@/components/ui/chat";

export default function ChatBox(props) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    isLoading,
  } = useChat(props);

  return (
    <div className="flex h-full w-full">
      <Chat
        className="grow"
        messages={messages}
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={isLoading}
        stop={stop}
        append={append}
      />
    </div>
  );
}
