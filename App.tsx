import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Server, Database, ShieldCheck, BarChart3, 
  CreditCard, Settings, LogOut, Search, RefreshCw, 
  Lock, Zap, ChevronRight, MoreVertical, Play, Square, 
  ShieldAlert, CheckCircle, Terminal, Eye, EyeOff, Globe, 
  Cpu, Layers, Activity, TrendingUp, Menu, X, Sparkles, Download,
  Fingerprint, ZapOff, HardDrive, Users, Clock, Shield, Key, 
  ToggleLeft, ToggleRight, FileText, ChevronDown, MessageSquare, AlertTriangle, Plus,
  ShieldX, Radio, Zap as ZapIcon, Save, Wallet, Receipt, CreditCard as CardIcon, ArrowUpRight,
  FileDown, Image as ImageIcon, FileCheck, ClipboardList
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  Radar, BarChart, Bar, Cell, PieChart, Pie
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

interface ComputeNode {
  id: string;
  name: string;
  type: string;
  specs: string;
  status: 'RUNNING' | 'STOPPED' | 'PROVISIONING' | 'OVERLOAD' | 'CRITICAL';
  region: string;
  currentLoad: number;
}

// --- CONSTANTS ---
const INITIAL_GRAPH_DATA: MetricData[] = Array.from({ length: 30 }, (_, i) => ({
  time: i,
  load: 30 + Math.random() * 20,
  traffic: 15 + Math.random() * 40,
  latency: 18 + Math.random() * 10
}));

const INITIAL_NODES: ComputeNode[] = [
  { id: '1', name: "hyper-prod-01", type: "GPU Accelerated", specs: "80GB A100 x 4", status: "RUNNING", region: "US-EAST", currentLoad: 42 },
  { id: '2', name: "api-gateway-01", type: "General Purpose", specs: "32 vCPU / 128GB", status: "RUNNING", region: "EU-WEST", currentLoad: 28 },
  { id: '3', name: "neural-train-02", type: "AI Training", specs: "TPU v4 x 8", status: "STOPPED", region: "ASIA-PAC", currentLoad: 0 },
  { id: '4', name: "quantum-node-04", type: "Quantum Compute", specs: "128 Qubits", status: "RUNNING", region: "US-WEST", currentLoad: 65 },
];

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

// --- UTILS: ROBUST FILE EXPORT ---
const neuralDownload = (content: string | Blob, fileName: string, contentType: string) => {
  const blob = typeof content === 'string' ? new Blob([content], { type: contentType }) : content;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Clean up to prevent memory leaks and ghost elements
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
};

