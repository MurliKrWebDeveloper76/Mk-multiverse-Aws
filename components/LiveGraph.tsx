
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateInitialData = () => {
  const data = [];
  const now = new Date();
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      load: Math.floor(Math.random() * 35) + 40, // Higher base for "Red" load
      traffic: Math.floor(Math.random() * 30) + 20, // Lower base for "Green" traffic
    });
  }
  return data;
};

const LiveGraph: React.FC = () => {
  const [data, setData] = useState(generateInitialData());

  useEffect(() => {
    // Faster updates (every 2 seconds) for a "live" feel
    const interval = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1)];
        next.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          load: Math.floor(Math.random() * 45) + 35,
          traffic: Math.floor(Math.random() * 40) + 25,
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#161b2c] p-6 rounded-xl border border-slate-800 shadow-xl h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 uppercase tracking-wider">Real-time Cluster Flux</h3>
          <p className="text-xs text-slate-500 font-mono">ENCRYPTED DATA STREAM: 69.42 TB/DAY</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-rose-500 rounded-full mr-2 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
            <span className="text-xs font-semibold text-rose-400">SERVER LOAD (RED)</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-emerald-500 rounded-full mr-2 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            <span className="text-xs font-semibold text-emerald-400">NETWORK TRAFFIC (GREEN)</span>
          </div>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #334155', 
                borderRadius: '12px', 
                fontSize: '12px',
                color: '#f8fafc',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ padding: '2px 0' }}
              cursor={{ stroke: '#334155', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="load" 
              stroke="#f43f5e" 
              fillOpacity={1} 
              fill="url(#colorLoad)" 
              strokeWidth={3} 
              isAnimationActive={false}
            />
            <Area 
              type="monotone" 
              dataKey="traffic" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorTraffic)" 
              strokeWidth={3} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiveGraph;
