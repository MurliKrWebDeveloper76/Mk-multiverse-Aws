import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Server, Database, ShieldCheck, BarChart3, 
  CreditCard, Settings, LogOut, Search, RefreshCw, 
  Lock, Zap, ChevronRight, MoreVertical, Play, Square, 
  ShieldAlert, CheckCircle, Terminal, Eye, EyeOff, Globe, 
  Cpu, Layers, Activity, TrendingUp, Menu, X, Sparkles, Download,
  Fingerprint, ZapOff, HardDrive, Users, Clock, Shield, Key, 
  ToggleLeft, ToggleRight, FileText, ChevronDown
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  Radar, BarChart, Bar, Cell
} from 'recharts';
import { GoogleGenAI } from '@google/genai';

// --- TYPES & INTERFACES ---
type View = 'Dashboard' | 'Compute' | 'Storage' | 'Sentinel' | 'Analytics' | 'Billing' | 'Settings';

interface MetricData {
  time: number;
  load: number;
  traffic: number;
  latency: number;
}

// --- CONSTANTS ---
const INITIAL_GRAPH_DATA: MetricData[] = Array.from({ length: 30 }, (_, i) => ({
  time: i,
  load: 30 + Math.random() * 20,
  traffic: 15 + Math.random() * 40,
  latency: 18 + Math.random() * 10
}));

const TOPOLOGY_DATA = [
  { subject: 'Compute', A: 120, fullMark: 150 },
  { subject: 'Memory', A: 98, fullMark: 150 },
  { subject: 'Storage', A: 86, fullMark: 150 },
  { subject: 'Network', A: 99, fullMark: 150 },
  { subject: 'Security', A: 135, fullMark: 150 },
  { subject: 'IOPS', A: 110, fullMark: 150 },
];

const CONSUMPTION_DATA = [
  { name: 'Mon', val: 4000 },
  { name: 'Tue', val: 3000 },
  { name: 'Wed', val: 5500 },
  { name: 'Thu', val: 2780 },
  { name: 'Fri', val: 4890 },
  { name: 'Sat', val: 2390 },
  { name: 'Sun', val: 3490 },
];

// --- UTILITIES ---
const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

// --- SHARED UI COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const base = "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border transition-all duration-300";
  if (['running', 'online', 'active', 'paid', 'healthy'].includes(s)) 
    return <span className={`${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]`}>{status}</span>;
  if (['stopped', 'offline', 'disabled'].includes(s))
    return <span className={`${base} bg-slate-800 text-slate-500 border-slate-700`}>{status}</span>;
  if (['warning', 'pending', 'provisioning'].includes(s))
    return <span className={`${base} bg-amber-500/10 text-amber-500 border-amber-500/20`}>{status}</span>;
  return <span className={`${base} bg-rose-500/10 text-rose-500 border-rose-500/20`}>{status}</span>;
};

