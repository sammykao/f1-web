"use client";
import React, { useState, useEffect, useRef } from "react";
import { Navigation } from "../components/nav";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
}

const RESEARCH_PORT = 8000;
const RESOURCES_PORT = 10000;

// Resource lists for each section
const RESEARCH_RESOURCES = [
  {
    domain: "Eating Disorders & Treatment Access",
    site: "https://www.theprojectheal.org",
    description: "Provides equitable access to eating disorder treatment for underserved communities. They help to remove barriers such as insurance difficultys, financial strain, and provider bias. They are a national treatment acess program founded by indiviudals with lived experiences."
  },
  {
    domain: "suicide prevention",
    site: "https://afsp.org",
    description: "Funds suicide prevention research, offers education programs, advocates for mental health policies, and supports survivors of suicide loss. Provides evidence-based strategies to reduce risk and stigma surrounding suicice. They are backed by scienfitif research with chapters in every state and publishes annual suicide statistics to raise awareness on the subject."
  },
  {
    domain: "Women's depression",
    site: "https://strongminds.org",
    description: "Provides mental health treatment for women in sub-Saharan Africa using group talk therapy for depression. This is espeically important because they target untreated depression in communities where mental health services are scarce, improving both psychological and economic well-being. They use proven, low-cost, scalable therapy model that are recognized by WHO and global health networks."
  },
  {
    domain: "Addition & Substance Use",
    site: "https://www.shatterproof.org/",
    description: "A national nonprofit dedicated to finding protective factors against the addiction crisis, especially opioids, in the U.S by improving addiction treatment and advocay for policy changes. They offer resources for families, builds evidence-based treatment systems, and leads the ATLAS platform, which rates addiction treatment centers. They collaborate with state governments, health insurers, and policymakers. It was founded by a father who lost his son to addiction, which drives their mission."
  },
  {
    domain: "LGBTQ+ Youth Mental Health",
    site: "https://www.thetrevorproject.org/public-education",
    description: "Provides crisis intervention and suicide prevention services to LGBTQ+ youth under 25. LGBTQ+ youth face disproportionately high rates of mental health struggles and suicide. Trevor Project offers 24/7 support via text, chat, and phone. They are the nation's leading LGBTQ+ crisis intervention organization and frequently cited in national research. They have strong collaborations with with educational and policy institutions."
  },
  {
    domain: "Child & Family Mental Health",
    site: "https://www.ffcmh.org",
    description: "Family-run national organization that advocates for families with children facing mental health and substance use challenges. They specifically target children;s mental health and family support drawing on community-based systems of health. They partner with SAMHSA and offer certified family peer support models."
  }
];

const SPECIFIC_RESOURCES = [
  {
    domain: "Eating Disorders & Treatment Access",
    site: "https://www.theprojectheal.org",
    description: "Provides equitable access to eating disorder treatment for underserved communities. They help to remove barriers such as insurance difficultys, financial strain, and provider bias. They are a national treatment acess program founded by indiviudals with lived experiences."
  },
  {
    domain: "suicide prevention",
    site: "https://afsp.org",
    description: "Funds suicide prevention research, offers education programs, advocates for mental health policies, and supports survivors of suicide loss. Provides evidence-based strategies to reduce risk and stigma surrounding suicice. They are backed by scienfitif research with chapters in every state and publishes annual suicide statistics to raise awareness on the subject."
  },
  {
    domain: "Women's depression",
    site: "https://strongminds.org",
    description: "Provides mental health treatment for women in sub-Saharan Africa using group talk therapy for depression. This is espeically important because they target untreated depression in communities where mental health services are scarce, improving both psychological and economic well-being. They use proven, low-cost, scalable therapy model that are recognized by WHO and global health networks."
  },
  {
    domain: "Addition & Substance Use",
    site: "https://www.shatterproof.org/",
    description: "A national nonprofit dedicated to finding protective factors against the addiction crisis, especially opioids, in the U.S by improving addiction treatment and advocay for policy changes. They offer resources for families, builds evidence-based treatment systems, and leads the ATLAS platform, which rates addiction treatment centers. They collaborate with state governments, health insurers, and policymakers. It was founded by a father who lost his son to addiction, which drives their mission."
  },
  {
    domain: "LGBTQ+ Youth Mental Health",
    site: "https://www.thetrevorproject.org/public-education",
    description: "Provides crisis intervention and suicide prevention services to LGBTQ+ youth under 25. LGBTQ+ youth face disproportionately high rates of mental health struggles and suicide. Trevor Project offers 24/7 support via text, chat, and phone. They are the nation's leading LGBTQ+ crisis intervention organization and frequently cited in national research. They have strong collaborations with with educational and policy institutions."
  },
  {
    domain: "Child & Family Mental Health",
    site: "https://www.ffcmh.org",
    description: "Family-run national organization that advocates for families with children facing mental health and substance use challenges. They specifically target children;s mental health and family support drawing on community-based systems of health. They partner with SAMHSA and offer certified family peer support models."
  }
];

