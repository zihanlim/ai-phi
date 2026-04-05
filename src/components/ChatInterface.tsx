"use client";

import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  philosopherId?: string;
  philosopherName?: string;
}

export interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  philosopherName?: string;
  mode?: "dialogue" | "debate";
}

export function ChatInterface({
  messages,
  onSendMessage,
  disabled = false,
  philosopherName,
  mode = "debate",
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const autoGrow = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [input, disabled, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (mode === "dialogue") {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    }
  }, [mode, handleSubmit]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl mb-2 block text-zinc-600">
              chat
            </span>
            <p className="text-on-surface-variant mb-6">
              Start a conversation with {philosopherName || "the philosopher"}
            </p>
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              <button
                onClick={() => onSendMessage("What is the nature of reality?")}
                className="px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-sm text-left text-sm text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all"
              >
                What is the nature of reality?
              </button>
              <button
                onClick={() => onSendMessage("How should we live a good life?")}
                className="px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-sm text-left text-sm text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all"
              >
                How should we live a good life?
              </button>
              <button
                onClick={() => onSendMessage("What is the relationship between knowledge and virtue?")}
                className="px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-sm text-left text-sm text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all"
              >
                What is the relationship between knowledge and virtue?
              </button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant text-on-surface"
              }`}
            >
              {message.role === "assistant" && message.philosopherName && (
                <p className="text-xs font-display text-on-surface-variant mb-1">
                  {message.philosopherName}
                </p>
              )}
              <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-outline-variant p-4"
      >
        <div className="flex gap-2">
          {mode === "dialogue" ? (
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoGrow(e);
              }}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={`Ask ${philosopherName || "the philosopher"}...`}
              rows={1}
              className="flex-1 px-4 py-3 rounded-xl bg-[#1a1a1a] border-2 border-zinc-600 text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors min-h-[52px] resize-none"
            />
          ) : (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={disabled}
              placeholder={`Message ${philosopherName || "the philosopher"}...`}
              className="flex-1 px-4 py-3 rounded-xl bg-surface-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          )}
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
