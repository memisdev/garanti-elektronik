"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { timeAgo } from "@/lib/timeAgo";
import { Mail, MailOpen, Trash2 } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast({ title: "Hata", description: "Mesajlar yüklenemedi." }); }
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (msg: Message) => {
    const { error } = await supabase.from("contact_messages").update({ is_read: !msg.is_read }).eq("id", msg.id);
    if (error) { toast({ title: "Hata", description: "İşlem başarısız.", variant: "destructive" }); return; }
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: !m.is_read } : m));
    toast({ title: msg.is_read ? "Okunmadı olarak işaretlendi" : "Okundu olarak işaretlendi" });
  };

  const deleteMsg = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) { toast({ title: "Hata", description: "Mesaj silinemedi.", variant: "destructive" }); return; }
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast({ title: "Mesaj silindi" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground mb-2">Mesajlar</h1>
      <p className="text-sm text-muted-foreground mb-8">İletişim formundan gelen tüm mesajları burada görebilir ve yönetebilirsiniz.</p>

      {loading ? (
        <p className="text-sm text-muted-foreground">Yükleniyor...</p>
      ) : messages.length === 0 ? (
        <div className="bg-card border border-border/30 rounded-2xl px-6 py-10 text-center text-sm text-muted-foreground">
          Henüz mesaj bulunmamaktadır.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`bg-card border rounded-2xl p-5 ${msg.is_read ? "border-border/30" : "border-accent-orange/50 bg-accent-orange/5"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-accent-orange shrink-0" />}
                    <span className="text-sm font-semibold text-foreground">{msg.name}</span>
                    <span className="text-xs text-muted-foreground">({msg.email})</span>
                  </div>
                  <p className="text-sm text-foreground/80 mt-2">{msg.message}</p>
                  <span className="text-[11px] text-muted-foreground mt-2 block">{timeAgo(msg.created_at)}</span>

                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggleRead(msg)} className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center hover:bg-accent transition-colors" title={msg.is_read ? "Okunmadı işaretle" : "Okundu işaretle"}>
                    {msg.is_read ? <Mail className="w-4 h-4 text-muted-foreground" /> : <MailOpen className="w-4 h-4 text-accent-orange" />}
                  </button>
                  <button onClick={() => deleteMsg(msg.id)} className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center hover:bg-destructive/10 transition-colors" title="Sil">
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