const StatCard = ({ label, val, sub, change, positive, icon: Icon }: any) => (
  <div className="glass p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all group relative overflow-hidden shadow-xl">
    <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/5 blur-2xl rounded-full group-hover:bg-indigo-500/10 transition-all"></div>
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
        <Icon size={20} />
      </div>
      <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${positive ? 'text-emerald-500 bg-emerald-500/5' : 'text-rose-500 bg-rose-500/5'}`}>
        {change}
      </div>
    </div>
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    <h3 className="text-2xl font-black text-white mt-1 tracking-tighter">{val}</h3>
    <p className="text-[10px] font-mono text-slate-600 mt-2 uppercase tracking-tight">{sub}</p>
  </div>
);

// --- VIEW COMPONENTS ---

const DashboardView = ({ data }: { data: MetricData[] }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard label="Cluster Load" val={`${data[data.length-1].load.toFixed(1)}%`} sub="Neural Distro Node 4" change="+1.2%" positive icon={Cpu} />
      <StatCard label="Inbound Traffic" val="4.2 Gbps" sub="Global Edge Cache" change="+24.8%" positive icon={Activity} />
      <StatCard label="Active Nodes" val="1,248" sub="Distributed Consensus" change="Stable" positive icon={Server} />
      <StatCard label="Security Index" val="99.4" sub="Sentinel Hardening" change="+0.2%" positive icon={ShieldCheck} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-500" /> Real-time Telemetry
            </h3>
            <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-tighter">Live feedback from 14 global data regions</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div><span className="text-[9px] font-bold text-slate-400">LOAD</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div><span className="text-[9px] font-bold text-slate-400">TRAFFIC</span></div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }} />
              <Area type="monotone" dataKey="load" stroke="#10b981" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={3} isAnimationActive={false} />
              <Area type="monotone" dataKey="traffic" stroke="#6366f1" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={3} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glass p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-6">Threat Intelligence</h3>
        <div className="space-y-4">
          <ThreatItem label="Auth Bypass Attempt" origin="CN_BEIJING" severity="HIGH" />
          <ThreatItem label="DDoS Flux Pattern" origin="RU_MOSCOW" severity="MEDIUM" />
          <ThreatItem label="Port Sweep Detected" origin="BR_SAO_PAULO" severity="LOW" />
          <ThreatItem label="Packet Inversion" origin="LOCAL_GATEWAY" severity="MEDIUM" />
        </div>
        <button className="w-full mt-6 py-3 border border-slate-700 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-800/50 transition-colors">View Security Logs</button>
      </div>
    </div>
  </div>
);

const ThreatItem = ({ label, origin, severity }: { label: string, origin: string, severity: string }) => (
  <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
    <div>
      <p className="text-[10px] font-bold text-slate-100 uppercase">{label}</p>
      <p className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-widest">{origin}</p>
    </div>
    <div className={`text-[8px] font-black px-1.5 py-0.5 rounded ${severity === 'HIGH' ? 'bg-rose-500/10 text-rose-500' : severity === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
      {severity}
    </div>
  </div>
);

const ComputeView = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
    <ComputeNodeCard name="hyper-prod-01" type="GPU Accelerated" specs="80GB A100 x 4" status="RUNNING" region="US-EAST" />
    <ComputeNodeCard name="api-gateway-01" type="General Purpose" specs="32 vCPU / 128GB" status="RUNNING" region="EU-WEST" />
    <ComputeNodeCard name="neural-train-02" type="AI Training" specs="TPU v4 x 8" status="STOPPED" region="ASIA-PAC" />
    <ComputeNodeCard name="auth-cluster-05" type="Hardened Security" specs="16 vCPU / 64GB" status="RUNNING" region="US-EAST" />
    <ComputeNodeCard name="backup-node-01" type="Cold Storage Sync" specs="8 vCPU / 32GB" status="PROVISIONING" region="US-WEST" />
  </div>
);

const ComputeNodeCard = ({ name, type, specs, status, region }: any) => (
  <div className="glass p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all group flex flex-col justify-between h-[180px]">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Server size={14} className="text-indigo-500" /> {name}
        </h4>
        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{type}</p>
      </div>
      <StatusBadge status={status} />
    </div>
    <div className="flex justify-between items-end">
      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{specs}</p>
      <div className="flex gap-2">
        <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors"><Play size={14} /></button>
        <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors"><Settings size={14} /></button>
      </div>
    </div>
  </div>
);

const StorageView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StorageCard name="Distributed Object Store" used={42.8} total={100} units="TB" type="S3 Compatible" status="HEALTHY" />
      <StorageCard name="Ultra-NVMe Array 01" used={856} total={2048} units="GB" type="Block Storage" status="ACTIVE" />
      <StorageCard name="Global CDN Cache" used={12.4} total={50} units="TB" type="Edge Distributed" status="HEALTHY" />
      <StorageCard name="Cold Archive Pool" used={1.2} total={5} units="PB" type="LTO-9 Emulated" status="STANDBY" />
    </div>
  </div>
);

