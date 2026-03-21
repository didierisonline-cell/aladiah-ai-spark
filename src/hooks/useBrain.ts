import { useState, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export type AgentKey = "professor" | "career" | "interview" | "resume" | "scrum";

export interface Message {
  role: "user" | "assistant";
  content: string;
  agent?: string;
}

export interface BrainAnalytics {
  engagementScore: number;
  topicTag: string;
  suggestedFollowUp: string | null;
  curriculumNote: string | null;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export function useBrain(defaultAgent: AgentKey = "professor", professorId: string = "james") {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<AgentKey>(defaultAgent);

  const send = useCallback(
    async (userMessage: string) => {
      setLoading(true);
      setError(null);
      const userMsg: Message = { role: "user", content: userMessage };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      try {
        const res = await fetch(`${API_URL}/ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            agentKey: activeAgent,
            professorId,
            language,
            history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.response, agent: data.agent }]);
        return data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Brain connection failed";
        setError(msg);
        return null;
      } finally {
        setLoading(false
