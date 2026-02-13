
import React from 'react';
import { TrendingUp, TrendingDown, Server, Database, Activity, Cpu } from 'lucide-react';

interface MetricProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}

const MetricCard: React.FC<MetricProps> = ({ label, value, change, isPositive, icon: Icon, color }) => (
  <div className="bg-[#161b2c] p-6 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all shadow-xl group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-20 group-hover:scale-110 transition-transform`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div className={`flex items-center text-xs font-bold px-2 py-1 rounded bg-slate-900/50 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
        {change}
      </div>
    </div>
    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-2xl font-black text-slate-100">{value}</h3>
  </div>
);

const MetricsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard 
        label="Total Data Throughput" 
        value="69.42 TB" 
        change="+12.4%" 
        isPositive={false} 
        icon={Database} 
        color="bg-indigo-500" 
      />
      <MetricCard 
        label="Cluster Nodes" 
        value="1,248" 
        change="+2.3%" 
        isPositive={true} 
        icon={Server} 
        color="bg-cyan-500" 
      />
      <MetricCard 
        label="Aggregate CPU" 
        value="42.8%" 
        change="-5.2%" 
        isPositive={true} 
        icon={Cpu} 
        color="bg-emerald-500" 
      />
      <MetricCard 
        label="Secure Uptime" 
        value="99.998%" 
        change="+0.001%" 
        isPositive={true} 
        icon={Activity} 
        color="bg-amber-500" 
      />
    </div>
  );
};

export default MetricsGrid;