const generateMockCanvasImage = (title: string): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#060910';
    ctx.fillRect(0, 0, 800, 400);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < 800; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 400); ctx.stroke(); }
    for (let i = 0; i < 400; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(800, i); ctx.stroke(); }

    // Title
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('MK MULTIVERSE CORE ARCHIVE', 40, 60);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.fillText(`REPORT_ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 40, 90);
    ctx.fillText(`TIMESTAMP: ${new Date().toISOString()}`, 40, 110);
    ctx.fillText(`DATASET: ${title}`, 40, 130);

    // Decorative "Wave"
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 300);
    for (let i = 0; i < 800; i++) {
      ctx.lineTo(i, 300 + Math.sin(i * 0.05) * 20);
    }
    ctx.stroke();

    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/png');
  });
};

// --- SHARED UI COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const base = "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border transition-all duration-300";
  if (['running', 'online', 'active', 'paid', 'healthy'].includes(s)) 
    return <span className={`${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]`}>{status}</span>;
  if (['stopped', 'offline', 'disabled'].includes(s))
    return <span className={`${base} bg-slate-800 text-slate-500 border-slate-700`}>{status}</span>;
  if (['warning', 'pending', 'provisioning'].includes(s))
    return <span className={`${base} bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse`}>{status}</span>;
  if (['overload', 'critical'].includes(s))
    return <span className={`${base} bg-rose-500/20 text-rose-500 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-bounce`}>{status}</span>;
  return <span className={`${base} bg-rose-500/10 text-rose-500 border-rose-500/20`}>{status}</span>;
};

const StatCard = ({ label, val, sub, change, positive, icon: Icon, alert }: any) => (
  <div className={`glass p-6 rounded-2xl border ${alert ? 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'border-slate-800'} hover:border-indigo-500/50 transition-all group relative overflow-hidden shadow-xl`}>
    <div className={`absolute -right-4 -top-4 w-20 h-20 ${alert ? 'bg-rose-500/10' : 'bg-indigo-500/5'} blur-2xl rounded-full transition-all`}></div>
    <div className="flex justify-between items-start mb-6">
      <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${alert ? 'text-rose-400' : 'text-slate-500'} group-hover:scale-110 transition-all`}>
        <Icon size={20} />
      </div>
      <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${positive ? 'text-emerald-500 bg-emerald-500/5' : 'text-rose-500 bg-rose-500/5'}`}>
        {change}
      </div>
    </div>
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    <h3 className="text-2xl font-black mt-1 tracking-tighter text-white">{val}</h3>
    <p className="text-[10px] font-mono text-slate-600 mt-2 uppercase tracking-tight">{sub}</p>
  </div>
);

// --- VIEW COMPONENTS ---

const DashboardView = ({ data, nodes, setView }: { data: MetricData[], nodes: ComputeNode[], setView: (v: View) => void }) => {
  const isOverloaded = data[data.length-1].load > 85;
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      const content = `MK MULTIVERSE ENTERPRISE REPORT\n------------------------------\nTIMESTAMP: ${new Date().toLocaleString()}\nCLUSTER LOAD: ${data[data.length-1].load.toFixed(2)}%\nACTIVE NODES: ${nodes.length}\n\nNODE INVENTORY:\n${nodes.map(n => `- ${n.name} (${n.region}) : ${n.status} : ${n.currentLoad}% LOAD`).join('\n')}\n\nSECURITY STATUS: \nINTEGRITY CHECK: PASSED\nSENTINEL SCAN: 99.4% HARDENED\n\nEND OF REPORT`;
      neuralDownload(content, `MK_Multiverse_System_Report.pdf`, 'application/pdf');
      setIsExporting(false);
    }, 1200);
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    const blob = await generateMockCanvasImage(`INFRASTRUCTURE_SNAPSHOT_${nodes.length}_NODES`);
    neuralDownload(blob, `MK_Multiverse_Snapshot.png`, 'image/png');
    setIsExporting(false);
  };
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Cluster Load" val={`${data[data.length-1].load.toFixed(1)}%`} sub="Neural Distro Node 4" change="+1.2%" positive icon={Cpu} alert={isOverloaded} />
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
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={isOverloaded ? "#f43f5e" : "#10b981"} stopOpacity={0.2}/><stop offset="95%" stopColor={isOverloaded ? "#f43f5e" : "#10b981"} stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="load" stroke={isOverloaded ? "#f43f5e" : "#10b981"} fillOpacity={1} fill="url(#colorLoad)" strokeWidth={3} isAnimationActive={false} />
                <Area type="monotone" dataKey="traffic" stroke="#6366f1" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={3} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="space-y-6">
           <div className="glass p-6 rounded-2xl border border-slate-800 shadow-2xl">
            <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-6">Threat Intelligence</h3>
            <div className="space-y-4">
               <ThreatItem label="Auth Bypass Attempt" origin="CN_BEIJING" severity="HIGH" />
               <ThreatItem label="DDoS Flux Pattern" origin="RU_MOSCOW" severity="MEDIUM" />
               <ThreatItem label="Port Sweep Detected" origin="BR_SAO_PAULO" severity="LOW" />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileDown size={16} className="text-indigo-400" /> Export & Archive
             </h3>
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 transition-all text-slate-400 hover:text-white group/btn"
                >
                   {isExporting ? <RefreshCw className="animate-spin mb-2" size={16} /> : <FileText className="mb-2 group-hover/btn:scale-110 transition-transform" size={20} />}
                   <span className="text-[9px] font-black uppercase tracking-widest">System PDF</span>
                </button>
                <button 
                  onClick={handleExportImage}
                  disabled={isExporting}
                  className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 transition-all text-slate-400 hover:text-white group/btn"
                >
                   {isExporting ? <RefreshCw className="animate-spin mb-2" size={16} /> : <ImageIcon className="mb-2 group-hover/btn:scale-110 transition-transform" size={20} />}
                   <span className="text-[9px] font-black uppercase tracking-widest">State PNG</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

const ComputeView = ({ nodes, addNode }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportNodes = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvContent = `ID,NAME,TYPE,SPECS,REGION,STATUS,LOAD\n${nodes.map((n: any) => `${n.id},${n.name},${n.type},"${n.specs}",${n.region},${n.status},${n.currentLoad}%`).join('\n')}`;
      neuralDownload(csvContent, 'MK_Multiverse_Node_Registry.csv', 'text/csv');
      setIsExporting(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest">Active Cloud Inventory</h2>
         <div className="flex gap-3">
           <button 
            onClick={handleExportNodes}
            disabled={isExporting}
            className="px-4 py-2 border border-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-all"
           >
             {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <ClipboardList size={14} />}
             Export Registry
           </button>
           <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
           >
             <Plus size={14} /> Provision Node
           </button>
         </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
        {nodes.map((node: any) => (
          <ComputeNodeCard key={node.id} {...node} />
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="glass w-full max-w-md p-8 rounded-3xl border border-slate-700 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter">Provision New Node</h3>
                 <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={(e: any) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                addNode({
                  id: Math.random().toString(),
                  name: formData.get('name'),
                  type: formData.get('type'),
                  specs: formData.get('specs'),
                  status: 'PROVISIONING',
                  region: formData.get('region'),
                  currentLoad: 0
                });
                setShowModal(false);
              }} className="space-y-5">
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Node Name</label>
                    <input name="name" required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="nexus-edge-01" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Type</label>
                        <select name="type" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none">
                           <option>General Purpose</option>
                           <option>GPU Optimized</option>
                           <option>Memory Intensive</option>
                           <option>Quantum Edge</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Region</label>
                        <select name="region" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none">
                           <option>US-EAST</option>
                           <option>EU-WEST</option>
                           <option>ASIA-PAC</option>
                           <option>GLOBAL-CDN</option>
                        </select>
                    </div>
                 </div>
                 <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-indigo-600/20 transition-all mt-4">Initiate Deployment</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

const ComputeNodeCard = ({ name, type, specs, status, region, currentLoad }: any) => (
  <div className={`glass p-6 rounded-2xl border ${['OVERLOAD', 'CRITICAL'].includes(status) ? 'border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-slate-800'} hover:border-indigo-500/50 transition-all group flex flex-col justify-between h-[200px]`}>
    <div className="flex justify-between items-start">
      <div>
        <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Server size={14} className="text-indigo-500" /> {name}
        </h4>
        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{type}</p>
      </div>
      <StatusBadge status={status} />
    </div>
    <div className="mt-4">
       <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase mb-1">
          <span>Usage</span>
          <span className={['OVERLOAD', 'CRITICAL'].includes(status) ? 'text-rose-400 font-black' : 'text-indigo-400'}>{currentLoad}%</span>
       </div>
       <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${['OVERLOAD', 'CRITICAL'].includes(status) ? 'bg-rose-500' : 'bg-indigo-500'}`} 
            style={{ width: `${currentLoad}%` }}
          />
       </div>
    </div>
    <div className="flex justify-between items-end mt-auto">
      <div>
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{specs}</p>
        <p className="text-[9px] font-bold text-indigo-400/60 uppercase mt-1">{region}</p>
      </div>
    </div>
  </div>
);

