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
  onSendImage?: (imageUrl: string) => void;
  disabled?: boolean;
  philosopherName?: string;
  mode?: "dialogue" | "debate";
  philosopherBio?: string;
  showTypingIndicator?: boolean;
  suggestedPrompts?: string[];
  followUpSuggestions?: string[];
}

export function ChatInterface({
  messages,
  onSendMessage,
  onSendImage,
  disabled = false,
  philosopherName,
  mode = "debate",
  philosopherBio,
  showTypingIndicator = false,
  suggestedPrompts = [],
  followUpSuggestions = [],
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, messageId: string) => {
    if (playingId === messageId) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlayingId(messageId);
  }, [playingId]);

  const toggleExpand = useCallback((messageId: string) => {
    setExpandedMessages(prev => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  }, []);

  const handleImageAttach = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setAttachedImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeAttachedImage = useCallback(() => {
    setAttachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const autoGrow = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() && !disabled) {
      if (attachedImage && onSendImage) {
        onSendImage(attachedImage);
        setAttachedImage(null);
      }
      onSendMessage(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [input, disabled, onSendMessage, attachedImage, onSendImage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (mode === "dialogue") {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    }
  }, [mode, handleSubmit]);

  const isLongMessage = (content: string) => content.length > 500;

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Intro Profile */}
      {philosopherBio && (
        <div className="border-b border-outline-variant/20 flex-shrink-0">
          <div className="p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-1">info</span>
            <p className="text-sm text-on-surface-variant leading-relaxed">{philosopherBio}</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-36 sm:pb-24 md:pb-6 mb-24 sm:mb-0">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl mb-2 block text-zinc-600">
              chat
            </span>
            <p className="text-on-surface-variant mb-6">
              Start a conversation with {philosopherName || "the philosopher"}
            </p>
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              {(suggestedPrompts.length > 0 ? suggestedPrompts : [
                "What is the nature of reality?",
                "How should we live a good life?",
                "What is the relationship between knowledge and virtue?",
              ]).slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(prompt)}
                  className="px-4 py-3 bg-surface-container-high border border-outline-variant/30 rounded-sm text-left text-sm text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => {
          const isExpanded = expandedMessages.has(message.id);
          const shouldCollapse = isLongMessage(message.content) && !isExpanded;

          return (
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
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-display text-on-surface-variant">
                      {message.philosopherName}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speak(message.content, message.id)}
                        className="p-1 rounded-full hover:bg-surface-variant/50 transition-colors"
                        aria-label={playingId === message.id ? "Stop speech" : "Play speech"}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {playingId === message.id ? "stop" : "play_arrow"}
                        </span>
                      </button>
                      {playingId === message.id && (
                        <span className="text-[10px] text-zinc-500">
                          {Math.ceil(message.content.split(/\s+/).length / 3)}″
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>
                    {shouldCollapse ? message.content.slice(0, 500) + "..." : message.content}
                  </ReactMarkdown>
                </div>
                {shouldCollapse && (
                  <button
                    onClick={() => toggleExpand(message.id)}
                    className="text-xs text-primary mt-2 hover:underline"
                  >
                    Show more
                  </button>
                )}
                {isLongMessage(message.content) && isExpanded && (
                  <button
                    onClick={() => toggleExpand(message.id)}
                    className="text-xs text-primary mt-2 hover:underline"
                  >
                    Show less
                  </button>
                )}
                {message.role === "assistant" && followUpSuggestions.length > 0 && !expandedMessages.has(message.id) && (
                  <div className="mt-3 pt-2 border-t border-outline-variant/30">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Continue exploring</p>
                    <div className="flex flex-wrap gap-1.5">
                      {followUpSuggestions.slice(0, 3).map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => onSendMessage(suggestion)}
                          className="px-2.5 py-1.5 text-xs bg-surface rounded-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {showTypingIndicator && (
          <div className="flex justify-start">
            <div className="bg-surface-variant rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-20 left-0 right-0 border-t border-outline-variant p-3 bg-surface z-10 pb-[env(safe-area-inset-bottom)] md:bottom-0 md:p-4"
      >
        {/* Attached Image Preview */}
        {attachedImage && (
          <div className="mb-2 relative inline-block">
            <img src={attachedImage} alt="Attached" className="max-h-24 sm:max-h-32 rounded-lg" />
            <button
              type="button"
              onClick={removeAttachedImage}
              className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex gap-2 items-end">
          {onSendImage && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageAttach}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 sm:px-4 py-2 sm:py-3 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex-shrink-0"
                aria-label="Attach image"
              >
                <span className="material-symbols-outlined text-sm sm:text-base">attach_file</span>
              </button>
            </>
          )}
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
              className="flex-1 min-w-0 px-6 py-3 rounded-full bg-[#1a1a1a] border-2 border-zinc-600 text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors min-h-[52px] resize-none text-base"
            />
          ) : (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={disabled}
              placeholder={`Message ${philosopherName || "the philosopher"}...`}
              className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 rounded-full bg-surface-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-sm sm:text-base"
            />
          )}
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className="w-12 h-12 rounded-full bg-primary text-on-primary font-medium hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
