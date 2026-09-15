import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { ProjectRecord } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citedProjects?: any[];
  sources?: any[];
}

interface Props {
  contextProjectId?: string;
  projects: ProjectRecord[];
  onSelectProject: (projectId: string) => void;
}

export const CopilotView: React.FC<Props> = ({ contextProjectId, projects, onSelectProject }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello, Officer. I am the InfraShield AI Copilot. I can query our live database, assess project risk trajectories, and recommend interventions based on official MoRTH and PARIVESH data. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contextProject = contextProjectId ? projects.find(p => p.project_id === contextProjectId) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const query = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, projectId: contextProjectId })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        citedProjects: data.citedProjects,
        sources: data.sources
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered an error querying the database. Please check my connection settings.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">AI Officer Copilot</h2>
            <p className="text-xs text-slate-500 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Grounded in Official Data</span>
            </p>
          </div>
        </div>
        {contextProject && (
          <div className="hidden md:flex flex-col items-end text-xs">
            <span className="text-slate-400">Current Context</span>
            <span className="font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">{contextProject.project_id}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''} space-x-3`}>
              <div className="shrink-0">
                {msg.role === 'user' ? (
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
                    <User className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 shadow-sm text-slate-800 rounded-tl-none'
                }`}>
                  <div className="prose prose-sm prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: (msg.content || '').replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
                
                {msg.role === 'assistant' && msg.citedProjects && msg.citedProjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.citedProjects.map((p, idx) => (
                      <button 
                        key={idx}
                        onClick={() => onSelectProject(p.id)}
                        className="flex items-center space-x-1.5 text-[11px] font-medium bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:border-emerald-400 hover:text-emerald-700 transition-colors shadow-2xs"
                      >
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Inspect {p.id}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
                
                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1 pt-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Sources: {msg.sources.map(s => s.dataset).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2 text-slate-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing infrastructure data...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about project delays, clearance statuses, or request a summary..."
            className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none overflow-hidden"
            rows={1}
            style={{ minHeight: '44px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Copilot responses are generated based on available database records. Always review official documents.
        </p>
      </div>
    </div>
  );
};

// Simple Building2 icon since we didn't import it in the file
function Building2(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>;
}
