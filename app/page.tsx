"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bike, ShieldAlert, Cpu, User, Bot, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "🚨 " + (error.message || "Interferencias en la red temporalmente... Por favor, comprueba tu conexión e inténtalo de nuevo.") 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Sidebar: Mission Control */}
      <aside className="hidden lg:flex w-80 bg-slate-900 dark:bg-black text-slate-300 flex-col border-r border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Misión Torrelavega</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight leading-tight">Bici-IA <span className="font-light opacity-50 text-sm italic">v4.2</span></h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Ingeniero Jefe de Movilidad Sostenible</p>
        </div>

        <div className="flex-1 p-5 space-y-6 overflow-y-auto chat-scroll">
          {/* Team Section */}
          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Equipo de Ingeniería</h3>
            <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
              <p className="text-sm text-slate-200 font-medium">5º de Primaria - Grupo A</p>
              <div className="flex gap-1 mt-2">
                {["E1", "E2", "E3"].map((id) => (
                  <div key={id} className={cn(
                    "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold",
                    id === "E3" ? "bg-emerald-600 text-white" : "bg-slate-700"
                  )}>{id}</div>
                ))}
                <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold">+2</div>
              </div>
            </div>
          </section>

          {/* Technical Parameters */}
          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Parámetros Técnicos</h3>
            <div className="space-y-2 border-t border-slate-800 pt-2">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-xs">Escala Cuadrícula</span>
                <span className="text-xs font-mono text-emerald-400">15x15 cm</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-xs">Hardware Robot</span>
                <span className="text-xs font-mono text-emerald-400">Tale-Bot Pro</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-xs">Interface</span>
                <span className="text-xs font-mono text-emerald-400">Makey Makey</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs">Logic Script</span>
                <span className="text-xs font-mono text-emerald-400 underline decoration-slate-600">Scratch Core</span>
              </div>
            </div>
          </section>

          {/* City Map Simulator Placeholder */}
          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Visualizador Torrelavega</h3>
            <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700 grid grid-cols-5 grid-rows-5 shadow-inner">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={cn(
                  "border-[0.5px] border-slate-700/50",
                  [6, 7, 12, 17].includes(i) && "bg-emerald-500/20",
                  [7, 12].includes(i) && "bg-emerald-500/40",
                  [15].includes(i) && "bg-red-500/20"
                )}></div>
              ))}
            </div>
            <p className="text-[9px] text-center mt-2 text-slate-500 italic">Área: Cruce C/ Julián Ceballos</p>
          </section>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold tracking-tighter">SERVER STATUS</span>
            <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_emerald]"></div>
              SECURE EDGE
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content: Chat Interface */}
      <main className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 shadow-inner relative">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Bike className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Auditoría de Seguridad Vial #001</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Torrelavega Simulation Layer</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="hidden sm:block px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-tight">Cuaderno de Campo</button>
            <button className="px-3 py-1.5 text-[10px] font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-all shadow-sm uppercase tracking-wider active:scale-95">Finalizar Auditoría</button>
          </div>
        </header>

        {/* Chat Stream */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 chat-scroll scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] bg-fixed"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-lg mx-auto py-12">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-slate-900 dark:bg-emerald-900/20 rounded-full flex items-center justify-center border-2 border-emerald-500 shadow-xl"
              >
                <span className="text-emerald-500 font-bold text-lg">B-IA</span>
              </motion.div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">¡Bienvenidos al Centro de Mando!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Soy <span className="font-bold text-emerald-600">Bici-IA</span>. Antes de programar el Tale-Bot Pro, necesitamos asegurar que las calles de Torrelavega sean seguras para el carril bici.
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-4 font-medium italic">
                  ¿Qué punto específico de la ciudad habéis elegido para vuestra investigación hoy?
                </p>
              </div>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex w-full gap-4 max-w-4xl mx-auto",
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-2",
                  m.role === "user" 
                    ? "bg-emerald-600 text-white font-bold text-xs border-emerald-500" 
                    : "bg-slate-900 border-emerald-500"
                )}>
                  {m.role === "user" ? (
                    <span className="text-[10px]">EQA</span>
                  ) : (
                    <span className="text-emerald-500 font-bold text-[10px]">B-IA</span>
                  )}
                </div>

                {/* Bubble */}
                <div className={cn(
                  "p-4 rounded-2xl shadow-sm border text-sm leading-relaxed relative",
                  m.role === "user" 
                    ? "bg-emerald-600 text-white border-emerald-500 rounded-tr-none" 
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 rounded-tl-none"
                )}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 max-w-4xl mx-auto"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center">
                 <div className="flex gap-1">
                   <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center italic">Bici-IA está analizando el plano urbano...</div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <footer className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.02)] z-10 shrink-0">
          <div className="max-w-4xl mx-auto flex gap-4">
            <form 
              onSubmit={handleSubmit}
              className="flex-1 relative bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-inner focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all overflow-hidden"
            >
              <input
                className="w-full h-12 pl-5 pr-12 bg-transparent text-sm focus:outline-none dark:text-white"
                placeholder="Escribe tu informe técnico aquí, Ingeniero/a..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none select-none">
                 <span className="text-[10px] text-slate-400 font-mono font-bold">GEMMA-v4</span>
              </div>
            </form>
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 bg-slate-900 text-emerald-500 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg active:scale-90 disabled:opacity-50 disabled:grayscale"
            >
              <Send className="w-5 h-5 translate-x-0.5 -translate-y-0.5" />
            </button>
          </div>
          <div className="mt-3 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold tracking-tight">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_4px_emerald]"></span>
              API KEY SECURE ENCRYPTION
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold tracking-tight">
              <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
              MODEL: gemma-4-26b-a4b-it
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
