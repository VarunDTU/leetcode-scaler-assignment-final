"use client";
import { MessageInput } from "@/components/ui/message-input";

export function BasicMessageInput() {
  return (
    <MessageInput
      value={input}
      onChange={handleInputChange}
      isGenerating={false}
    />
  );
}
