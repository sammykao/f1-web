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
    domain: "Scientific Research",
    site: "https://www.apa.org/",
    description: "The APA is the leading scientific and professional organization representing psychology in the United States. APA offers evidence-based articles backed by peer-reviewed research. It also sets ethical and professional standards in the field of psychology."
  },
  {
    domain: "Scientific Research",
    site: "https://www.psychiatry.org/",
    description: "As the national professional organization for psychiatrists, this association provides resources on the diagnosis and medical treatment of mental illness. Their content is grounded in DSM guidelines and current research."
  },
  {
    domain: "Scientific Research",
    site: "https://www.nimh.nih.gov/",
    description: "NIMH is the lead federal agency for research on mental disorders. Their resources are based on scientific evidence and continuously updated to reflect advancements in neuroscience, treatment, and public policy."
  },
  {
    domain: "Education",
    site: "https://www.nami.org/",
    description: "NAMI is a grassroots mental health organization focused on advocacy, education, and support. Their peer-led programs combine lived experiences with clinical guidance, making mental health literacy more accessible."
  },
  {
    domain: "Education",
    site: "https://www.fountainhouse.org/about",
    description: "Fountain House pioneered the 'clubhouse' model for psychosocial rehabilitation. They offer supportive housing, employment programs, and peer-led initiatives based on a globally recognized, evidence-based model."
  },
  {
    domain: "Education",
    site: "https://www.helpguide.org/",
    description: "HelpGuide is a nonprofit mental health resource offering easy-to-understand self-help content on topics such as emotional intelligence, trauma, grief, and relationships. Their guides are developed with licensed professionals."
  },
  {
    domain: "Youth Mental Health",
    site: "https://jedfoundation.org/",
    description: "The JED Foundation focuses on emotional health and suicide prevention for teens and young adults. They work with schools to implement mental health programs, toolkits, and awareness campaigns backed by clinical expertise."
  },
  {
    domain: "Youth Mental Health",
    site: "https://childmind.org/",
    description: "Child Mind Institute supports children and families struggling with mental health and learning disorders. Their evidence-based resources are created by clinicians and tailored for parents and educators."
  },
  {
    domain: "Community Mental Health",
    site: "https://www.samhsa.gov/",
    description: "SAMHSA is the U.S. government's agency for behavioral health. They lead national efforts like the 988 hotline, trauma-informed care programs, and community prevention, rooted in public health research."
  }
];

const SPECIFIC_RESOURCES = [
  {
    domain: "Eating Disorders & Treatment Access",
    site: "https://www.theprojectheal.org",
    description: "Provides equitable access to eating disorder treatment for underserved communities by removing barriers such as insurance difficulties, financial strain, and provider bias. Founded by individuals with lived experience."
  },
  {
    domain: "Suicide Prevention",
    site: "https://afsp.org",
    description: "AFSP funds suicide prevention research, advocates for mental health policy, and supports survivors. Their evidence-based programs and annual statistics aim to reduce stigma and promote awareness nationwide."
  },
  {
    domain: "Women's Depression",
    site: "https://strongminds.org",
    description: "StrongMinds offers group talk therapy for women in sub-Saharan Africa suffering from untreated depression. Their low-cost, scalable model is WHO-endorsed and community-based."
  },
  {
    domain: "Addiction & Substance Use",
    site: "https://www.shatterproof.org/",
    description: "A nonprofit focused on reversing the addiction crisis, especially opioids, by improving treatment systems, advocating policy change, and rating providers via the ATLAS platform. Founded by a grieving father."
  },
  {
    domain: "LGBTQ+ Youth Mental Health",
    site: "https://www.thetrevorproject.org/public-education",
    description: "The Trevor Project offers 24/7 suicide prevention and crisis services for LGBTQ+ youth under 25. Their work is nationally recognized and supported by research, policy, and education partnerships."
  },
  {
    domain: "Child & Family Mental Health",
    site: "https://www.ffcmh.org",
    description: "The FFCMH advocates for children with mental health and substance use challenges. They offer peer support and family-driven models in collaboration with SAMHSA and community organizations."
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
            Mental Health Resources
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