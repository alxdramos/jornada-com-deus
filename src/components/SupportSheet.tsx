"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Send, Plus, ChevronLeft, Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Tipos locais (sem importar de lib/admin/types — esses são para admin server side)
interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  last_message?: string | null;
}

interface TicketMsg {
  id: string;
  ticket_id: string;
  sender_type: "user" | "admin";
  message: string;
  created_at: string;
}

const CATEGORIES = [
  { value: "pagamento",  label: "💳 Problema com pagamento" },
  { value: "acesso",     label: "🔒 Problema de acesso" },
  { value: "tecnico",    label: "🔧 Problema técnico" },
  { value: "feedback",   label: "💬 Feedback / Sugestão" },
  { value: "outro",      label: "📝 Outro assunto" },
] as const;

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; icon: typeof CheckCircle; cls: string }> = {
    aberto:     { label: "Aberto",     icon: AlertCircle, cls: "text-red-500" },
    aguardando: { label: "Aguardando", icon: Clock,        cls: "text-amber-500" },
    resolvido:  { label: "Resolvido",  icon: CheckCircle,  cls: "text-emerald-500" },
    fechado:    { label: "Fechado",    icon: X,            cls: "text-gray-400" },
  };
  const c = config[status] ?? config.aberto;
  const Icon = c.icon;
  return (
    <span className={cn("flex items-center gap-1 text-xs font-medium", c.cls)}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

interface SupportSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportSheet({ isOpen, onClose }: SupportSheetProps) {
  // view: 'list' | 'new' | 'detail'
  const [view, setView] = useState<"list" | "new" | "detail">("list");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMsg[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Novo ticket form
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState<string>("outro");
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Carregar tickets ao abrir
  useEffect(() => {
    if (isOpen && view === "list") {
      loadTickets();
    }
  }, [isOpen, view]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setView("list");
      setSelectedTicket(null);
      setMessages([]);
      setReply("");
      setSubmitSuccess(false);
    }
  }, [isOpen]);

  async function loadTickets() {
    setLoadingTickets(true);
    try {
      const res = await fetch("/api/support/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets ?? []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTickets(false);
    }
  }

  async function openTicket(ticket: Ticket) {
    setSelectedTicket(ticket);
    setView("detail");
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function sendReply() {
    if (!reply.trim() || !selectedTicket) return;
    setSending(true);
    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setReply("");
        // Atualizar ticket localmente
        setTickets((prev) =>
          prev.map((t) =>
            t.id === selectedTicket.id
              ? { ...t, status: "aberto", updated_at: new Date().toISOString() }
              : t
          )
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  }

  async function submitNewTicket() {
    if (!newSubject.trim() || !newMessage.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newSubject.trim(),
          category: newCategory,
          message: newMessage.trim(),
        }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setNewSubject("");
        setNewCategory("outro");
        setNewMessage("");
        // Recarregar lista após 1.5s
        setTimeout(() => {
          setSubmitSuccess(false);
          setView("list");
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[9998] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet — slide from bottom */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed inset-x-0 bottom-0 z-[9999] bg-background rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-[#E5E7EB] rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-[#E5E7EB]/80 shrink-0">
              {view !== "list" && (
                <button
                  onClick={() => { setView("list"); setSelectedTicket(null); }}
                  className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
                </button>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-[#1F2937] text-base">
                  {view === "list" && "Ajuda & Suporte"}
                  {view === "new" && "Novo Ticket"}
                  {view === "detail" && (selectedTicket?.subject ?? "Ticket")}
                </h3>
                {view === "detail" && selectedTicket && (
                  <StatusBadge status={selectedTicket.status} />
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">

              {/* ── VIEW: LIST ── */}
              {view === "list" && (
                <div className="p-5 space-y-4">
                  {/* CTA Novo Ticket */}
                  <button
                    onClick={() => setView("new")}
                    className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-[#FB923C]/10 to-[#10B981]/10 border border-[#FB923C]/20 rounded-2xl hover:border-[#FB923C]/40 transition-all"
                  >
                    <div className="w-10 h-10 bg-[#FB923C] rounded-xl flex items-center justify-center shrink-0">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-[#1F2937] text-sm">Abrir novo ticket</p>
                      <p className="text-xs text-[#6B7280]">Descreva seu problema e entraremos em contato</p>
                    </div>
                  </button>

                  {/* Lista de tickets */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">
                      Meus tickets
                    </p>
                    {loadingTickets ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-[#FB923C]" />
                      </div>
                    ) : tickets.length === 0 ? (
                      <div className="text-center py-10">
                        <MessageSquare className="w-10 h-10 mx-auto text-[#E5E7EB] mb-3" />
                        <p className="text-sm text-[#9CA3AF]">Você ainda não tem tickets</p>
                        <p className="text-xs text-[#C4C9D4] mt-1">Abra um ticket acima se precisar de ajuda</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {tickets.map((ticket) => (
                          <button
                            key={ticket.id}
                            onClick={() => openTicket(ticket)}
                            className="w-full text-left p-4 bg-[#F9F8F5] hover:bg-[#F3F4F6] rounded-xl transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-[#1F2937] text-sm truncate">{ticket.subject}</p>
                              <StatusBadge status={ticket.status} />
                            </div>
                            {ticket.last_message && (
                              <p className="text-xs text-[#9CA3AF] mt-1 truncate">{ticket.last_message}</p>
                            )}
                            <p className="text-[10px] text-[#C4C9D4] mt-1">
                              {new Date(ticket.updated_at).toLocaleDateString("pt-BR")}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FAQ rápido */}
                  <div className="border-t border-[#E5E7EB]/80 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">
                      Perguntas frequentes
                    </p>
                    {[
                      { q: "Como cancelar minha assinatura?", a: "Acesse sua conta na Hotmart em hotmart.com/product/subscriptions e cancele lá." },
                      { q: "Meu acesso Premium não ativou", a: "Aguarde até 5 minutos após o pagamento. Se persistir, abra um ticket com o comprovante." },
                      { q: "Esqueci minha senha", a: "Na tela de login, clique em 'Esqueci a senha' para redefinir por e-mail." },
                    ].map((faq, i) => (
                      <details key={i} className="mb-2 group">
                        <summary className="text-sm font-medium text-[#1F2937] cursor-pointer py-2 list-none flex items-center gap-2">
                          <span className="text-[#FB923C]">+</span> {faq.q}
                        </summary>
                        <p className="text-xs text-[#6B7280] pb-2 pl-5 leading-relaxed">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* ── VIEW: NEW TICKET ── */}
              {view === "new" && (
                <div className="p-5 space-y-4 pb-8">
                  {submitSuccess ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-[#1F2937]">Ticket criado!</p>
                        <p className="text-sm text-[#6B7280] mt-1">Responderemos em breve.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Categoria
                        </label>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat.value}
                              onClick={() => setNewCategory(cat.value)}
                              className={cn(
                                "text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                                newCategory === cat.value
                                  ? "border-[#FB923C] bg-[#FB923C]/5 text-[#1F2937]"
                                  : "border-[#E5E7EB] text-[#6B7280] hover:border-[#FB923C]/40"
                              )}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Assunto
                        </label>
                        <input
                          type="text"
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          placeholder="Descreva brevemente o problema"
                          className="mt-2 w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FB923C] bg-background"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Descreva o problema
                        </label>
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Forneça o máximo de detalhes possível..."
                          rows={5}
                          className="mt-2 w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FB923C] resize-none bg-background"
                        />
                      </div>

                      <button
                        onClick={submitNewTicket}
                        disabled={!newSubject.trim() || !newMessage.trim() || submitting}
                        className={cn(
                          "w-full py-4 rounded-2xl font-semibold text-base transition-all",
                          "bg-gradient-to-r from-[#FB923C] to-[#f97316] text-white",
                          "hover:opacity-95 active:scale-[0.98]",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        {submitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Enviando...
                          </div>
                        ) : (
                          "Enviar Ticket"
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* ── VIEW: DETAIL ── */}
              {view === "detail" && selectedTicket && (
                <div className="flex flex-col h-full">
                  {/* Info do ticket */}
                  <div className="px-5 py-3 bg-[#F9F8F5] border-b border-[#E5E7EB]/80">
                    <p className="text-xs text-[#9CA3AF]">
                      #{selectedTicket.id.slice(0, 8)} ·{" "}
                      {CATEGORIES.find((c) => c.value === selectedTicket.category)?.label ?? selectedTicket.category} ·{" "}
                      {new Date(selectedTicket.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  {/* Mensagens */}
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    {loadingMessages ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-[#FB923C]" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-[#9CA3AF]">Aguardando resposta da equipe...</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            msg.sender_type === "admin" ? "justify-start" : "justify-end"
                          )}
                        >
                          <div className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                            msg.sender_type === "admin"
                              ? "bg-[#F3F4F6] text-[#1F2937] rounded-tl-sm"
                              : "bg-[#FB923C] text-white rounded-tr-sm"
                          )}>
                            {msg.sender_type === "admin" && (
                              <p className="text-[10px] font-semibold text-[#FB923C] mb-1">Suporte</p>
                            )}
                            <p>{msg.message}</p>
                            <p className={cn(
                              "text-[10px] mt-1",
                              msg.sender_type === "admin" ? "text-[#9CA3AF]" : "text-amber-100"
                            )}>
                              {new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Campo resposta */}
                  {selectedTicket.status !== "fechado" ? (
                    <div className="px-4 py-3 border-t border-[#E5E7EB]/80 flex gap-2 items-end bg-background">
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendReply();
                          }
                        }}
                        placeholder="Responder... (Enter para enviar)"
                        rows={2}
                        className="flex-1 resize-none text-sm border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#FB923C] bg-background text-[#1F2937] placeholder:text-[#9CA3AF]"
                      />
                      <button
                        onClick={sendReply}
                        disabled={!reply.trim() || sending}
                        className="w-10 h-10 bg-[#FB923C] text-white rounded-xl flex items-center justify-center hover:bg-[#f97316] transition-colors disabled:opacity-50 shrink-0"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="px-5 py-3 border-t border-[#E5E7EB]/80 text-center">
                      <p className="text-xs text-[#9CA3AF]">Este ticket foi fechado</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