const StorageView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard label="Total Capacity" val="42.8 TB" sub="98% Available" change="+2.4TB" positive icon={Database} />
      <StatCard label="IOPS Performance" val="840K" sub="99.9% Read Hit" change="Stable" positive icon={Zap} />
      <StatCard label="Active Snapshots" val="14,204" sub="Encrypted Backup" change="+12" positive icon={Shield} />
      <StatCard label="Object Count" val="4.2B" sub="Multiverse Store" change="+1.2M" positive icon={Layers} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StoragePoolCard name="Distributed Object Store" used={42.8} total={100} units="TB" type="S3 Compatible" status="HEALTHY" />
      <StoragePoolCard name="Ultra-NVMe Array 01" used={856} total={2048} units="GB" type="Block Storage" status="ACTIVE" />
      <StoragePoolCard name="Global CDN Cache" used={12.4} total={50} units="TB" type="Edge Distributed" status="HEALTHY" />
      <StoragePoolCard name="Cold Archive Pool" used={1.2} total={5} units="PB" type="LTO-9 Emulated" status="STANDBY" />
    </div>
  </div>
);

const StoragePoolCard = ({ name, used, total, units, type, status }: any) => {
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
          <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass p-8 rounded-2xl border border-slate-800 h-[450px] flex flex-col">
        <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-8">Infrastructure Topology</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={TOPOLOGY_DATA}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
              <Radar name="Cluster A" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="glass p-8 rounded-2xl border border-slate-800 h-[450px] flex flex-col">
        <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-8">Compute Consumption Trend</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CONSUMPTION_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid #1e293b' }} />
              <Bar dataKey="val" fill="#6366f1" radius={[4, 4, 0, 0]}>
                {CONSUMPTION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#10b981'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const BillingView = () => {
  const [isDownloadingContract, setIsDownloadingContract] = useState(false);

  const handleDownloadContract = () => {
    setIsDownloadingContract(true);
    setTimeout(() => {
      const contractContent = `MK MULTIVERSE - ENTERPRISE SERVICE LEVEL AGREEMENT (SLA)\n---------------------------------------------\nENTITY: ENTERPRISE PLUS CLIENT\nEFFECTIVE DATE: ${new Date().toLocaleDateString()}\nENCRYPTION: AES-256-GCM\nSHA-256: 48937bc39487293847293847293847239\n\nTERMS AND CONDITIONS:\n1. Uptime Guarantee: 99.999% global availability across all distributed clusters.\n2. Neural Auditing: Real-time Sentinel monitoring activated for all egress nodes.\n3. Quantum Shielding: Included as the primary encryption layer for data-at-rest.\n4. Support Tier: Platinum (5 minute high-priority neural response time).\n\nThis document is digitally signed by MK Neural Bridge and cryptographically verified.\n(c) MK Multiverse 2024-2025`;
      neuralDownload(contractContent, 'MK_Multiverse_SLA_Contract.pdf', 'application/pdf');
      setIsDownloadingContract(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Wallet size={120} />
             </div>
             <div className="w-24 h-24 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                <CreditCard size={40} />
             </div>
             <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Enterprise Plus Plan</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Next Renewal: OCT 24, 2024</p>
                <div className="mt-6 flex flex-wrap gap-4 justify-center sm:justify-start">
                   <button className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-500 transition-all">Upgrade Plan</button>
                   <button 
                    onClick={handleDownloadContract}
                    disabled={isDownloadingContract}
                    className="px-6 py-2 border border-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2"
                   >
                     {isDownloadingContract ? <RefreshCw size={14} className="animate-spin" /> : <FileCheck size={14} />}
                     {isDownloadingContract ? 'Compiling...' : 'Download Contract'}
                   </button>
                </div>
             </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-slate-800">
             <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Receipt size={16} className="text-indigo-500" /> Recent Transactions
             </h3>
             <div className="space-y-2">
                <TransactionItem date="SEP 24" desc="Compute Consumption (Tier 3)" amt="$4,204.12" status="PAID" />
                <TransactionItem date="AUG 24" desc="Object Storage Pool 01" amt="$842.00" status="PAID" />
                <TransactionItem date="AUG 15" desc="Quantum-Node Provisioning" amt="$1,200.00" status="PAID" />
                <TransactionItem date="JUL 24" desc="Enterprise Plus Renewal" amt="$25,000.00" status="PAID" />
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-slate-800">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Balance</p>
             <h4 className="text-3xl font-black text-white tracking-tighter">$12,408.31</h4>
             <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 mt-2 uppercase">
                <ArrowUpRight size={12} /> Credits active
             </div>
             <button className="w-full mt-6 py-4 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-200 uppercase tracking-widest hover:border-indigo-500 transition-all">Add Credits</button>
          </div>
          
          <div className="glass p-6 rounded-3xl border border-slate-800">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Saved Methods</p>
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <CardIcon size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white uppercase">Corporate VISA •••• 4242</p>
                      <p className="text-[9px] text-slate-500 uppercase font-mono">Expires 12/26</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionItem = ({ date, desc, amt, status }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-xl group hover:border-indigo-500/30 transition-all">
     <div className="flex items-center gap-4">
        <div className="text-[10px] font-black text-slate-500 uppercase w-12">{date}</div>
        <div>
           <p className="text-[11px] font-black text-slate-200 uppercase tracking-tight">{desc}</p>
        </div>
     </div>
     <div className="flex items-center gap-6">
        <div className="text-[11px] font-mono text-white font-bold">{amt}</div>
        <StatusBadge status={status} />
     </div>
  </div>
);

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
            const isAlert = log.startsWith('[ALERT]');
            return (
              <div key={i} className={`mb-3 flex gap-3 ${isAI ? 'text-indigo-400 font-bold' : isError || isAlert ? 'text-rose-500 font-black' : isSystem ? 'text-emerald-500/80' : 'text-slate-500'}`}>
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
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Compliance Score</h4>
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

// --- MAIN APP COMPONENT ---

const App = () => {
  const [view, setView] = useState<View>('Dashboard');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ user: 'admin123', pass: 'admin' });
  const [graphData, setGraphData] = useState<MetricData[]>(INITIAL_GRAPH_DATA);
  const [nodes, setNodes] = useState<ComputeNode[]>(INITIAL_NODES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [overloadThreshold, setOverloadThreshold] = useState(85);
  
  // API Key Management
  const [configApiKey, setConfigApiKey] = useState(localStorage.getItem('MK_MULTIVERSE_API_KEY') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState(false);

  // Sentinel State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditLog, setAuditLog] = useState<string[]>(['[SYSTEM] Core initialized. Awaiting secure command.']);
  const terminalRef = useRef<HTMLDivElement>(null);

  // AI Chat Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [auditLog]);

  // Live metrics simulation & Overload Detection
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      setGraphData(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        // Occasional spikes to test overload
        const newLoad = 20 + Math.random() * 80; 
        next.push({
          time: last.time + 1,
          load: newLoad,
          traffic: 20 + Math.random() * 50,
          latency: 15 + Math.random() * 15
        });

        // Update random nodes with new loads
        setNodes(nPrev => nPrev.map(n => {
           if (n.status === 'STOPPED') return n;
           const nl = Math.floor(Math.random() * 100);
           const ns = nl > overloadThreshold ? 'OVERLOAD' : 'RUNNING';
           return {...n, currentLoad: nl, status: ns as any};
        }));

        if (newLoad > overloadThreshold) {
           setAuditLog(prevLog => [...prevLog, `[ALERT] Global cluster load exceeded ${overloadThreshold}% threshold!`]);
        }

        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [authenticated, overloadThreshold]);

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

  const addNode = (node: ComputeNode) => {
    setNodes(prev => [...prev, node]);
    setAuditLog(prev => [...prev, `[SYSTEM] Provisioning request for ${node.name} initiated.`]);
    setTimeout(() => {
      setNodes(prev => prev.map(n => n.id === node.id ? {...n, status: 'RUNNING', currentLoad: 20} : n));
      setAuditLog(prev => [...prev, `[SYSTEM] ${node.name} online in ${node.region}.`]);
    }, 4000);
  };

  const getEffectiveApiKey = () => configApiKey || process.env.API_KEY || '';

  const handleSaveKey = () => {
    localStorage.setItem('MK_MULTIVERSE_API_KEY', configApiKey);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
    setAuditLog(prev => [...prev, '[SYSTEM] Security config updated. API Key saved to local vault.']);
  };

  const handleAIChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isThinking) return;

    const currentKey = getEffectiveApiKey();
    const userText = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setIsThinking(true);

    try {
      if (!currentKey) {
        throw new Error('Neural key missing. Configure Gemini API Key in Settings.');
      }
      const ai = new GoogleGenAI({ apiKey: currentKey });
      const currentLoad = graphData[graphData.length-1].load.toFixed(1);
      const activeCount = nodes.filter(n => n.status === 'RUNNING').length;
      const overloadedCount = nodes.filter(n => n.status === 'OVERLOAD').length;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Dashboard Snapshot: \n- Global Load: ${currentLoad}%\n- Active Nodes: ${activeCount}\n- Overloaded Nodes: ${overloadedCount}\n- Total Storage: 42.8TB\n- Security Score: 99.4\n\nThe user is asking: "${userText}". \nBe concise, mention metrics. Tone: Cyber-Intelligence.`,
        config: {
          systemInstruction: 'You are the MK Multiverse Neural Assistant. You have full visibility into the cloud cluster status.',
          temperature: 0.6,
        },
      });

      setChatMessages(prev => [...prev, { role: 'ai', text: response.text || "Neural connection failed. Please try again." }]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: 'ai', text: `PROTOCOL ERROR: ${err.message}` }]);
    } finally {
      setIsThinking(false);
    }
  };

  const runAudit = async () => {
    if (isAuditing) return;

    const currentKey = getEffectiveApiKey();
    if (!currentKey) {
      setAuditLog(prev => [
        ...prev, 
        '[ERROR] Security Breach: No API_KEY configured.', 
        '[SYSTEM] ACTION REQUIRED: Add "Gemini API Key" in Settings tab.'
      ]);
      return;
    }

    setIsAuditing(true);
    setAuditLog(prev => [...prev, '[SYSTEM] Establishing secure neural link...', '[SYSTEM] Auditing Nodes: ' + nodes.length + ' active assets.']);

    try {
      const ai = new GoogleGenAI({ apiKey: currentKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Security Audit Request. Current State: Cluster Load=${graphData[graphData.length-1].load.toFixed(1)}%, Uptime=99.998%. Provide a 2-sentence highly technical security verification summary.`,
        config: {
          systemInstruction: 'You are the Sentinel Security AI.',
          temperature: 0.3,
        },
      });

      const auditText = response.text || "Integrity verified.";
      setAuditLog(prev => [...prev, `[SENTINEL] ${auditText}`, '[SYSTEM] Integrity Check: 100% Passed.']);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown Fault';
      setAuditLog(prev => [...prev, `[ERROR] Audit tunnel failed: ${errorMsg}`]);
    } finally {
      setIsAuditing(false);
    }
  };

  const isGlobalOverload = graphData[graphData.length-1].load > overloadThreshold;

  return (
    <div className={`flex h-screen bg-[#060910] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 transition-all duration-700 ${isGlobalOverload ? 'shadow-[inset_0_0_150px_rgba(244,63,94,0.1)]' : ''}`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#0b0f19] border-r border-slate-800 flex flex-col z-[70] transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-8 border-b border-slate-800 font-black text-slate-100 uppercase tracking-[0.2em] text-sm italic">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg mr-3 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Sparkles size={16} className="text-white" />
          </div>
          MK Multiverse
        </div>
        <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar px-4 space-y-2">
          <NavItem active={view === 'Dashboard'} icon={LayoutDashboard} label="Dashboard" onClick={() => { setView('Dashboard'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Compute'} icon={Server} label="Instances" onClick={() => { setView('Compute'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Storage'} icon={HardDrive} label="Storage" onClick={() => { setView('Storage'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Sentinel'} icon={ShieldCheck} label="Sentinel AI" onClick={() => { setView('Sentinel'); setIsSidebarOpen(false); }} badge="AI" />
          <NavItem active={view === 'Analytics'} icon={BarChart3} label="Analytics" onClick={() => { setView('Analytics'); setIsSidebarOpen(false); }} />
          <NavItem active={view === 'Billing'} icon={CreditCard} label="Billing" onClick={() => { setView('Billing'); setIsSidebarOpen(false); }} />
          <div className="pt-4 mt-4 border-t border-slate-800/50">
            <NavItem active={view === 'Settings'} icon={Settings} label="System Config" onClick={() => { setView('Settings'); setIsSidebarOpen(false); }} />
          </div>
        </nav>
        <div className="p-6 border-t border-slate-800 bg-[#090d14]">
          <button onClick={() => setAuthenticated(false)} className="w-full flex items-center justify-center py-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all gap-3 border border-rose-500/20 shadow-lg shadow-rose-500/5">
            <LogOut size={14} /> Terminate
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className={`h-20 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 lg:px-10 z-50 transition-all duration-500 ${isGlobalOverload ? 'border-rose-500/40 bg-rose-950/20' : ''}`}>
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-6 p-2 bg-slate-800 rounded-xl text-slate-400"><Menu size={20} /></button>
            <div className="space-y-1">
              <h2 className={`text-lg font-black uppercase tracking-tighter italic ${isGlobalOverload ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{view}</h2>
              <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 uppercase tracking-[0.1em]">
                <Globe size={10} className="text-indigo-500" /> Distributed Node: <span className="text-indigo-400">US-EAST-01A</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-3 pl-4 lg:pl-8 border-l border-slate-800">
               <button onClick={() => { setView('Sentinel'); }} className={`p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-rose-400 transition-colors relative ${isGlobalOverload ? 'animate-bounce border-rose-500/30' : ''}`}>
                  <Radio size={18} />
               </button>
               <button onClick={() => setIsChatOpen(!isChatOpen)} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-indigo-400 transition-colors">
                  <MessageSquare size={18} />
               </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto space-y-10 relative z-10">
            {view === 'Dashboard' && <DashboardView data={graphData} nodes={nodes} setView={setView} />}
            {view === 'Compute' && <ComputeView nodes={nodes} addNode={addNode} />}
            {view === 'Storage' && <StorageView />}
            {view === 'Analytics' && <AnalyticsView />}
            {view === 'Billing' && <BillingView />}
            {view === 'Sentinel' && <SentinelView isAuditing={isAuditing} auditLog={auditLog} runAudit={runAudit} terminalRef={terminalRef} />}
            {view === 'Settings' && (
               <div className="max-w-2xl space-y-8 animate-in fade-in duration-500 pb-20">
                  <div className="space-y-2">
                     <h3 className="text-lg font-black text-white uppercase tracking-tighter">System Intelligence Config</h3>
                     <p className="text-xs text-slate-500 font-medium">Manage your neural bridge connections and security protocols.</p>
                  </div>

                  <div className="glass p-8 rounded-3xl border border-slate-800 space-y-8">
                     {/* Gemini API Key Section */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-400 mb-2">
                           <Key size={16} />
                           <label className="text-[10px] font-black uppercase tracking-widest">Gemini API Key</label>
                        </div>
                        <div className="flex gap-3">
                           <div className="relative flex-1">
                              <input 
                                type={showApiKey ? "text" : "password"} 
                                value={configApiKey}
                                onChange={(e) => setConfigApiKey(e.target.value)}
                                placeholder="Paste Neural Access Key..."
                                className="w-full bg-[#04060b] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 font-mono focus:border-indigo-500 focus:outline-none pr-10"
                              />
                              <button 
                                type="button"
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors"
                              >
                                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                           </div>
                           <button 
                            onClick={handleSaveKey}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${saveStatus ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'}`}
                           >
                             {saveStatus ? <CheckCircle size={14} /> : <Save size={14} />}
                             {saveStatus ? 'Key Locked' : 'Save Key'}
                           </button>
                        </div>
                        <p className="text-[9px] text-slate-600 font-mono italic">Keys are stored in local secure browser storage for session persistence.</p>
                     </div>

                     <div className="border-t border-slate-800 pt-6">
                        <div className="flex justify-between items-center mb-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Overload Threshold</label>
                           <span className="text-xs font-mono text-indigo-400">{overloadThreshold}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="95" 
                          value={overloadThreshold} 
                          onChange={(e) => setOverloadThreshold(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-900 rounded-full appearance-none cursor-pointer accent-indigo-500 mb-8" 
                        />
                        
                        <div className="space-y-4">
                           <SettingToggle label="Autonomous Recovery" sub="Automatically scale nodes when threshold is breached." active />
                           <SettingToggle label="Quantum Shielding" sub="Enable cryptographically hardened layer-2 tunnel." active={false} />
                        </div>
                     </div>
                  </div>
               </div>
            )}
          </div>
        </div>
      </main>

      {/* AI Assistant Chat Panel */}
      {isChatOpen && (
        <div className="fixed right-0 top-20 bottom-0 w-80 bg-[#0b0f19] border-l border-slate-800 z-[80] shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#090d14]">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-400"><Sparkles size={16} /></div>
               <span className="text-xs font-black text-white uppercase tracking-widest">Neural AI Core</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center py-10 space-y-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-2 text-indigo-500/50">
                    <ZapIcon size={24} />
                 </div>
                 <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Awaiting Command...</p>
                 <div className="space-y-2">
                    <button onClick={() => setChatInput("Are any nodes overloaded right now?")} className="w-full text-[9px] px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 transition-colors text-left text-slate-400">Any nodes overloaded?</button>
                    <button onClick={() => setChatInput("Summarize my current cluster status")} className="w-full text-[9px] px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 transition-colors text-left text-slate-400">Cluster Status Summary</button>
                 </div>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
               <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-2">
                     <RefreshCw size={12} className="text-indigo-500 animate-spin" />
                     <span className="text-[9px] font-mono text-slate-500 uppercase">Neural Processing...</span>
                  </div>
               </div>
            )}
          </div>
          <form onSubmit={handleAIChat} className="p-4 border-t border-slate-800 bg-[#090d14]">
            <div className="relative">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask AI about your cloud..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-indigo-500 outline-none pr-10"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-400 p-2">
                 <Zap size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const SettingToggle = ({ label, sub, active }: { label: string, sub: string, active?: boolean }) => {
  const [isOn, setIsOn] = useState(active);
  return (
    <div className="flex justify-between items-start group transition-all">
      <div className="space-y-1">
        <p className="text-xs font-black text-slate-200 uppercase tracking-tight">{label}</p>
        <p className="text-[9px] text-slate-500 font-medium leading-relaxed max-w-[400px]">{sub}</p>
      </div>
      <button onClick={() => setIsOn(!isOn)} className={`transition-colors duration-300 ${isOn ? 'text-indigo-500' : 'text-slate-700'}`}>
        {isOn ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
      </button>
    </div>
  );
};

const NavItem = ({ active, icon: Icon, label, onClick, badge }: any) => (
  <button onClick={onClick} className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all group relative ${active ? 'bg-indigo-600/10 text-indigo-400 shadow-[inset_0_0_15px_rgba(99,102,241,0.05)] border border-indigo-500/20' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30 border border-transparent'}`}>
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]"></div>}
    <Icon size={18} className={`mr-4 ${active ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'}`} />
    <span className="text-[10px] font-black uppercase tracking-[0.15em]">{label}</span>
    {badge && <span className="ml-auto text-[7px] font-black bg-indigo-500 text-white px-1.5 py-0.5 rounded uppercase tracking-widest shadow-[0_0_8px_rgba(99,102,241,0.4)]">{badge}</span>}
  </button>
);

export default App;