export default function PsychologyPage() {
  const [activeTab, setActiveTab] = useState<"research" | "resources">("research");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessions, setSessions] = useState<{
    research: ChatSession | null;
    resources: ChatSession | null;
  }>({
    research: null,
    resources: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions]);



  const getCurrentPort = () => {
    return activeTab === "research" ? RESEARCH_PORT : RESOURCES_PORT;
  };

  const getCurrentSession = () => {
    return sessions[activeTab];
  };

  const addMessage = (role: "user" | "ai", text: string) => {
    const newMessage: ChatMessage = {
      role,
      text,
      timestamp: new Date(),
    };

    setSessions(prev => ({
      ...prev,
      [activeTab]: {
        sessionId: prev[activeTab]?.sessionId || Date.now().toString(),
        messages: [...(prev[activeTab]?.messages || []), newMessage],
      },
    }));
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput("");
    setError("");
    setLoading(true);

    // Add user message to chat
    addMessage("user", message);

    try {
      const port = getCurrentPort();
      const response = await fetch(`/api/psychology/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          port,
          resetMemory: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Add AI response to chat
      addMessage("ai", data.response || "No response received");

    } catch (error) {
      console.error("Chat error:", error);
      setError(`Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`);
      addMessage("ai", "Sorry, I encountered an error. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const currentSession = getCurrentSession();

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navigation />
      <div className="container mx-auto pt-32 pb-12 px-4 max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8 text-center text-zinc-100 drop-shadow-lg tracking-tight">
          Psychology AI Chat
        </h1>
        
        {/* Tab Toggle */}
        <div className="flex justify-center mb-8 gap-2">
          <button
            className={`px-6 py-2 rounded-lg font-semibold focus:outline-none transition-all duration-200 text-lg 
              ${activeTab === "research" ? "bg-zinc-800 text-blue-400 shadow-md" : "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-blue-300"}`}
            onClick={() => setActiveTab("research")}
          >
            Research
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold focus:outline-none transition-all duration-200 text-lg 
              ${activeTab === "resources" ? "bg-zinc-800 text-blue-400 shadow-md" : "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-blue-300"}`}
            onClick={() => setActiveTab("resources")}
          >
            Specific Resources
          </button>
        </div>



        {/* Chat Container */}
        <div className="bg-zinc-900 rounded-lg shadow-lg border border-zinc-700 flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!currentSession && (
              <div className="text-center text-zinc-500 py-8">
                <p className="text-lg mb-2">
                  {activeTab === "research" 
                    ? "Ask me about psychology research, studies, and academic topics."
                    : "Ask me about specific mental health resources, treatments, and practical information."
                  }
                </p>
                <p className="text-sm">Start a conversation by typing a message below.</p>
              </div>
            )}
            
            {currentSession?.messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-200 border border-zinc-700"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  <div className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 text-zinc-200 px-4 py-2 rounded-lg border border-zinc-700">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full"></div>
                    Thinking...
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-900 text-red-200 px-4 py-2 rounded-lg border border-red-700">
                  {error}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-zinc-700 p-4">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  activeTab === "research" 
                    ? "Ask about psychology research..."
                    : "Ask about mental health resources..."
                }
                disabled={loading}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Resource List */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-zinc-200 mb-3">
            Available Resources ({activeTab === "research" ? "Research" : "Specific"}):
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeTab === "research" ? RESEARCH_RESOURCES : SPECIFIC_RESOURCES).map((resource, index) => (
              <div key={index} className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">{resource.domain}</h4>
                <a 
                  href={resource.site} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 text-sm mb-2 block"
                >
                  {resource.site}
                </a>
                <p className="text-zinc-300 text-sm leading-relaxed">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 