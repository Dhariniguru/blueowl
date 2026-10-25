import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import client from "../api/client";

/* ─── helper: pretty timestamp ─────────────────────────────── */
function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ─── helper: guess which friendly error to show ───────────── */
function friendlyError(err) {
  const status = err?.response?.status;
  const msg = (err?.response?.data?.response || err?.message || "").toLowerCase();

  if (!err.response) {
    return "I can't reach the AI service right now. Please check your internet connection and try again.";
  }
  if (status === 429 || msg.includes("rate limit")) {
    return "You've been sending messages too quickly. Give me a second, then try again!";
  }
  if (status === 500 || status === 502 || status === 503 || status === 504) {
    return "The AI service is having a busy moment. Please wait a few seconds and retry.";
  }
  if (status === 401) {
    return "Your session has expired. Please log in again to continue chatting.";
  }
  return "Something went wrong while I was thinking. Please try again.";
}

/* ─── small ChatGPT-style logo / avatar ────────────────────── */
function BotAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-accent-500/30">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-primary-500/30">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
  );
}

/* ─── copy button ──────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-soft-400 hover:text-soft-600 hover:bg-soft-100 dark:hover:bg-soft-700 transition-colors"
      title="Copy message"
      aria-label="Copy message"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      )}
    </button>
  );
}

/* ─── message bubble ───────────────────────────────────────── */
function MessageBubble({ m, onRegenerate, isLastAssistant, loading }) {
  const isUser = m.role === "user";
  const isError = m.error === true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {isUser ? <UserAvatar /> : <BotAvatar />}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[75%]`}>
        <div
          className={`px-4 py-3 text-sm leading-relaxed rounded-2xl shadow-sm border ${
            isUser
              ? "bg-primary-500 text-white rounded-tr-md border-primary-600"
              : isError
                ? "bg-danger-light dark:bg-danger/10 border-danger/20 text-danger dark:text-danger"
                : "bg-white dark:bg-surface-dark-alt border-soft-100 dark:border-soft-700 rounded-tl-md"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{m.content}</p>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown
                components={{
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-accent-600 dark:text-accent-400 underline" />
                  ),
                  code: ({ inline, ...props }) =>
                    inline ? (
                      <code className="bg-soft-100 dark:bg-soft-800 rounded px-1.5 py-0.5 text-[0.85em] font-mono text-primary-700 dark:text-primary-400" {...props} />
                    ) : (
                      <code className="block bg-soft-900 text-soft-100 rounded-lg p-3 my-2 overflow-x-auto text-[0.85em] font-mono" {...props} />
                    ),
                  table: (props) => (
                    <div className="overflow-x-auto my-2">
                      <table className="min-w-full text-sm border-collapse" {...props} />
                    </div>
                  ),
                  th: (props) => (
                    <th className="border border-soft-200 dark:border-soft-700 px-3 py-1.5 text-left font-semibold bg-soft-50 dark:bg-soft-800" {...props} />
                  ),
                  td: (props) => (
                    <td className="border border-soft-200 dark:border-soft-700 px-3 py-1.5" {...props} />
                  ),
                  blockquote: (props) => (
                    <blockquote className="border-l-4 border-accent-400 pl-3 my-2 italic text-soft-500 dark:text-soft-400" {...props} />
                  ),
                  h1: (props) => <h1 className="text-lg font-bold mt-3 mb-1" {...props} />,
                  h2: (props) => <h2 className="text-base font-bold mt-3 mb-1" {...props} />,
                  h3: (props) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                  p: (props) => <p className="my-1.5" {...props} />,
                  ul: (props) => <ul className="list-disc pl-5 my-1.5 space-y-0.5" {...props} />,
                  ol: (props) => <ol className="list-decimal pl-5 my-1.5 space-y-0.5" {...props} />,
                  li: (props) => <li className="mb-0.5" {...props} />,
                  strong: (props) => <strong className="font-bold" {...props} />,
                  em: (props) => <em className="italic" {...props} />,
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* meta row: timestamp + actions */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] text-soft-400">{formatTime(m.timestamp)}</span>
          {!isUser && (
            <>
              <CopyButton text={m.content} />
              {isLastAssistant && !loading && (
                <button
                  onClick={onRegenerate}
                  className="p-1.5 rounded-lg text-soft-400 hover:text-soft-600 hover:bg-soft-100 dark:hover:bg-soft-700 transition-colors"
                  title="Regenerate response"
                  aria-label="Regenerate response"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── typing animation ─────────────────────────────────────── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5"
    >
      <BotAvatar />
      <div className="bg-white dark:bg-surface-dark-alt rounded-2xl rounded-tl-md px-4 py-3 border border-soft-100 dark:border-soft-700 shadow-sm">
        <div className="typing-indicator">
          <span /><span /><span />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── main panel ───────────────────────────────────────────── */
export default function AIChatPanel({ lessonId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = [
    "Explain this lesson's main idea",
    "Give me an example sentence",
    "What does this vocabulary mean?",
    "Help me practice this grammar",
  ];

  // reset chat when lesson changes
  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: "Hi! I'm **Neo**, your AI tutor 👋. Ask me about vocabulary, grammar, or anything in this lesson!",
      timestamp: new Date(),
    }]);
    setInput("");
    setLoading(false);
  }, [lessonId]);

  // auto-scroll on new messages / loading
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const sendMessage = async (textOverride) => {
    const userMsg = (textOverride ?? input).trim();
    if (!userMsg || loading) return;

    setInput("");
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMsg, timestamp: new Date() },
    ]);

    try {
      const res = await client.post("/ai/chat", {
        message: userMsg,
        lesson_id: lessonId ? Number(lessonId) : null,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response, timestamp: new Date() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: friendlyError(err),
          error: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const regenerate = async () => {
    if (loading) return;
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;

    const lastUser = messages[messages.length - 1 - lastUserIdx];
    // remove the previous assistant response(s) after that user message, then re-ask
    const trimmed = messages.slice(0, messages.length - lastUserIdx);
    setMessages(trimmed);
    setLoading(true);
    try {
      const res = await client.post("/ai/chat", {
        message: lastUser.content,
        lesson_id: lessonId ? Number(lessonId) : null,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response, timestamp: new Date() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: friendlyError(err), error: true, timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="card border-2 border-accent-200 dark:border-accent-700/40 overflow-hidden mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white">
        <div className="flex items-center gap-2.5">
          <BotAvatar />
          <div>
            <p className="text-sm font-semibold">Neo - AI Tutor</p>
            <p className="text-xs text-white/70 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              Powered by Gemini
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            title={isOpen ? "Collapse" : "Expand"}
            aria-label={isOpen ? "Collapse chat" : "Expand chat"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 sm:p-5">
          {/* Messages */}
          <div className="max-h-[420px] overflow-y-auto mb-4 flex flex-col gap-3 pr-1.5">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <MessageBubble
                  key={i}
                  m={m}
                  onRegenerate={regenerate}
                  isLastAssistant={m.role === "assistant" && i === messages.length - 1}
                  loading={loading}
                />
              ))}
            </AnimatePresence>

            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Welcome suggestions (show when only 1 message and not loading) */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(s)}
                  className="text-xs font-medium bg-soft-100 dark:bg-soft-800 text-soft-500 dark:text-soft-400 px-3 py-1.5 rounded-full hover:bg-soft-200 dark:hover:bg-soft-700 transition-colors"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 items-end">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask about this lesson..."
              className="flex-1 input-field text-sm"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="btn-accent px-4 py-2.5 flex items-center gap-1.5 disabled:opacity-40 rounded-xl2"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Send</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}