const StorageCard = ({ name, used, total, units, type, status }: any) => {
  const percentage = (used / total) * 100;
  return (
    <div className="glass p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-widest">{name}</h4>
          <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">{type}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-mono uppercase">
          <span className="text-slate-400">Utilization</span>
          <span className="text-white">{used} / {total} {units} ({percentage.toFixed(1)}%)</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div className={`h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

const SentinelView = ({ isAuditing, auditLog, runAudit, terminalRef }: any) => (
  <div className="space-y-6 animate-in zoom-in-95 duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass p-8 rounded-2xl border border-slate-800 flex flex-col min-h-[500px] shadow-2xl relative">
        <div className="absolute top-0 right-0 p-8">
           <div className="w-12 h-12 rounded-full border border-indigo-500/20 flex items-center justify-center animate-pulse">
              <ShieldCheck className="text-indigo-500" size={24} />
           </div>
        </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Sparkles className="text-indigo-500" /> Neural Security Audit
            </h3>
            <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">Powered by Gemini-3 Intelligence</p>
          </div>
          <button 
            onClick={runAudit} 
            disabled={isAuditing} 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-3"
          >
            {isAuditing ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} />} 
            {isAuditing ? 'Initiating Link...' : 'Execute Audit'}
          </button>
        </div>

        <div 
          ref={terminalRef} 
          className="flex-1 bg-[#04060b] rounded-xl border border-slate-800/60 p-6 font-mono text-xs text-slate-300 overflow-y-auto custom-scrollbar leading-relaxed"
        >
          {auditLog.map((log: string, i: number) => {
            const isAI = log.startsWith('[SENTINEL]');
            const isError = log.startsWith('[ERROR]');
            const isSystem = log.startsWith('[SYSTEM]');
            return (
              <div key={i} className={`mb-3 flex gap-3 ${isAI ? 'text-indigo-400 font-bold' : isError ? 'text-rose-500 font-black' : isSystem ? 'text-emerald-500/80' : 'text-slate-500'}`}>
                <span className="opacity-30 min-w-[65px]">{new Date().toLocaleTimeString([], { hour12: false })}</span>
                <span className="flex-1">{log}</span>
              </div>
            );
          })}
          {isAuditing && <div className="flex items-center gap-2 text-indigo-500 animate-pulse mt-2"><Terminal size={12} /><span>DECRYPTING DATA STREAM...</span></div>}
          <div className="h-1" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-6 rounded-2xl border border-slate-800">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Hardening Status</h4>
          <div className="space-y-4">
            <HardeningStep label="Kernel Isolation" completed />
            <HardeningStep label="Encrypted Swap" completed />
            <HardeningStep label="Rootless Containers" completed />
            <HardeningStep label="Quantum Shield" progress={65} />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border border-slate-800">
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Compliance Score</h4>
           <div className="text-4xl font-black text-white">99.4</div>
           <p className="text-[10px] font-mono text-emerald-500 mt-1 uppercase tracking-widest">+0.4% Improvement</p>
           <div className="w-full h-1.5 bg-slate-900 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-emerald-500 w-[99.4%] shadow-[0_0_10px_#10b981]"></div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const HardeningStep = ({ label, completed, progress }: { label: string, completed?: boolean, progress?: number }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${completed ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-indigo-500 animate-pulse'}`}></div>
      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{label}</span>
    </div>
    {completed ? <CheckCircle size={12} className="text-emerald-500" /> : <span className="text-[10px] font-mono text-indigo-400">{progress}%</span>}
  </div>
);

const AnalyticsView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass p-8 rounded-2xl border border-slate-800 shadow-2xl h-[450px]">
        <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest mb-8">System Health Topology</h3>
        <ResponsiveContainer width="100%" height="85%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={TOPOLOGY_DATA}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
            <Radar name="Cluster A" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} dot={{ fill: '#6366f1', r: 4 }} />
            <Tooltip contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass p-8 rounded-2xl border border-slate-800 shadow-2xl h-[450px]">
        <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest mb-8">Compute Consumption Trend</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={CONSUMPTION_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
            <Bar dataKey="val" radius={[6, 6, 0, 0]}>
              {CONSUMPTION_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 2 ? '#6366f1' : '#1e293b'} className="hover:fill-indigo-400 transition-colors" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const BillingView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass p-6 rounded-2xl border border-slate-800">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unpaid Balance</p>
        <h3 className="text-3xl font-black text-white mt-2">$1,420.50</h3>
        <p className="text-[10px] font-mono text-amber-500 mt-2 uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> Due in 4 days</p>
      </div>
      <div className="glass p-6 rounded-2xl border border-slate-800">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Next Cycle</p>
        <h3 className="text-xl font-black text-white mt-2">Oct 12, 2024</h3>
        <p className="text-[10px] font-mono text-slate-500 mt-2 uppercase tracking-widest flex items-center gap-2">Standard Monthly Tier</p>
      </div>
      <div className="glass p-6 rounded-2xl border border-slate-800">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment Method</p>
        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-6 bg-slate-900 border border-slate-800 rounded flex items-center justify-center"><CreditCard size={16} className="text-slate-500" /></div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-tighter">VISA •••• 8291</p>
            <p className="text-[9px] text-slate-500 uppercase font-mono">Exp: 09/27</p>
          </div>
        </div>
      </div>
    </div>

    <div className="glass rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
      <div className="px-8 py-6 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center">
        <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">Billing History</h3>
        <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Download Statement</button>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/50">
            <tr>
              <th className="px-8 py-5">Invoice ID</th>
              <th className="px-8 py-5">Description</th>
              <th className="px-8 py-5">Amount</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            <InvoiceRow id="INV-001" desc="Compute Cluster Alpha Usage" amt="$1,240.00" status="PAID" />
            <InvoiceRow id="INV-002" desc="S3 Object Store Overages" amt="$180.50" status="PAID" />
            <InvoiceRow id="INV-003" desc="Global CDN Tier 3" amt="$42.10" status="PAID" />
            <InvoiceRow id="INV-004" desc="Cloud Sentinel Add-on" amt="$0.00" status="HEALTHY" />
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const InvoiceRow = ({ id, desc, amt, status }: any) => (
  <tr className="hover:bg-slate-900/30 transition-colors">
    <td className="px-8 py-5 text-[10px] font-mono text-slate-500">{id}</td>
    <td className="px-8 py-5 text-xs font-bold">{desc}</td>
    <td className="px-8 py-5 text-xs font-black text-white">{amt}</td>
    <td className="px-8 py-5"><StatusBadge status={status} /></td>
    <td className="px-8 py-5 text-right"><Download size={14} className="text-slate-700 cursor-pointer hover:text-indigo-500 transition-colors inline-block" /></td>
  </tr>
);

