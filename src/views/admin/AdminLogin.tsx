"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Lütfen tüm alanları doldurun.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Giriş başarısız",
          description: data.error ?? "Bir hata oluştu.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({ title: "Hoş geldiniz!" });
      router.push("/admin/dashboard");
    } catch {
      toast({
        title: "Bağlantı hatası",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="inline-flex w-14 h-14 bg-foreground rounded-2xl items-center justify-center text-background font-bold text-lg mb-5">GE</span>
          <h1 className="text-xl font-bold text-foreground">Yönetim Paneli</h1>
          <p className="text-sm text-muted-foreground mt-1">Garanti Elektronik</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card shadow-xl rounded-3xl p-8 space-y-5 border border-border/30">
          <div>
            <label htmlFor="admin-email" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">E-posta</label>
            <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}
              className="w-full h-12 text-sm px-4 border-0 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200 disabled:opacity-50" placeholder="admin@garanti.com" />
          </div>
          <div>
            <label htmlFor="admin-password" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-3">Şifre</label>
            <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}
              className="w-full h-12 text-sm px-4 border-0 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all duration-200 disabled:opacity-50" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-foreground hover:bg-primary-hover text-background font-semibold h-12 rounded-full transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Giriş yapılıyor...</> : "Giriş Yap"}
          </button>
        </form>
        <p className="text-[11px] text-muted-foreground text-center mt-8">Garanti Elektronik Yönetim Paneli</p>
      </div>
    </div>
  );
};

export default AdminLogin;
