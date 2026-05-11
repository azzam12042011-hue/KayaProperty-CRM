import { useState, useEffect, useCallback } from "react";

// ─── STORAGE HELPERS (localStorage — works on any browser/device) ─────────────
const STORAGE_KEYS = { leads: "kaya:leads", properties: "kaya:properties", activities: "kaya:activities" };

function loadData(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const SAMPLE_LEADS = [
  { id: 1, name: "Budi Santoso", phone: "08123456789", source: "TikTok", status: "Hot 🔥", property: "Griya Senggigi T36", budget: "350-400 Juta", notes: "Minta info KPR, gaji 5jt", date: "2025-04-20", followUp: "2025-04-26" },
  { id: 2, name: "Sari Dewi", phone: "08234567890", source: "Instagram", status: "Warm 🌤", property: "Griya Senggigi T45", budget: "400-500 Juta", notes: "Pasangan baru, survey minggu ini", date: "2025-04-19", followUp: "2025-04-25" },
  { id: 3, name: "Ahmad Fauzi", phone: "08345678901", source: "WhatsApp", status: "Cold ❄️", property: "Belum Ditentukan", budget: "300-350 Juta", notes: "Masih lihat-lihat", date: "2025-04-18", followUp: "2025-04-28" },
  { id: 4, name: "Rina Marlina", phone: "08456789012", source: "Facebook", status: "Closing ✅", property: "Griya Senggigi T36", budget: "350 Juta", notes: "Sudah setuju, proses dokumen", date: "2025-04-15", followUp: "2025-04-22" },
  { id: 5, name: "Hendra Wijaya", phone: "08567890123", source: "Referral", status: "Hot 🔥", property: "Griya Senggigi T45", budget: "500+ Juta", notes: "Investor, minta 2 unit", date: "2025-04-21", followUp: "2025-04-24" },
];
const SAMPLE_PROPERTIES = [
  { id: 1, name: "Griya Senggigi Residence", type: "T36/72", price: "350.000.000", dp: "35.000.000", cicilan: "2.100.000", kt: 2, km: 1, location: "Jl. Raya Senggigi, Lombok Barat", stock: 7, sold: 41, status: "Tersedia" },
  { id: 2, name: "Griya Senggigi Residence", type: "T45/90", price: "430.000.000", dp: "43.000.000", cicilan: "2.580.000", kt: 3, km: 2, location: "Jl. Raya Senggigi, Lombok Barat", stock: 4, sold: 20, status: "Tersedia" },
];
const SAMPLE_ACTIVITIES = [
  { id: 1, leadName: "Budi Santoso", type: "Call", note: "Dijelaskan simulasi KPR, minta brosur", date: "2025-04-20" },
  { id: 2, leadName: "Sari Dewi", type: "WhatsApp", note: "Kirim foto lokasi dan harga", date: "2025-04-19" },
  { id: 3, leadName: "Rina Marlina", type: "Survey", note: "Survey langsung ke lokasi, suka dengan unit blok A", date: "2025-04-17" },
];

const STATUS_COLORS = { "Hot 🔥": "#f97316", "Warm 🌤": "#eab308", "Cold ❄️": "#60a5fa", "Closing ✅": "#22c55e" };
const SOURCES = ["TikTok", "Instagram", "Facebook", "YouTube", "WhatsApp", "Referral", "Walk-in", "Lainnya"];
const STATUSES = ["Hot 🔥", "Warm 🌤", "Cold ❄️", "Closing ✅"];
const ACTIVITY_TYPES = ["Call", "WhatsApp", "Survey", "Meeting", "Email", "Follow-up"];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    dashboard: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    leads: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    property: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    script: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    activity: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    plus: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    edit: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    close: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    wa: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
    copy: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
    ai: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    check: <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  };
  return icons[name] || null;
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [leads, setLeads] = useState(SAMPLE_LEADS);
  const [properties, setProperties] = useState(SAMPLE_PROPERTIES);
  const [activities, setActivities] = useState(SAMPLE_ACTIVITIES);
  const [toast, setToast] = useState(null);

  // Persist data
  useEffect(() => { saveData(STORAGE_KEYS.leads, leads); }, [leads]);
  useEffect(() => { saveData(STORAGE_KEYS.properties, properties); }, [properties]);
  useEffect(() => { saveData(STORAGE_KEYS.activities, activities); }, [activities]);

  // Load data (localStorage is synchronous)
  useEffect(() => {
    const l = loadData(STORAGE_KEYS.leads);
    const p = loadData(STORAGE_KEYS.properties);
    const a = loadData(STORAGE_KEYS.activities);
    if (l) setLeads(l); if (p) setProperties(p); if (a) setActivities(a);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.status === "Hot 🔥").length,
    closing: leads.filter(l => l.status === "Closing ✅").length,
    warm: leads.filter(l => l.status === "Warm 🌤").length,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0a0c10", minHeight: "100vh", display: "flex", color: "#e8e4d9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #c9a84c44; border-radius: 2px; }
        input, textarea, select { font-family: inherit; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        @keyframes toastIn { from { opacity:0; transform:translateY(20px) scale(.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .page { animation: fadeIn .35s ease both; }
        .card { animation: slideIn .3s ease both; }
        .nav-item { transition: all .2s; border-left: 3px solid transparent; }
        .nav-item:hover { background: rgba(201,168,76,.08); border-left-color: rgba(201,168,76,.4); }
        .nav-item.active { background: rgba(201,168,76,.12); border-left-color: #c9a84c; color: #c9a84c !important; }
        .btn-gold { background: linear-gradient(135deg, #c9a84c, #e8c96a); color: #0a0c10; font-weight:600; border:none; cursor:pointer; border-radius:8px; transition: all .2s; }
        .btn-gold:hover { transform:translateY(-1px); box-shadow:0 4px 16px rgba(201,168,76,.35); }
        .btn-ghost { background:transparent; border:1px solid rgba(201,168,76,.3); color:#c9a84c; cursor:pointer; border-radius:8px; transition: all .2s; font-weight:500; }
        .btn-ghost:hover { background:rgba(201,168,76,.1); border-color:#c9a84c; }
        .btn-danger { background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.3); color:#ef4444; cursor:pointer; border-radius:8px; transition: all .2s; }
        .btn-danger:hover { background:rgba(239,68,68,.2); }
        .stat-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius:16px; padding:24px; transition: all .3s; }
        .stat-card:hover { border-color: rgba(201,168,76,.3); transform:translateY(-2px); }
        .glass { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius:12px; }
        .input-field { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color:#e8e4d9; padding:10px 14px; border-radius:8px; width:100%; outline:none; transition: border .2s; font-size:14px; }
        .input-field:focus { border-color: rgba(201,168,76,.5); }
        .input-field::placeholder { color: rgba(232,228,217,.35); }
        option { background: #1a1d24; }
        .badge { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
        .tag { padding:2px 8px; border-radius:4px; font-size:11px; font-weight:500; background:rgba(201,168,76,.15); color:#c9a84c; }
        .progress-bar { height:4px; border-radius:2px; background:rgba(255,255,255,.08); overflow:hidden; }
        .progress-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,#c9a84c,#e8c96a); transition:width .6s ease; }
        .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:100; display:flex; align-items:center; justify-content:center; animation:fadeIn .2s ease; }
        .modal { background:#13161e; border:1px solid rgba(201,168,76,.2); border-radius:16px; padding:28px; width:min(560px,94vw); max-height:88vh; overflow-y:auto; }
        .loader { width:18px;height:18px;border:2px solid rgba(255,255,255,.2);border-top-color:#c9a84c;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block; }
        .script-output { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:18px; white-space:pre-wrap; font-size:13.5px; line-height:1.75; color:#d4d0c7; }
        table { width:100%; border-collapse:collapse; }
        th { text-align:left; font-size:11px; font-weight:600; letter-spacing:.06em; color:rgba(201,168,76,.6); text-transform:uppercase; padding:10px 14px; border-bottom:1px solid rgba(255,255,255,.06); }
        td { padding:13px 14px; border-bottom:1px solid rgba(255,255,255,.04); font-size:14px; vertical-align:middle; }
        tr:hover td { background:rgba(201,168,76,.03); }
        .sidebar-logo { font-family:'Playfair Display',serif; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width: 230, background: "#0d1018", borderRight: "1px solid rgba(255,255,255,.06)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
        <div style={{ padding: "28px 20px 20px" }}>
          <div className="sidebar-logo" style={{ fontSize: 18, fontWeight: 700, color: "#c9a84c", lineHeight: 1.2 }}>Kaya Property</div>
          <div style={{ fontSize: 11, color: "rgba(232,228,217,.4)", marginTop: 3, letterSpacing: ".04em" }}>LOMBOK CRM SYSTEM</div>
        </div>
        <div style={{ width: "80%", height: 1, background: "rgba(255,255,255,.06)", margin: "0 auto 16px" }} />
        <nav style={{ flex: 1, padding: "0 10px" }}>
          {[
            { id: "dashboard", label: "Dashboard", icon: "dashboard" },
            { id: "leads", label: "Leads & Prospek", icon: "leads" },
            { id: "properties", label: "Data Properti", icon: "property" },
            { id: "activities", label: "Aktivitas", icon: "activity" },
            { id: "scripts", label: "Script Generator", icon: "script" },
          ].map(nav => (
            <button key={nav.id} className={`nav-item ${page === nav.id ? "active" : ""}`} onClick={() => setPage(nav.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 12px", background: "none", border: "none", color: page === nav.id ? "#c9a84c" : "rgba(232,228,217,.6)", cursor: "pointer", borderRadius: 8, fontSize: 14, fontFamily: "inherit", marginBottom: 2, textAlign: "left" }}>
              <Icon name={nav.icon} size={16} />{nav.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#c9a84c,#e8c96a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0c10", fontWeight: 700, fontSize: 14 }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e4d9" }}>Azzam</div>
              <div style={{ fontSize: 11, color: "rgba(232,228,217,.4)" }}>Agent Properti</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: "auto", padding: "32px 32px 40px" }}>
        {page === "dashboard" && <Dashboard stats={stats} leads={leads} activities={activities} properties={properties} />}
        {page === "leads" && <Leads leads={leads} setLeads={setLeads} showToast={showToast} />}
        {page === "properties" && <Properties properties={properties} setProperties={setProperties} showToast={showToast} />}
        {page === "activities" && <Activities activities={activities} setActivities={setActivities} leads={leads} showToast={showToast} />}
        {page === "scripts" && <Scripts properties={properties} showToast={showToast} />}
      </main>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 200, animation: "toastIn .3s ease" }}>
          <div style={{ background: toast.type === "success" ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)", border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,.4)" : "rgba(239,68,68,.4)"}`, color: toast.type === "success" ? "#4ade80" : "#f87171", padding: "12px 18px", borderRadius: 10, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={16} />{toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ stats, leads, activities, properties }) {
  const hotLeads = leads.filter(l => l.status === "Hot 🔥");
  const todayStr = new Date().toISOString().split("T")[0];
  const followUps = leads.filter(l => l.followUp <= todayStr && l.status !== "Closing ✅");
  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: "#e8e4d9" }}>Selamat Datang, Azzam 👋</h1>
        <p style={{ color: "rgba(232,228,217,.5)", marginTop: 6, fontSize: 14 }}>{new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Leads", value: stats.total, color: "#c9a84c", sub: "Semua prospek" },
          { label: "Hot Leads 🔥", value: stats.hot, color: "#f97316", sub: "Siap closing" },
          { label: "Follow-up Hari Ini", value: followUps.length, color: "#a78bfa", sub: "Perlu dihubungi" },
          { label: "Unit Closing ✅", value: stats.closing, color: "#22c55e", sub: "Berhasil" },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
            <div style={{ fontSize: 12, color: "rgba(232,228,217,.45)", marginBottom: 10, fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontSize: 38, fontWeight: 700, color: s.color, lineHeight: 1, fontFamily: "'Playfair Display',serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "rgba(232,228,217,.35)", marginTop: 8 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* HOT LEADS */}
        <div className="glass" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8e4d9" }}>🔥 Hot Leads Prioritas</h3>
            <span className="tag">{hotLeads.length} leads</span>
          </div>
          {hotLeads.length === 0 && <div style={{ color: "rgba(232,228,217,.35)", fontSize: 13 }}>Belum ada hot leads</div>}
          {hotLeads.map((l, i) => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < hotLeads.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e4d9" }}>{l.name}</div>
                <div style={{ fontSize: 12, color: "rgba(232,228,217,.4)", marginTop: 2 }}>{l.property} • {l.source}</div>
              </div>
              <a href={`https://wa.me/${l.phone}`} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", background:"rgba(37,211,102,.1)", border:"1px solid rgba(37,211,102,.2)", borderRadius:6, color:"#25d366", fontSize:12, textDecoration:"none" }}>
                <Icon name="wa" size={13} /> Chat
              </a>
            </div>
          ))}
        </div>

        {/* PROPERTY STOCK */}
        <div className="glass" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8e4d9", marginBottom: 16 }}>🏠 Stok Unit Properti</h3>
          {properties.map((p, i) => {
            const pct = Math.round((p.sold / (p.sold + p.stock)) * 100);
            return (
              <div key={p.id} style={{ marginBottom: i < properties.length - 1 ? 18 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e4d9" }}>{p.name} — {p.type}</div>
                    <div style={{ fontSize: 11, color: "rgba(232,228,217,.4)", marginTop: 2 }}>Rp {p.price} • {p.stock} unit tersisa</div>
                  </div>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "#c9a84c" }}>{pct}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                <div style={{ fontSize: 11, color: "rgba(232,228,217,.3)", marginTop: 4 }}>{p.sold} terjual dari {p.sold + p.stock} unit</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="glass" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#e8e4d9", marginBottom: 16 }}>📋 Aktivitas Terbaru</h3>
        {activities.slice(0, 4).map((a, i) => (
          <div key={a.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "10px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.05)" : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(201,168,76,.12)", border: "1px solid rgba(201,168,76,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="activity" size={14} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e4d9" }}>{a.type} — {a.leadName}</div>
              <div style={{ fontSize: 12, color: "rgba(232,228,217,.45)", marginTop: 2 }}>{a.note}</div>
              <div style={{ fontSize: 11, color: "rgba(232,228,217,.3)", marginTop: 3 }}>{a.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LEADS ────────────────────────────────────────────────────────────────────
function Leads({ leads, setLeads, showToast }) {
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { name: "", phone: "", source: "TikTok", status: "Warm 🌤", property: "", budget: "", notes: "", date: new Date().toISOString().split("T")[0], followUp: "" };
  const [form, setForm] = useState(blank);

  const filtered = leads.filter(l => {
    const matchStatus = filter === "Semua" || l.status === filter;
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    return matchStatus && matchSearch;
  });

  const openNew = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = (l) => { setEditing(l.id); setForm({ ...l }); setModal(true); };
  const deleteLead = (id) => { setLeads(prev => prev.filter(l => l.id !== id)); showToast("Lead dihapus"); };

  const save = () => {
    if (!form.name || !form.phone) return;
    if (editing) {
      setLeads(prev => prev.map(l => l.id === editing ? { ...form, id: editing } : l));
      showToast("Lead diperbarui ✓");
    } else {
      setLeads(prev => [...prev, { ...form, id: Date.now() }]);
      showToast("Lead baru ditambahkan ✓");
    }
    setModal(false);
  };

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#e8e4d9" }}>Leads & Prospek</h1>
          <p style={{ color: "rgba(232,228,217,.45)", fontSize: 13, marginTop: 4 }}>{leads.length} total prospek terdaftar</p>
        </div>
        <button className="btn-gold" style={{ padding: "10px 20px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }} onClick={openNew}>
          <Icon name="plus" size={16} /> Tambah Lead
        </button>
      </div>

      {/* FILTERS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input className="input-field" placeholder="🔍 Cari nama / nomor..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
        {["Semua", ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 14px", fontSize: 13, borderRadius: 6, border: `1px solid ${filter === s ? "#c9a84c" : "rgba(255,255,255,.1)"}`, background: filter === s ? "rgba(201,168,76,.15)" : "transparent", color: filter === s ? "#c9a84c" : "rgba(232,228,217,.55)", cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>
            {s}
          </button>
        ))}
      </div>

      <div className="glass" style={{ overflow: "auto" }}>
        <table>
          <thead><tr><th>Nama</th><th>No. WA</th><th>Sumber</th><th>Status</th><th>Properti</th><th>Budget</th><th>Follow-up</th><th style={{ textAlign: "center" }}>Aksi</th></tr></thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id}>
                <td>
                  <div style={{ fontWeight: 600, color: "#e8e4d9" }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(232,228,217,.4)", marginTop: 2 }}>{l.notes?.substring(0, 30)}{l.notes?.length > 30 ? "…" : ""}</div>
                </td>
                <td style={{ color: "#c9a84c", fontSize: 13 }}>{l.phone}</td>
                <td><span className="tag">{l.source}</span></td>
                <td><span className="badge" style={{ background: `${STATUS_COLORS[l.status]}20`, color: STATUS_COLORS[l.status], border: `1px solid ${STATUS_COLORS[l.status]}40` }}>{l.status}</span></td>
                <td style={{ fontSize: 13, color: "rgba(232,228,217,.7)" }}>{l.property || "—"}</td>
                <td style={{ fontSize: 13, color: "rgba(232,228,217,.7)" }}>{l.budget || "—"}</td>
                <td style={{ fontSize: 12, color: l.followUp <= new Date().toISOString().split("T")[0] ? "#f97316" : "rgba(232,228,217,.5)" }}>{l.followUp || "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    <a href={`https://wa.me/${l.phone}`} target="_blank" rel="noreferrer" title="Chat WA" style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(37,211,102,.1)", border: "1px solid rgba(37,211,102,.2)", borderRadius: 6, color: "#25d366", cursor: "pointer", textDecoration: "none" }}><Icon name="wa" size={13} /></a>
                    <button title="Edit" onClick={() => openEdit(l)} className="btn-ghost" style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}><Icon name="edit" size={13} /></button>
                    <button title="Hapus" onClick={() => deleteLead(l.id)} className="btn-danger" style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}><Icon name="trash" size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "rgba(232,228,217,.3)", fontSize: 14 }}>Tidak ada lead ditemukan</div>}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#e8e4d9" }}>{editing ? "Edit Lead" : "Tambah Lead Baru"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: "rgba(232,228,217,.5)", cursor: "pointer" }}><Icon name="close" /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["name","Nama Lengkap *"], ["phone","No. WhatsApp *"], ["property","Properti Diminati"], ["budget","Budget"]].map(([k, lbl]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>{lbl}</label>
                  <input className="input-field" value={form[k] || ""} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={lbl} />
                </div>
              ))}
              {[["source","Sumber Lead",SOURCES], ["status","Status",STATUSES]].map(([k, lbl, opts]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>{lbl}</label>
                  <select className="input-field" value={form[k] || ""} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              {[["date","Tanggal Masuk"], ["followUp","Jadwal Follow-up"]].map(([k, lbl]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>{lbl}</label>
                  <input type="date" className="input-field" value={form[k] || ""} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>Catatan</label>
                <textarea className="input-field" rows={3} value={form.notes || ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Catatan singkat tentang prospek..." style={{ resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
              <button className="btn-ghost" style={{ padding: "9px 18px", fontSize: 14 }} onClick={() => setModal(false)}>Batal</button>
              <button className="btn-gold" style={{ padding: "9px 22px", fontSize: 14 }} onClick={save}>{editing ? "Simpan Perubahan" : "Tambahkan Lead"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROPERTIES ───────────────────────────────────────────────────────────────
function Properties({ properties, setProperties, showToast }) {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { name: "", type: "", price: "", dp: "", cicilan: "", kt: 2, km: 1, location: "", stock: 0, sold: 0, status: "Tersedia" };
  const [form, setForm] = useState(blank);

  const save = () => {
    if (!form.name) return;
    if (editing) { setProperties(prev => prev.map(p => p.id === editing ? { ...form, id: editing } : p)); showToast("Properti diperbarui ✓"); }
    else { setProperties(prev => [...prev, { ...form, id: Date.now() }]); showToast("Properti ditambahkan ✓"); }
    setModal(false);
  };

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#e8e4d9" }}>Data Properti</h1>
          <p style={{ color: "rgba(232,228,217,.45)", fontSize: 13, marginTop: 4 }}>Kelola listing properti kamu</p>
        </div>
        <button className="btn-gold" style={{ padding: "10px 20px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }} onClick={() => { setEditing(null); setForm(blank); setModal(true); }}>
          <Icon name="plus" size={16} /> Tambah Properti
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 20 }}>
        {properties.map((p, i) => {
          const pct = Math.round((p.sold / (p.sold + p.stock)) * 100);
          return (
            <div key={p.id} className="glass card" style={{ padding: 24, animationDelay: `${i * 0.08}s` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#e8e4d9" }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: "#c9a84c", fontWeight: 600, marginTop: 3 }}>Tipe {p.type}</div>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "rgba(34,197,94,.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,.2)", height: "fit-content" }}>{p.status}</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(232,228,217,.4)", marginBottom: 16 }}>📍 {p.location}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[["Harga", `Rp ${p.price}`], ["DP", `Rp ${p.dp}`], ["Cicilan/bln", `Rp ${p.cicilan}`], ["KT/KM", `${p.kt}/${p.km}`]].map(([k, v]) => (
                  <div key={k} style={{ background: "rgba(255,255,255,.04)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "rgba(232,228,217,.4)", letterSpacing: ".05em", textTransform: "uppercase" }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e4d9", marginTop: 3 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "rgba(232,228,217,.4)" }}>Terjual {p.sold} / {p.sold + p.stock} unit</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c" }}>{pct}%</span>
              </div>
              <div className="progress-bar" style={{ marginBottom: 16 }}><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-ghost" style={{ flex: 1, padding: "8px", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} onClick={() => { setEditing(p.id); setForm({ ...p }); setModal(true); }}>
                  <Icon name="edit" size={14} /> Edit
                </button>
                <button className="btn-danger" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => { setProperties(prev => prev.filter(x => x.id !== p.id)); showToast("Properti dihapus"); }}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#e8e4d9" }}>{editing ? "Edit Properti" : "Tambah Properti"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: "rgba(232,228,217,.5)", cursor: "pointer" }}><Icon name="close" /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["name","Nama Perumahan",true],["type","Tipe (contoh: T36/72)"],["price","Harga (contoh: 350.000.000)"],["dp","DP"],["cicilan","Cicilan/bulan"],["location","Lokasi"]].map(([k, lbl, full]) => (
                <div key={k} style={{ gridColumn: full ? "span 2" : "span 1" }}>
                  <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>{lbl}</label>
                  <input className="input-field" value={form[k] || ""} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={lbl} />
                </div>
              ))}
              {[["kt","Kamar Tidur"],["km","Kamar Mandi"],["stock","Stok Unit"],["sold","Terjual"]].map(([k, lbl]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>{lbl}</label>
                  <input type="number" className="input-field" value={form[k] || 0} onChange={e => setForm(p => ({ ...p, [k]: Number(e.target.value) }))} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="btn-ghost" style={{ padding: "9px 18px", fontSize: 14 }} onClick={() => setModal(false)}>Batal</button>
              <button className="btn-gold" style={{ padding: "9px 22px", fontSize: 14 }} onClick={save}>{editing ? "Simpan" : "Tambahkan"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────
function Activities({ activities, setActivities, leads, showToast }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ leadName: "", type: "Call", note: "", date: new Date().toISOString().split("T")[0] });

  const save = () => {
    if (!form.leadName || !form.note) return;
    setActivities(prev => [{ ...form, id: Date.now() }, ...prev]);
    showToast("Aktivitas dicatat ✓");
    setModal(false);
    setForm({ leadName: "", type: "Call", note: "", date: new Date().toISOString().split("T")[0] });
  };

  const typeColors = { Call: "#60a5fa", WhatsApp: "#4ade80", Survey: "#c9a84c", Meeting: "#a78bfa", Email: "#f87171", "Follow-up": "#fb923c" };

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#e8e4d9" }}>Log Aktivitas</h1>
          <p style={{ color: "rgba(232,228,217,.45)", fontSize: 13, marginTop: 4 }}>Rekam semua interaksi dengan prospek</p>
        </div>
        <button className="btn-gold" style={{ padding: "10px 20px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }} onClick={() => setModal(true)}>
          <Icon name="plus" size={16} /> Catat Aktivitas
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {activities.map((a, i) => (
          <div key={a.id} className="glass card" style={{ padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 16, animationDelay: `${i * 0.05}s` }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${typeColors[a.type] || "#c9a84c"}18`, border: `1px solid ${typeColors[a.type] || "#c9a84c"}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 14 }}>{a.type === "Call" ? "📞" : a.type === "WhatsApp" ? "💬" : a.type === "Survey" ? "🏠" : a.type === "Meeting" ? "🤝" : "📋"}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#e8e4d9" }}>{a.leadName}</span>
                <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${typeColors[a.type] || "#c9a84c"}20`, color: typeColors[a.type] || "#c9a84c" }}>{a.type}</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(232,228,217,.6)", lineHeight: 1.5 }}>{a.note}</div>
              <div style={{ fontSize: 11, color: "rgba(232,228,217,.3)", marginTop: 6 }}>{a.date}</div>
            </div>
            <button onClick={() => { setActivities(prev => prev.filter(x => x.id !== a.id)); showToast("Aktivitas dihapus"); }} className="btn-danger" style={{ padding: "6px", display: "flex", alignItems: "center", flexShrink: 0 }}><Icon name="trash" size={13} /></button>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#e8e4d9" }}>Catat Aktivitas</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: "rgba(232,228,217,.5)", cursor: "pointer" }}><Icon name="close" /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>Nama Lead</label>
                <select className="input-field" value={form.leadName} onChange={e => setForm(p => ({ ...p, leadName: e.target.value }))}>
                  <option value="">-- Pilih Lead --</option>
                  {leads.map(l => <option key={l.id}>{l.name}</option>)}
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>Jenis Aktivitas</label>
                  <select className="input-field" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    {ACTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>Tanggal</label>
                  <input type="date" className="input-field" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>Catatan</label>
                <textarea className="input-field" rows={3} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Apa yang dibicarakan? Apa hasilnya?" style={{ resize: "vertical" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="btn-ghost" style={{ padding: "9px 18px", fontSize: 14 }} onClick={() => setModal(false)}>Batal</button>
              <button className="btn-gold" style={{ padding: "9px 22px", fontSize: 14 }} onClick={save}>Simpan Aktivitas</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCRIPT GENERATOR ─────────────────────────────────────────────────────────
function Scripts({ properties, showToast }) {
  const [propIdx, setPropIdx] = useState(0);
  const [target, setTarget] = useState("Keluarga Muda");
  const [platform, setPlatform] = useState("TikTok / Instagram Reels");
  const [scriptType, setScriptType] = useState("Hook + Script 30 Detik");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedProp = properties[propIdx];

  const generate = async () => {
    if (!selectedProp) return;
    setLoading(true); setOutput("");
    const propData = `Nama: ${selectedProp.name} | Tipe: ${selectedProp.type} | Harga: Rp ${selectedProp.price} | DP: Rp ${selectedProp.dp} | Cicilan: Rp ${selectedProp.cicilan}/bln | KT/KM: ${selectedProp.kt}/${selectedProp.km} | Lokasi: ${selectedProp.location} | Stok tersisa: ${selectedProp.stock} unit`;
    const prompt = `Kamu adalah copywriter properti kelas dunia, content creator viral, dan agen properti terbaik Indonesia. Buat script konten properti yang powerful untuk:

PLATFORM: ${platform}
JENIS KONTEN: ${scriptType}
TARGET MARKET: ${target}
PROPERTI:
${propData}
${extra ? `\nINFO TAMBAHAN: ${extra}` : ""}

Aturan:
- Gunakan bahasa Indonesia yang natural, persuasif, modern
- Fokus pada manfaat, bukan hanya spesifikasi  
- Bangun urgensi dan FOMO yang natural
- Sertakan hook yang kuat di awal
- Sertakan CTA yang jelas di akhir
- Tambahkan emoji yang relevan
- Format rapi dan mudah dibaca
- Buat seolah unit ini rebutan dan langka`;

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setOutput(data.text || "Gagal generate script.");
    } catch (e) { setOutput("❌ Gagal: " + (e.message || "Coba lagi.")); }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true); showToast("Script disalin! ✓");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: "#e8e4d9" }}>AI Script Generator</h1>
        <p style={{ color: "rgba(232,228,217,.45)", fontSize: 13, marginTop: 4 }}>Generate script konten properti viral secara otomatis dengan AI</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, alignItems: "start" }}>
        {/* FORM */}
        <div className="glass" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Icon name="ai" size={16} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#c9a84c" }}>Konfigurasi Script</span>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>Pilih Properti</label>
            <select className="input-field" value={propIdx} onChange={e => setPropIdx(Number(e.target.value))}>
              {properties.map((p, i) => <option key={i} value={i}>{p.name} — {p.type}</option>)}
            </select>
          </div>

          {selectedProp && (
            <div style={{ background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.2)", borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, color: "#c9a84c", fontWeight: 600, marginBottom: 8, letterSpacing: ".04em", textTransform: "uppercase" }}>Preview Data Properti</div>
              {[["Harga", `Rp ${selectedProp.price}`], ["DP", `Rp ${selectedProp.dp}`], ["Cicilan", `Rp ${selectedProp.cicilan}/bln`], ["Stok", `${selectedProp.stock} unit tersisa`]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "rgba(232,228,217,.5)" }}>{k}</span>
                  <span style={{ color: "#e8e4d9", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          <div>
            <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>Platform</label>
            <select className="input-field" value={platform} onChange={e => setPlatform(e.target.value)}>
              {["TikTok / Instagram Reels", "YouTube Shorts", "Facebook", "WhatsApp Story", "Instagram Caption", "Semua Platform"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>Jenis Script</label>
            <select className="input-field" value={scriptType} onChange={e => setScriptType(e.target.value)}>
              {["Hook + Script 30 Detik", "Script 60 Detik Lengkap", "Caption Instagram Menjual", "Script Khusus Investor", "Script Pembeli Pertama", "Kata FOMO & Urgensi", "Script Hard Selling", "Script Soft Selling", "3 Versi Hook Viral", "WhatsApp Story Script"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>Target Market</label>
            <select className="input-field" value={target} onChange={e => setTarget(e.target.value)}>
              {["Keluarga Muda", "Investor", "Pasangan Baru", "Pembeli Rumah Pertama", "Karyawan Bergaji Tetap", "Wisatawan / Ekspatriat"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "rgba(232,228,217,.5)", marginBottom: 6, display: "block" }}>Info Tambahan (opsional)</label>
            <textarea className="input-field" rows={2} value={extra} onChange={e => setExtra(e.target.value)} placeholder="Contoh: Ada promo free AC, dekat sekolah Islam, dll" style={{ resize: "none" }} />
          </div>

          <button className="btn-gold" style={{ padding: "12px", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }} onClick={generate} disabled={loading}>
            {loading ? <><span className="loader" /><span>Generating...</span></> : <><Icon name="ai" size={16} /><span>Generate Script AI</span></>}
          </button>
        </div>

        {/* OUTPUT */}
        <div className="glass" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#c9a84c", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="script" size={15} /> Output Script
            </span>
            {output && (
              <button className="btn-ghost" style={{ padding: "6px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }} onClick={copy}>
                {copied ? <><Icon name="check" size={13} /> Tersalin!</> : <><Icon name="copy" size={13} /> Salin</>}
              </button>
            )}
          </div>

          {!output && !loading && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(232,228,217,.25)" }}>
              <div style={{ fontSize: 42, marginBottom: 12 }}>✍️</div>
              <div style={{ fontSize: 15, marginBottom: 6, color: "rgba(232,228,217,.35)" }}>Script belum digenerate</div>
              <div style={{ fontSize: 13 }}>Pilih properti & konfigurasi di sebelah kiri,<br />lalu klik "Generate Script AI"</div>
            </div>
          )}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <div className="loader" style={{ width: 32, height: 32, borderWidth: 3 }} />
                <div style={{ color: "rgba(232,228,217,.5)", fontSize: 14 }}>AI sedang menulis script terbaik...</div>
              </div>
            </div>
          )}
          {output && !loading && (
            <div className="script-output">{output}</div>
          )}
        </div>
      </div>
    </div>
  );
}
