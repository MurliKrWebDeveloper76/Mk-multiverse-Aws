import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Server, Database, ShieldCheck, BarChart3, 
  Users, CreditCard, Settings, LogOut, Search, Bell, Download,
  RefreshCw, Lock, Zap, ChevronRight, MoreVertical, Play, 
  Square, ShieldAlert, CheckCircle, Terminal, Eye, EyeOff,
  Globe, Cpu, Layers, Activity, TrendingUp, Menu, X
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  Radar, BarChart, Bar 
} from 'recharts';

// --- TYPES ---
type View = 'Dashboard' | 'Compute' | 'Storage' | 'Sentinel' | 'Analytics' | 'Team Management' | 'Billing' | 'Settings';

// --- MOCK DATA ---
const INITIAL_GRAPH_DATA = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  load: 40 + Math.random() * 20,
  traffic: 20 + Math.random() * 30
}));

// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    running: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    online: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    stopped: 'bg-slate-800 text-slate-500 border-slate-700',
    provisioning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    critical: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    suspended: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${styles[status.toLowerCase()] || styles.stopped}`}>
      {status}
    </span>
  );
};

// --- MAIN APP ---
const App = () => {
  const [view, setView] = useState<View>('Dashboard');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [credentials, setCredentials] = useState({ user: 'admin123', pass: 'admin' });
  const [graphData, setGraphData] = useState(INITIAL_GRAPH_DATA);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      setGraphData(prev => {
        const next = [...prev.slice(1)];
        next.push({
          time: prev[prev.length - 1].time + 1,
          load: 35 + Math.random() * 35,
          traffic: 20 + Math.random() * 40
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(false);
    setTimeout(() => {
      if (credentials.user === 'admin123' && credentials.pass === 'admin') {
        setAuthenticated(true);
      } else {
        setAuthError(true);
      }
      setLoading(false);
    }, 1500);
  };

  if (!authenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#060910] p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        <div className="w-full max-w-md p-6 sm:p-10 glass rounded-2xl border border-slate-800 shadow-2xl relative z-10 animate-in zoom-in duration-500">
          <div className="scanline"></div>
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-xl mx-auto flex items-center justify-center mb-4 border border-indigo-500/30">
              <ShieldAlert className="text-indigo-400" size={32} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">MK MULTIVERSE</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Unified Cloud Access Gate</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity UID</label>
              <input 
                type="text" 
                value={credentials.user}
                onChange={(e) => setCredentials(p => ({...p, user: e.target.value}))}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Cipher</label>
              <input 
                type="password" 
                value={credentials.pass}
                onChange={(e) => setCredentials(p => ({...p, pass: e.target.value}))}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            {authError && <p className="text-rose-500 text-[10px] font-bold text-center uppercase tracking-widest animate-pulse">Access Denied: Invalid Credentials</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-lg transition-all shadow-xl shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'ESTABLISHING SECURE LINK...' : 'ESTABLISH LINK'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#060910] text-slate-200 overflow-hidden font-sans relative">
      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#0b0f19] border-r border-slate-800 flex flex-col z-[70] transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center mr-3 font-black text-xs">MK</div>
            <span className="font-bold text-slate-100 tracking-tighter">Multiverse</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <div className="sidebar-section-title">Core Infrastructure</div>
          <NavItem active={view === 'Dashboard'} icon={LayoutDashboard} label="Dashboard" onClick={() => { setView('Dashboard'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Compute'} icon={Server} label="Compute" onClick={() => { setView('Compute'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Storage'} icon={Database} label="Storage" onClick={() => { setView('Storage'); setIsSidebarOpen(false); }} />
          
          <div className="sidebar-section-title">Security & Ops</div>
          <NavItem active={view === 'Sentinel'} icon={ShieldCheck} label="Sentinel" onClick={() => { setView('Sentinel'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Analytics'} icon={BarChart3} label="Analytics" onClick={() => { setView('Analytics'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Team Management'} icon={Users} label="Team Management" onClick={() => { setView('Team Management'); setIsSidebarOpen(false); }} />
          
          <div className="sidebar-section-title">Finance</div>
          <NavItem active={view === 'Billing'} icon={CreditCard} label="Billing" onClick={() => { setView('Billing'); setIsSidebarOpen(false); }} />
          
          <div className="sidebar-section-title">Config</div>
          <NavItem active={view === 'Settings'} icon={Settings} label="Settings" onClick={() => { setView('Settings'); setIsSidebarOpen(false); }} />
        </nav>

        <div className="p-4 border-t border-slate-800 bg-[#060910]/30">
          <div className="flex items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800 mb-4">
            <img src="https://picsum.photos/seed/mk/64" className="w-8 h-8 rounded bg-slate-700" alt="Admin" />
            <div className="ml-3">
              <p className="text-xs font-bold text-white">admin_user</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Administrator</p>
            </div>
          </div>
          <button 
            onClick={() => setAuthenticated(false)}
            className="w-full flex items-center px-3 py-2 text-slate-400 hover:text-rose-400 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <LogOut size={16} className="mr-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* HEADER */}
        <header className="h-16 bg-[#0b0f19] border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 z-40">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 mr-2 text-slate-400 hover:text-white lg:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-widest truncate">{view}</h2>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded text-[10px] font-mono text-slate-500">
               <span className="flex items-center gap-1"><RefreshCw size={10} /> TTL: 14:59</span>
               <span>|</span>
               <span className="flex items-center gap-1 text-indigo-400"><Lock size={10} /> Session: Secure</span>
            </div>
            <div className="px-2 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] sm:text-[10px] font-black text-emerald-400 uppercase">
               Mainnet: Healthy
            </div>
          </div>
        </header>

        {/* VIEW AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {view === 'Dashboard' && <DashboardView data={graphData} />}
            {view === 'Compute' && <ComputeView />}
            {view === 'Storage' && <StorageView />}
            {view === 'Sentinel' && <SentinelView />}
            {view === 'Analytics' && <AnalyticsView />}
            {view === 'Team Management' && <TeamView />}
            {view === 'Billing' && <BillingView />}
            {view === 'Settings' && <SettingsView showApiKey={showApiKey} setShowApiKey={setShowApiKey} />}
          </div>
        </div>
      </main>
      
      <div className="fixed bottom-4 right-8 text-[9px] font-mono text-slate-800 pointer-events-none uppercase hidden md:block">
        System_Hash: 8f2a1c9 // Layer_7_Protected // u-1
      </div>
    </div>
  );
};

// --- SUB-VIEWS ---

const NavItem = ({ active, icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center px-6 py-3 transition-all ${active ? 'bg-indigo-600/10 text-indigo-400 border-r-2 border-indigo-600' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
  >
    <Icon size={18} className="mr-4" />
    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
  </button>
);

const DashboardView = ({ data }: { data: any[] }) => (
  <div className="space-y-6 sm:space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Cluster Load" val="46.438 %" sub="Real-time Neural Compute" change="+2.4%" positive icon={Cpu} />
      <StatCard label="Daily Throughput" val="69.4 TB" sub="60s Peak: 4.2 GB/s" change="+18.2%" positive icon={Activity} />
      <StatCard label="Object Storage" val="1.2 PB" sub="92% Redundancy Active" change="-0.8%" icon={Database} />
      <StatCard label="Global Latency" val="24 ms" sub="CDN Edge Status: Optimal" change="-4ms" positive icon={Zap} />
    </div>

    <div className="glass p-4 sm:p-6 rounded-xl border border-slate-800 h-[300px] sm:h-[400px] flex flex-col">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} className="text-indigo-500" /> Dynamic Load Telemetry
          </h3>
          <div className="flex gap-4 text-[9px] font-bold uppercase">
             <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Healthy</span>
             <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Critical (>75%)</span>
          </div>
       </div>
       <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[0, 100]} />
              <Area type="monotone" dataKey="load" stroke="#10b981" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={3} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
       </div>
       <div className="flex justify-between pt-4 text-[8px] font-mono text-slate-700">
          <span>Initializing...</span>
          <span className="hidden sm:inline">Initializing...</span>
          <span className="hidden sm:inline">Initializing...</span>
          <span>Initializing...</span>
       </div>
    </div>

    <div className="glass p-4 sm:p-6 rounded-xl border border-slate-800">
       <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
         <Layers size={14} className="text-indigo-500" /> Live Network Jitter
       </h3>
       <div className="space-y-6">
          <ProgressItem label="Edge Cluster A" val={37} color="bg-indigo-500" />
          <ProgressItem label="Regional Hub B" val={51} color="bg-emerald-500" />
          <ProgressItem label="Satellite Link C" val={19} color="bg-amber-500" />
          <ProgressItem label="Auth Layer D" val={28} color="bg-purple-500" />
       </div>
       <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-800 flex justify-between items-center">
          <div className="pr-4">
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Network Stability</p>
            <p className="text-xs font-bold text-slate-200 mt-1">Level 5 - Hardened</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 flex-shrink-0">
             <ChevronRight size={18} />
          </div>
       </div>
    </div>
  </div>
);

const ComputeView = () => (
  <div className="space-y-4 sm:space-y-6">
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="relative w-full sm:flex-1 sm:max-w-md">
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
           <input type="text" placeholder="Search servers, IPs..." className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none" />
        </div>
        <button className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-lg shadow-indigo-600/20 transition-all">
           + Deploy New
        </button>
     </div>
     <ComputeCard name="api-gateway-prod" ip="192.168.1.101" location="US East" cpu={32} ram="8 GB" status="RUNNING" />
     <ComputeCard name="db-cluster-node-1" ip="192.168.1.205" location="US West" cpu={64} ram="32 GB" status="RUNNING" />
     <ComputeCard name="edge-cdn-cache" ip="10.0.0.42" location="Europe" cpu={0} ram="4 GB" status="STOPPED" />
  </div>
);

const StorageView = () => (
  <div className="space-y-6 sm:space-y-8">
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
           <h3 className="text-lg font-bold text-white tracking-tight">Unified Object Storage</h3>
           <p className="text-xs text-slate-500 mt-1">8 multi-cloud zones management.</p>
        </div>
        <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-lg transition-all">+ Create Bucket</button>
     </div>
     <StorageBucket name="cdn-assets-production" region="US-EAST-1" vol="42.8 TB" obj="1.2M" status="SECURE" />
     <StorageBucket name="user-uploads-v2" region="EU-CENTRAL-1" vol="840 GB" obj="450k" status="ACTIVE" />
     
     <div className="p-6 sm:p-8 rounded-xl border border-slate-800 glass relative overflow-hidden group">
        <Zap className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-slate-800 w-24 h-24 sm:w-32 sm:h-32 -rotate-12 group-hover:text-amber-500/10 transition-colors opacity-20 sm:opacity-100" />
        <h3 className="text-sm font-bold text-amber-500 flex items-center gap-2 mb-2"><Zap size={16} /> Edge Cache Intelligence</h3>
        <p className="text-xs text-slate-400 max-w-lg leading-relaxed relative z-10">Neural Edge Cache is currently reducing origin traffic by <span className="text-white font-bold">84.2%</span>.</p>
        <div className="mt-6 flex flex-wrap gap-4 relative z-10">
           <button className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[9px] font-black uppercase rounded border border-amber-500/30 transition-all">Optimizer: Running</button>
           <button className="px-3 py-2 text-slate-500 text-[9px] font-black uppercase hover:text-slate-300 transition-all">Review Topology</button>
        </div>
     </div>
  </div>
);

const SentinelView = () => (
  <div className="space-y-6 sm:space-y-8">
     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="glass p-5 sm:p-6 rounded-xl border border-slate-800 flex items-center gap-4">
           <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><ShieldCheck size={20} /></div>
           <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Score</p><h3 className="text-xl sm:text-2xl font-black text-white">98/100</h3></div>
        </div>
        <div className="glass p-5 sm:p-6 rounded-xl border border-slate-800 flex items-center gap-4">
           <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><ShieldAlert size={20} /></div>
           <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Threats</p><h3 className="text-xl sm:text-2xl font-black text-white">0</h3></div>
        </div>
        <div className="glass p-5 sm:p-6 rounded-xl border border-slate-800 flex items-center gap-4">
           <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckCircle size={20} /></div>
           <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compliance</p><h3 className="text-xl sm:text-2xl font-black text-white">SOC2</h3></div>
        </div>
     </div>

     <div className="glass p-4 sm:p-6 rounded-xl border border-slate-800 h-[300px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Zap size={14} className="text-amber-500" /> Sentinel AI Audit</h3>
           <button className="px-3 py-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase rounded transition-all">Audit</button>
        </div>
        <div className="flex-1 bg-black/40 rounded border border-slate-800 p-6 flex items-center justify-center">
           <div className="text-center space-y-4">
              <Terminal className="mx-auto text-slate-700 animate-pulse" size={40} />
              <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.4em]">Awaiting Command</p>
           </div>
        </div>
     </div>
  </div>
);

const AnalyticsView = () => (
  <div className="space-y-6 sm:space-y-8">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Accuracy" val="99.4%" sub="v4 Engine" change="+0.2%" positive icon={Activity} />
      <StatCard label="Predictive" val="14.2%" sub="ROI Forecast" change="+1.5%" positive icon={TrendingUp} />
      <StatCard label="Drift" val="0.04" sub="Low" change="-12%" positive icon={Layers} />
      <StatCard label="Anomaly" val="0.002%" sub="Detection" change="-0.001%" positive icon={ShieldCheck} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      <div className="glass p-4 sm:p-6 rounded-xl border border-slate-800 h-[300px] sm:h-[400px] flex flex-col">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Layers size={14} className="text-indigo-500" /> Infrastructure Distribution
        </h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
              { subject: 'Compute', A: 120, B: 110 },
              { subject: 'Storage', A: 98, B: 130 },
              { subject: 'Memory', A: 86, B: 130 },
              { subject: 'Network', A: 99, B: 100 },
              { subject: 'Security', A: 85, B: 90 },
              { subject: 'AI Ops', A: 65, B: 85 },
            ]}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 9 }} />
              <Radar name="Current" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              <Radar name="Target" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass p-4 sm:p-6 rounded-xl border border-slate-800 h-[300px] sm:h-[400px] flex flex-col">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <BarChart3 size={14} className="text-emerald-500" /> Consumption (7d)
        </h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'M', cpu: 4000, mem: 2400 },
              { name: 'T', cpu: 3000, mem: 1398 },
              { name: 'W', cpu: 2000, mem: 9800 },
              { name: 'T', cpu: 2780, mem: 3908 },
              { name: 'F', cpu: 1890, mem: 4800 },
              { name: 'S', cpu: 2390, mem: 3800 },
              { name: 'S', cpu: 3490, mem: 4300 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px' }} />
              <Bar dataKey="cpu" fill="#6366f1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="mem" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const TeamView = () => (
  <div className="space-y-6">
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
           <h3 className="text-lg font-bold text-white tracking-tight">Team Access</h3>
           <p className="text-xs text-slate-500 mt-1">Role management.</p>
        </div>
        <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded shadow-lg transition-all">+ Invite Member</button>
     </div>
     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatSimple label="Seats" val="12" />
        <StatSimple label="Active" val="8" color="text-emerald-500" />
        <StatSimple label="Pending" val="2" color="text-amber-500" />
        <StatSimple label="Admins" val="4" color="text-indigo-400" />
     </div>
     <div className="glass rounded-xl border border-slate-800 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left min-w-[600px]">
           <thead>
              <tr className="bg-slate-950/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800">
                 <th className="px-6 py-4">User</th>
                 <th className="px-6 py-4">Role</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4">Last Activity</th>
                 <th className="px-6 py-4"></th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-800/50">
              <UserRow name="admin_user" email="admin@mk-multiverse.io" role="Administrator" status="ACTIVE" last="Now" />
              <UserRow name="dev_sarah" email="sarah.c@mk-multiverse.io" role="Developer" status="ACTIVE" last="10m ago" />
              <UserRow name="view_jack" email="jack.r@mk-multiverse.io" role="Viewer" status="ACTIVE" last="2h ago" />
           </tbody>
        </table>
     </div>
  </div>
);

const BillingView = () => (
  <div className="space-y-6 sm:space-y-8">
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="glass p-6 sm:p-8 rounded-xl border border-slate-800 space-y-4">
           <div className="flex items-center gap-3 text-emerald-500"><CreditCard size={20} /><p className="text-[10px] font-black uppercase tracking-widest">Balance</p></div>
           <h3 className="text-3xl sm:text-4xl font-black text-white">$1,420.50</h3>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">+12% from last month</p>
        </div>
        <div className="glass p-6 sm:p-8 rounded-xl border border-slate-800 space-y-4">
           <div className="flex items-center gap-3 text-indigo-400"><Layers size={20} /><p className="text-[10px] font-black uppercase tracking-widest">Method</p></div>
           <div className="flex items-center gap-4 pt-2">
              <div className="px-3 py-1 bg-indigo-600 rounded text-[10px] font-black">VISA</div>
              <p className="text-base sm:text-lg font-mono font-bold text-white tracking-widest">•••• 8291</p>
           </div>
        </div>
        <div className="glass p-6 sm:p-8 rounded-xl border border-slate-800 space-y-4 sm:col-span-2 lg:col-span-1">
           <div className="flex items-center gap-3 text-amber-500"><ShieldAlert size={20} /><p className="text-[10px] font-black uppercase tracking-widest">Budget Alert</p></div>
           <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Threshold <span className="text-amber-500 font-black">85%</span> ($2,000.00).</p>
           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-amber-500 w-[85%]"></div>
           </div>
        </div>
     </div>

     <div className="glass rounded-xl border border-slate-800 overflow-x-auto custom-scrollbar">
        <div className="p-4 sm:p-6 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center gap-4">
           <h3 className="text-sm font-bold text-slate-200">History</h3>
           <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-[10px] font-black text-slate-300 rounded border border-slate-700 transition-all">EXPORT</button>
        </div>
        <table className="w-full text-left min-w-[700px]">
           <thead>
              <tr className="bg-slate-950/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                 <th className="px-6 py-4">ID</th>
                 <th className="px-6 py-4">Date</th>
                 <th className="px-6 py-4">Service</th>
                 <th className="px-6 py-4">Amount</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-800/50">
              <InvoiceRow id="INV-2024-001" date="Oct 01, 2024" desc="Compute + DB Cluster" amt="$1420.50" status="PAID" />
              <InvoiceRow id="INV-2024-002" date="Sep 01, 2024" desc="Compute + DB Cluster" amt="$1280.00" status="PAID" />
           </tbody>
        </table>
     </div>
  </div>
);

const SettingsView = ({ showApiKey, setShowApiKey }: any) => (
  <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
     <div>
        <h3 className="text-lg font-bold text-white tracking-tight">Platform Settings</h3>
        <p className="text-xs text-slate-500 mt-1">Configure global parameters.</p>
     </div>
     
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
           <div className="glass p-6 sm:p-8 rounded-xl border border-slate-800 space-y-6">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2"><ShieldCheck size={14} /> Security Hardening</h4>
              <ToggleItem label="Two-Factor" sub="Enforce keys." active />
              <ToggleItem label="API Logging" sub="Record requests." active />
           </div>

           <div className="glass p-6 sm:p-8 rounded-xl border border-slate-800 space-y-6">
              <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2"><Lock size={14} /> API Key</h4>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-2 overflow-hidden">
                 <div className="flex-1 truncate">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Live Secret Key</p>
                    <p className="text-[10px] sm:text-xs font-mono text-slate-400 tracking-wider truncate">
                       {showApiKey ? 'mk_live_51Mkh6L8z7pQ2wE4r9tY1u0i8...' : '••••••••••••••••••••••••'}
                    </p>
                 </div>
                 <button onClick={() => setShowApiKey(!showApiKey)} className="p-2 text-slate-500 hover:text-slate-300 flex-shrink-0">
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                 </button>
              </div>
           </div>

           <div className="flex justify-end gap-4">
              <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase rounded shadow-lg transition-all flex items-center gap-2">
                 <Database size={14} /> Save
              </button>
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 text-indigo-400"><Globe size={18} /><p className="text-[10px] font-black uppercase tracking-widest">Region Sync</p></div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Residency move available for <span className="text-white font-bold">US-EAST-1</span>.</p>
              <button className="w-full py-2 bg-slate-900 text-[10px] font-black uppercase text-indigo-400 border border-indigo-500/20 rounded-lg transition-all">Move</button>
           </div>
        </div>
     </div>
  </div>
);

// --- UTILS COMPONENTS ---

const StatCard = ({ label, val, sub, change, positive, icon: Icon }: any) => (
  <div className="glass p-5 rounded-xl border border-slate-800 relative group transition-all hover:border-indigo-500/50">
     <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
           <Icon size={18} />
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
           {change}
        </div>
     </div>
     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{label}</p>
     <h3 className="text-lg sm:text-xl font-black text-slate-100 mt-0.5 tracking-tight">{val}</h3>
     <p className="text-[8px] sm:text-[9px] font-mono text-slate-600 mt-2 uppercase tracking-tighter truncate">{sub}</p>
  </div>
);

const ProgressItem = ({ label, val, color }: any) => (
  <div className="space-y-2">
     <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
        <span className="text-slate-200 truncate pr-2">{label}</span>
        <span className="text-slate-500 flex-shrink-0">{val}%</span>
     </div>
     <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${val}%` }}></div>
     </div>
  </div>
);

