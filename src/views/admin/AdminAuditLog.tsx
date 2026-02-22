"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { escapeIlike } from "@/lib/escapeIlike";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  detail: string | null;
  user_id: string | null;
  created_at: string;
}

const PAGE_SIZE = 25;

const AdminAuditLog = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("audit_log").select("*", { count: "exact" });
    if (actionFilter) query = query.ilike("action", `%${escapeIlike(actionFilter)}%`);
    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo) query = query.lte("created_at", `${dateTo}T23:59:59`);
    const { data, count } = await query.order("created_at", { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    setLogs(data || []);
    setTotal(count || 0);
    setLoading(false);
  }, [page, actionFilter, dateFrom, dateTo]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-[-0.02em] text-foreground mb-2">İşlem Kaydı</h1>
      <p className="text-sm text-muted-foreground mb-6">Bu sayfa tüm admin işlemlerinin kronolojik kaydını gösterir.</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="text" value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(0); }} placeholder="İşlem ara..."
          className="h-10 text-sm px-4 border-0 rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-foreground/10 w-48" />
        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(0); }}
            className="h-10 text-sm px-3 border-0 rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-foreground/10" />
          <span className="text-xs text-muted-foreground">—</span>
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(0); }}
            className="h-10 text-sm px-3 border-0 rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-foreground/10" />
        </div>
        <span className="text-xs text-muted-foreground self-center">{total} kayıt</span>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Yükleniyor...</p> : logs.length === 0 ? (
        <div className="bg-card border border-border/30 rounded-2xl px-6 py-10 text-center text-sm text-muted-foreground">
          {actionFilter || dateFrom || dateTo ? "Filtreyle eşleşen kayıt bulunamadı." : "Henüz işlem kaydı bulunmamaktadır."}
        </div>
      ) : (
        <>
          <div className="bg-card border border-border/30 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border/50 bg-muted/50">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Tarih</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">İşlem</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Detay</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Kullanıcı</th>
              </tr></thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-border/30 last:border-b-0 hover:bg-accent/50 transition-colors">
                    <td className="px-5 py-3.5 text-muted-foreground text-xs font-mono whitespace-nowrap">{formatDate(l.created_at)}</td>
                    <td className="px-5 py-3.5 text-foreground font-medium">{l.action}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{l.detail || "–"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono text-[10px]">{l.user_id?.slice(0, 8) || "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="w-9 h-9 rounded-xl bg-card border border-border/30 flex items-center justify-center disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="w-9 h-9 rounded-xl bg-card border border-border/30 flex items-center justify-center disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminAuditLog;
