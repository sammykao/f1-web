"use client";
import React, { useState, useEffect, useRef } from "react";
import { Navigation } from "../../components/nav";

function Spinner() {
  return (
    <div className="flex justify-center items-center py-4">
      <svg className="animate-spin h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </div>
  );
}

export default function OtfChatPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", text: "Welcome to Orange Theory AI! How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("otf_chat_authed");
      const storedPassword = sessionStorage.getItem("otf_chat_password");
      if (stored === "true" && storedPassword) {
        setAuthed(true);
        setPassword(storedPassword);
      }
    }
  }, []);

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Password required");
      return;
    }
    setAuthLoading(true);
    fetch("/api/otf-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "hello", password }),
    })
      .then(async (res) => {
        setAuthLoading(false);
        if (res.status === 401) {
          setError("Incorrect password");
          setPassword("");
          setAuthed(false);
        } else {
          sessionStorage.setItem("otf_chat_authed", "true");
          sessionStorage.setItem("otf_chat_password", password);
          setAuthed(true);
        }
      })
      .catch(() => {
        setAuthLoading(false);
        setError("Server error");
      });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: "user", text: input }]);
    setLoading(true);
    setInput("");
    try {
      const res = await fetch("/api/otf-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, password }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setError("Session expired or password incorrect. Please log in again.");
        setAuthed(false);
        setPassword("");
        sessionStorage.removeItem("otf_chat_authed");
        sessionStorage.removeItem("otf_chat_password");
        return;
      }
      if (data?.aiText) {
        setMessages((msgs) => [...msgs, { role: "ai", text: data.aiText }]);
      } else if (data?.error) {
        setMessages((msgs) => [...msgs, { role: "ai", text: data.error }]);
      } else {
        setMessages((msgs) => [...msgs, { role: "ai", text: "No response from AI agent." }]);
      }
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: "ai", text: "Error contacting AI agent." }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  function handleLogout() {
    setAuthed(false);
    setPassword("");
    sessionStorage.removeItem("otf_chat_authed");
    sessionStorage.removeItem("otf_chat_password");
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh] p-4 mt-24">
          <form onSubmit={handlePassword} className="w-full max-w-md bg-zinc-900 p-6 rounded shadow-md flex flex-col gap-4 border border-zinc-700">
            <h2 className="text-2xl font-bold text-orange-400 text-center">Enter Password</h2>
            <input
              type="password"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
            />
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            {authLoading ? (
              <Spinner />
            ) : (
              <button
                type="submit"
                className="bg-orange-500 text-white py-2 rounded hover:bg-orange-600 border border-orange-400 transition"
                disabled={authLoading}
              >
                Unlock
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navigation />
      <div className="p-4 sm:p-8 max-w-2xl mx-auto min-h-[80vh] flex flex-col mt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-400 mb-1">Orange Theory AI Chat</h1>
          <p className="text-zinc-400 mb-4">Chat with the Orange Theory AI agent for bookings, stats, and more.</p>
          <button onClick={handleLogout} className="text-orange-400 underline text-sm hover:text-orange-300">Log out</button>
        </div>
        <div className="bg-zinc-900 rounded shadow p-4 sm:p-6 border border-zinc-700 flex flex-col flex-1 mb-4 min-h-[400px]">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-4 py-2 rounded-lg max-w-full sm:max-w-xl font-mono border border-zinc-800 break-words ${
                    msg.role === "user"
                      ? "bg-zinc-900 text-orange-100"
                      : msg.role === "ai"
                      ? "bg-zinc-800 text-orange-200"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="mb-2 flex justify-start">
                <div className="px-4 py-2 rounded-lg bg-zinc-800 text-orange-200 animate-pulse font-mono border border-zinc-800">Thinking...</div>
              </div>
            )}
            {error && (
              <div className="mb-2 flex justify-center">
                <div className="px-4 py-2 rounded-lg bg-red-900 text-red-300 border border-red-800">{error}</div>
              </div>
            )}
          </div>
          <div className="border-t border-zinc-800 pt-4 mt-2">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-zinc-800 text-white placeholder-zinc-400 border-zinc-700"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded border border-orange-400 hover:bg-orange-600 transition"
                disabled={loading}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 