const ComputeCard = ({ name, ip, location, cpu, ram, status }: any) => (
  <div className="glass p-4 sm:p-6 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-slate-800/20 transition-all">
     <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 ${status === 'STOPPED' ? 'text-slate-600' : 'text-emerald-400'}`}>
           <Server size={20} />
        </div>
        <div className="truncate">
           <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2 truncate">
              {name}
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status === 'RUNNING' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`}></div>
           </h4>
           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{status}</p>
        </div>
     </div>

     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 w-full sm:w-auto">
        <div className="space-y-0.5">
           <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Public IP</p>
           <p className="text-[10px] font-mono text-slate-400">{ip}</p>
        </div>
        <div className="space-y-0.5">
           <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Location</p>
           <p className="text-[10px] font-bold text-slate-400 truncate">{location}</p>
        </div>
        <div className="hidden md:block space-y-1">
           <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Load</p>
           <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${cpu}%` }}></div>
           </div>
        </div>
        <div className="space-y-0.5">
           <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">RAM</p>
           <p className="text-[10px] font-bold text-slate-300">{ram}</p>
        </div>
     </div>

     <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all">
           {status === 'RUNNING' ? <Square size={14} /> : <Play size={14} />}
        </button>
        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"><RefreshCw size={14} /></button>
        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"><MoreVertical size={14} /></button>
     </div>
  </div>
);

const StorageBucket = ({ name, region, vol, obj, status }: any) => (
  <div className="glass p-4 sm:p-6 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/20 transition-all group">
     <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0 group-hover:text-indigo-400 transition-colors">
           <Database size={20} />
        </div>
        <div className="truncate">
           <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">{name}</h4>
           <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-1">{region}</p>
        </div>
     </div>
     <div className="flex gap-8 sm:gap-16 w-full sm:w-auto">
        <div className="flex-1 sm:flex-none"><p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Vol</p><p className="text-[10px] font-black text-indigo-400">{vol}</p></div>
        <div className="flex-1 sm:flex-none"><p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Obj</p><p className="text-[10px] font-black text-slate-300">{obj}</p></div>
     </div>
     <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 w-full sm:w-auto">
        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div><span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{status}</span></div>
        <button className="text-[9px] font-black text-slate-500 hover:text-slate-200 uppercase flex items-center gap-1">Explore <ChevronRight size={14} /></button>
     </div>
  </div>
);

const UserRow = ({ name, email, role, status, last }: any) => (
  <tr className="hover:bg-slate-900/50 transition-all group">
     <td className="px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 text-[10px] uppercase flex-shrink-0">{name[0]}</div>
        <div className="truncate max-w-[120px]"><p className="text-xs font-bold text-slate-200 truncate">{name}</p><p className="text-[9px] text-slate-600 truncate">{email}</p></div>
     </td>
     <td className="px-6 py-4"><span className="text-xs text-slate-400 truncate">{role}</span></td>
     <td className="px-6 py-4"><StatusBadge status={status} /></td>
     <td className="px-6 py-4 text-[10px] text-slate-500 truncate">{last}</td>
     <td className="px-6 py-4 text-right"><MoreVertical size={14} className="text-slate-700 cursor-pointer inline-block" /></td>
  </tr>
);

const InvoiceRow = ({ id, date, desc, amt, status }: any) => (
  <tr className="hover:bg-slate-900/40 transition-all">
     <td className="px-6 py-4 text-[10px] font-mono text-slate-500">{id}</td>
     <td className="px-6 py-4 text-[9px] font-bold text-slate-500 uppercase">{date}</td>
     <td className="px-6 py-4 text-[10px] text-slate-300 truncate max-w-[150px]">{desc}</td>
     <td className="px-6 py-4 text-xs font-black text-white">{amt}</td>
     <td className="px-6 py-4"><StatusBadge status={status} /></td>
     <td className="px-6 py-4 text-right"><Download size={14} className="text-slate-700 cursor-pointer inline-block" /></td>
  </tr>
);

const ToggleItem = ({ label, sub, active = false }: any) => {
  const [enabled, setEnabled] = useState(active);
  return (
    <div className="flex items-center justify-between gap-4">
       <div className="flex-1">
          <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">{label}</p>
          <p className="text-[9px] text-slate-600 font-medium mt-1 leading-relaxed">{sub}</p>
       </div>
       <button 
          onClick={() => setEnabled(!enabled)}
          className={`w-10 h-5 rounded-full transition-all relative p-1 flex-shrink-0 ${enabled ? 'bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}`}
       >
          <div className={`w-3 h-3 bg-white rounded-full transition-all absolute ${enabled ? 'right-1' : 'left-1'}`}></div>
       </button>
    </div>
  );
};

const StatSimple = ({ label, val, color = 'text-white' }: any) => (
  <div className="glass p-4 rounded-xl border border-slate-800 text-center">
     <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 truncate">{label}</p>
     <h3 className={`text-base sm:text-xl font-black tracking-tight ${color}`}>{val}</h3>
  </div>
);

export default App;