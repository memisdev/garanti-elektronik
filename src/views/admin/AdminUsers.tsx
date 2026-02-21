"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "editor";
  email?: string;
}

interface ListUserItem {
  user_id: string;
  role: string;
  email: string;
}

const roleBadge = (role: string) => {
  const cls = role === "admin" ? "bg-accent-orange text-white" : "bg-surface text-foreground";
  return <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${cls}`}>{role}</span>;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserRole | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", role: "editor" as "admin" | "editor" });

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/list-users");
      if (res.ok) {
        const list: ListUserItem[] = await res.json();
        const { data: rolesData } = await supabase.from("user_roles").select("*");
        const emailMap = new Map<string, string>();
        list.forEach((u) => emailMap.set(u.user_id, u.email));
        setUsers((rolesData || []).map((r) => ({ ...r, email: emailMap.get(r.user_id) || "" })));
      } else {
        const { data } = await supabase.from("user_roles").select("*");
        setUsers(data || []);
      }
    } catch {
      const { data } = await supabase.from("user_roles").select("*");
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleInvite = async () => {
    if (!form.email.trim()) { toast({ title: "E-posta zorunludur.", variant: "destructive" }); return; }
    setSaving(true);

    try {
      const res = await fetch("/api/admin/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, role: form.role, password: form.password || undefined }),
      });
      const data = await res.json();

      setSaving(false);
      if (!res.ok || data?.error) {
        toast({ title: "Hata", description: data?.error || "Bilinmeyen hata", variant: "destructive" });
        return;
      }
    } catch {
      setSaving(false);
      toast({ title: "Hata", description: "Bilinmeyen hata", variant: "destructive" });
      return;
    }

    toast({ title: "Kullanıcı başarıyla davet edildi" });
    setDialogOpen(false);
    setForm({ email: "", password: "", role: "editor" });
    fetchUsers();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", deleteTarget.id);
    if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Kullanıcı rolü kaldırıldı" });
    setDeleteTarget(null);
    fetchUsers();
  };

  const changeRole = async (userRole: UserRole, newRole: "admin" | "editor") => {
    const { error } = await supabase.from("user_roles").update({ role: newRole }).eq("id", userRole.id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Rol güncellendi" });
    fetchUsers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground">Kullanıcılar</h1>
        <button onClick={() => { setForm({ email: "", password: "", role: "editor" }); setDialogOpen(true); }}
          className="flex items-center gap-2 bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-5 h-11 rounded-full transition-all duration-200">
          <Plus className="w-4 h-4" /> Kullanıcı Davet Et
        </button>
      </div>
      <div className="flex items-start gap-2 mb-8">
        <p className="text-sm text-muted-foreground">Admin paneline erişim yetkisi olan kullanıcıları buradan yönetebilirsiniz.</p>
        <Tooltip>
          <TooltipTrigger><Info className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" /></TooltipTrigger>
          <TooltipContent><p className="text-xs max-w-[250px]"><strong>Admin:</strong> Tüm yetkilere sahiptir. <strong>Editör:</strong> Ürün ve içerik düzenleyebilir, kullanıcı ve ayarları değiştiremez.</p></TooltipContent>
        </Tooltip>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Yükleniyor...</p> : users.length === 0 ? (
        <div className="bg-card border border-border/30 rounded-2xl px-6 py-10 text-center text-sm text-muted-foreground">
          Henüz kullanıcı bulunmamaktadır.
        </div>
      ) : (
        <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/50 bg-muted/50">
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">E-posta</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Rol</th>
              <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">İşlem</th>
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/30 last:border-b-0 hover:bg-accent/50 transition-colors">
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{u.email || <span className="font-mono text-muted-foreground/50">{u.user_id.slice(0, 8)}…</span>}</td>
                  <td className="px-5 py-3.5">
                    <select value={u.role} onChange={(e) => changeRole(u, e.target.value as "admin" | "editor")}
                      className="text-[11px] font-medium px-3 py-1.5 rounded-full border-0 bg-surface focus:outline-none cursor-pointer">
                      <option value="admin">admin</option>
                      <option value="editor">editor</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => setDeleteTarget(u)} className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-colors ml-auto">
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Kullanıcı Davet Et</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">E-posta *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10" placeholder="kullanici@garanti.com" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Şifre (opsiyonel)</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10" placeholder="Boş bırakılırsa davet e-postası gönderilir" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em] block mb-2">Rol</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "editor" })}
                className="w-full h-11 text-sm px-4 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-foreground/10">
                <option value="editor">Editör</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-[11px] text-muted-foreground mt-1">Admin: Tüm yetkilere sahip. Editör: Ürün ve içerik düzenleyebilir.</p>
            </div>
          </div>
          <DialogFooter>
            <button onClick={handleInvite} disabled={saving} className="bg-foreground hover:bg-primary-hover text-background text-[13px] font-semibold px-6 h-10 rounded-full transition-all duration-200 flex items-center gap-2 disabled:opacity-70">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Davet Et
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcı Rolünü Kaldır</AlertDialogTitle>
            <AlertDialogDescription>Bu kullanıcının admin paneli erişimini kaldırmak istediğinize emin misiniz?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Kaldır</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