const SettingsView = () => {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-500">
      <div className="space-y-6">
        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
          <Shield className="text-indigo-500" size={18} /> Global Security Config
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingToggle label="Enforce Hardware 2FA" sub="Require physical security keys for root access." active />
          <SettingToggle label="Immutable Audit Logs" sub="Prevent log modification for compliance." active />
          <SettingToggle label="Dark Fiber Peering" sub="Prioritize low-latency private interconnects." active={false} />
          <SettingToggle label="Automated Threat Wipe" sub="Purge isolated containers on breach detection." active />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
          <Key className="text-amber-500" size={18} /> API Access Controls
        </h3>
        <div className="glass p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
             <div>
                <p className="text-[10px] font-black text-slate-200 uppercase">Primary Management Key</p>
                <p className="text-[9px] font-mono text-slate-500 mt-1">Generated: 2024-08-15 • Last Use: 2h ago</p>
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  {apiKeyVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500/10 transition-colors">Revoke</button>
             </div>
          </div>
          <div className="relative">
            <input 
              type={apiKeyVisible ? "text" : "password"} 
              readOnly 
              value="mk_live_9921_ax_837_quantum_secure_node" 
              className="w-full bg-[#04060b] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
          <Globe className="text-emerald-500" size={18} /> Regional Preferences
        </h3>
        <div className="glass p-6 rounded-2xl border border-slate-800 divide-y divide-slate-800/50">
          <div className="py-4 first:pt-0 flex justify-between items-center">
             <span className="text-xs font-bold text-slate-300">Default Deployment Region</span>
             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 cursor-pointer">US-EAST-01 <ChevronDown size={12} /></span>
          </div>
          <div className="py-4 flex justify-between items-center">
             <span className="text-xs font-bold text-slate-300">Telemetry Sampling Rate</span>
             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 cursor-pointer">100ms <ChevronDown size={12} /></span>
          </div>
          <div className="py-4 last:pb-0 flex justify-between items-center">
             <span className="text-xs font-bold text-slate-300">Audit Data Retention</span>
             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 cursor-pointer">7 Years <ChevronDown size={12} /></span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingToggle = ({ label, sub, active }: { label: string, sub: string, active?: boolean }) => {
  const [isOn, setIsOn] = useState(active);
  return (
    <div className="glass p-5 rounded-2xl border border-slate-800 flex justify-between items-start group hover:border-indigo-500/30 transition-all">
      <div className="space-y-1">
        <p className="text-xs font-black text-slate-200 uppercase tracking-tight">{label}</p>
        <p className="text-[9px] text-slate-500 font-medium leading-relaxed max-w-[200px]">{sub}</p>
      </div>
      <button onClick={() => setIsOn(!isOn)} className={`transition-colors duration-300 ${isOn ? 'text-indigo-500' : 'text-slate-700'}`}>
        {isOn ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
      </button>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [view, setView] = useState<View>('Dashboard');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ user: 'admin123', pass: 'admin' });
  const [graphData, setGraphData] = useState<MetricData[]>(INITIAL_GRAPH_DATA);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Sentinel State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLog, setAuditLog] = useState<string[]>(['[SYSTEM] Core initialized. Awaiting secure command.']);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [auditLog]);

  // Live metrics simulation
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      setGraphData(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        next.push({
          time: last.time + 1,
          load: 30 + Math.random() * 40,
          traffic: 20 + Math.random() * 50,
          latency: 15 + Math.random() * 15
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (credentials.user === 'admin123' && credentials.pass === 'admin') {
        setAuthenticated(true);
      } else {
        alert("ACCESS DENIED: Credentials mismatch.");
      }
      setLoading(false);
    }, 1500);
  };

  /**
   * Triggers the AI security audit using Gemini 3.
   */
  const runAudit = async () => {
    if (isAuditing) return;

    if (!process.env.API_KEY) {
      setAuditLog(prev => [...prev, '[ERROR] Security Breach: No API_KEY configured in environment.', '[SYSTEM] Deployment incomplete. Ensure API_KEY is set in Vercel settings.']);
      return;
    }

    setIsAuditing(true);
    setAuditLog(prev => [...prev, '[SYSTEM] Connecting to Neural Core...', '[SYSTEM] Analyzing Cluster Load: ' + graphData[graphData.length-1].load.toFixed(2) + '%']);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Infrastructure Report: Load=${graphData[graphData.length-1].load.toFixed(1)}%, Network=4.2Gbps, Uptime=99.998%. Provide a high-level enterprise security audit summary in under 80 words. Focus on stability and future resilience. Use terms like "Neural Link", "Hardened", and "Integrity".`,
        config: {
          systemInstruction: 'You are the MK Multiverse Security AI Sentinel. Speak with extreme professionalism and technical authority.',
          temperature: 0.4,
        },
      });

      const auditText = response.text || "Neural link established. System verified as stable.";
      setAuditLog(prev => [...prev, `[SENTINEL] ${auditText}`, '[SYSTEM] Neural audit finalized. Integrity confirmed.']);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown Fault';
      setAuditLog(prev => [
        ...prev, 
        `[ERROR] Secure tunnel breach: ${errorMsg}`,
        '[ERROR] Check Vercel Environment Variables for valid API_KEY.'
      ]);
    } finally {
      setIsAuditing(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#060910] p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        <div className="scanline"></div>
        <div className="w-full max-w-md p-10 glass rounded-[2rem] border border-slate-800 shadow-2xl relative z-10 transition-all">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              <ShieldAlert className="text-indigo-400" size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">MK Multiverse</h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Enterprise Infrastructure Control</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity UID</label>
              <input 
                type="text" 
                value={credentials.user} 
                onChange={(e) => setCredentials(p => ({...p, user: e.target.value}))} 
                className="w-full bg-[#04060b] border border-slate-800 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-mono" 
                placeholder="USR-77312" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Cipher</label>
              <input 
                type="password" 
                value={credentials.pass} 
                onChange={(e) => setCredentials(p => ({...p, pass: e.target.value}))} 
                className="w-full bg-[#04060b] border border-slate-800 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-mono" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-[0.25em] rounded-xl transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <Fingerprint size={16} />}
              {loading ? 'Validating Keys...' : 'Initialize Session'}
            </button>
          </form>
          <p className="text-center text-[9px] text-slate-700 mt-8 font-mono uppercase tracking-widest italic">Encrypted Secure Link v2.5.4</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#060910] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#0b0f19] border-r border-slate-800 flex flex-col z-[70] transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-8 border-b border-slate-800 font-black text-slate-100 uppercase tracking-[0.2em] text-sm italic">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg mr-3 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Sparkles size={16} className="text-white" />
          </div>
          MK Multiverse
        </div>
        <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar px-4 space-y-2">
          <NavItem active={view === 'Dashboard'} icon={LayoutDashboard} label="Dashboard" onClick={() => { setView('Dashboard'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Compute'} icon={Server} label="Compute" onClick={() => { setView('Compute'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Storage'} icon={HardDrive} label="Storage" onClick={() => { setView('Storage'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Sentinel'} icon={ShieldCheck} label="Sentinel AI" onClick={() => { setView('Sentinel'); setIsSidebarOpen(false); }} badge="Secure" />
          <NavItem active={view === 'Analytics'} icon={BarChart3} label="Analytics" onClick={() => { setView('Analytics'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Billing'} icon={CreditCard} label="Billing" onClick={() => { setView('Billing'); setIsSidebarOpen(false); }} />
          <div className="pt-4 mt-4 border-t border-slate-800/50">
            <NavItem active={view === 'Settings'} icon={Settings} label="Global Config" onClick={() => { setView('Settings'); setIsSidebarOpen(false); }} />
          </div>
        </nav>
        <div className="p-6 border-t border-slate-800 bg-[#090d14]">
          <div className="flex items-center gap-3 mb-6 px-2">
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                <Users className="text-slate-400" size={18} />
             </div>
             <div>
                <p className="text-xs font-black text-white uppercase tracking-tighter">Root Admin</p>
                <p className="text-[9px] text-emerald-500 font-mono font-bold uppercase tracking-widest">Level 10 Clearance</p>
             </div>
          </div>
          <button onClick={() => setAuthenticated(false)} className="w-full flex items-center justify-center py-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all gap-3 border border-rose-500/20">
            <LogOut size={14} /> Terminate Link
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay - Mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 lg:px-10 z-50">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-6 p-2 bg-slate-800 rounded-xl text-slate-400"><Menu size={20} /></button>
            <div className="space-y-1">
              <h2 className="text-lg font-black uppercase tracking-tighter text-white italic">{view}</h2>
              <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 uppercase tracking-[0.1em]">
                <Globe size={10} className="text-indigo-500" /> Distributed Node: <span className="text-indigo-400">US-EAST-01A</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden sm:flex items-center gap-3">
               <div className="flex flex-col items-end">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mainnet Status</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-2">Healthy <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div></p>
               </div>
            </div>
            <div className="flex items-center gap-3 pl-4 lg:pl-8 border-l border-slate-800">
               <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors relative">
                  <ShieldAlert size={18} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
               </button>
               <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors"><Search size={18} /></button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto space-y-10 relative z-10">
            {view === 'Dashboard' && <DashboardView data={graphData} />}
            {view === 'Compute' && <ComputeView />}
            {view === 'Storage' && <StorageView />}
            {view === 'Sentinel' && <SentinelView isAuditing={isAuditing} auditLog={auditLog} runAudit={runAudit} terminalRef={terminalRef} />}
            {view === 'Analytics' && <AnalyticsView />}
            {view === 'Billing' && <BillingView />}
            {view === 'Settings' && <SettingsView />}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, icon: Icon, label, onClick, badge }: any) => (
  <button onClick={onClick} className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all group relative ${active ? 'bg-indigo-600/10 text-indigo-400 shadow-[inset_0_0_15px_rgba(99,102,241,0.05)] border border-indigo-500/20' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30 border border-transparent'}`}>
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]"></div>}
    <Icon size={20} className={`mr-4 ${active ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'}`} />
    <span className="text-[10px] font-black uppercase tracking-[0.15em]">{label}</span>
    {badge && <span className="ml-auto text-[7px] font-black bg-indigo-500 text-white px-1.5 py-0.5 rounded uppercase tracking-widest shadow-[0_0_8px_rgba(99,102,241,0.4)]">{badge}</span>}
  </button>
);

export default App;