"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Calendar, ChevronDown, ArrowUpRight, ArrowDownRight, MoreHorizontal, Filter } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

// --- MOCK DATA ---
const chartData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const campaignData = [
  { name: 'Dubai Promo', status: 'Sent', sent: '12,403', open: '45%', click: '12%' },
  { name: 'UK Newsletter', status: 'Draft', sent: '-', open: '-', click: '-' },
  { name: 'Black Friday', status: 'Sending', sent: '5,000', open: '22%', click: '5%' },
];

// --- COMPONENTS ---

// 1. The Skeletal Loader (Shimmer Effect)
const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-xl border border-white/40 rounded-[28px] p-6 overflow-hidden relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full animate-shimmer" 
         style={{ transform: 'skewX(-20deg) translateX(-150%)' }} />
    <div className="space-y-4">
      <div className="h-4 bg-slate-200/50 rounded-full w-1/3" />
      <div className="h-8 bg-slate-200/50 rounded-full w-2/3" />
      <div className="h-32 bg-slate-200/50 rounded-3xl w-full mt-4" />
    </div>
  </div>
);

// 2. The Stat Capsule
const StatCard = ({ title, value, change, isPositive }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-40"
  >
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
      </div>
      <MoreHorizontal size={20} className="text-slate-400 cursor-pointer hover:text-slate-600" />
    </div>
    
    <div>
      <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
      <p className="text-sm text-slate-500 font-medium mt-1">
        <span className={isPositive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{change}</span> vs last month
      </p>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Simulate Data Fetching
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // 2.5s skeletal loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 h-screen overflow-y-auto p-4 lg:p-8 font-sans scrollbar-hide">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, Amogh</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Capsule */}
          <div className="hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/50 px-4 py-2.5 rounded-full shadow-sm focus-within:ring-2 ring-blue-500/20 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 w-48"
            />
          </div>

          {/* Action Buttons */}
          <button className="p-3 bg-white/60 backdrop-blur-md border border-white/50 rounded-full text-slate-600 hover:bg-white hover:text-blue-600 transition-colors shadow-sm relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
          
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-white/50 pl-2 pr-4 py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-white transition-colors">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full border-2 border-white" />
            <span className="text-sm font-bold text-slate-700">ParaPixel</span>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <AnimatePresence mode="wait">
        {loading ? (
          // --- LOADING STATE (SKELETONS) ---
          <motion.div 
            key="skeleton"
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonCard className="h-40" />
              <SkeletonCard className="h-40" />
              <SkeletonCard className="h-40" />
            </div>
            <div className="grid grid-cols-3 gap-6 h-96">
               <SkeletonCard className="col-span-2 h-full" />
               <SkeletonCard className="col-span-1 h-full" />
            </div>
          </motion.div>
        ) : (
          // --- REAL DASHBOARD ---
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* 1. Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Revenue" value="$24,500" change="+12.5%" isPositive={true} />
              <StatCard title="Active Campaigns" value="14" change="+2" isPositive={true} />
              <StatCard title="Avg. Open Rate" value="45.2%" change="-1.4%" isPositive={false} />
            </div>

            {/* 2. Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Chart (Left) */}
              <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white/50 rounded-[32px] p-6 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Engagement Overview</h3>
                    <div className="flex gap-2">
                        <button className="text-xs font-bold px-3 py-1 bg-white rounded-full shadow-sm text-slate-700">Weekly</button>
                        <button className="text-xs font-medium px-3 py-1 hover:bg-white/50 rounded-full text-slate-500">Monthly</button>
                    </div>
                 </div>
                 <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Side Card (Right) - Recent Campaigns */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[32px] p-6 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-800 mb-4">Recent Campaigns</h3>
                <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  {campaignData.map((campaign, i) => (
                    <div key={i} className="group p-3 hover:bg-white rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-blue-100 hover:shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                         <span className="font-bold text-sm text-slate-800">{campaign.name}</span>
                         <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                           ${campaign.status === 'Sent' ? 'bg-green-100 text-green-600' : 
                             campaign.status === 'Draft' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}
                         `}>
                           {campaign.status}
                         </span>
                      </div>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span>Sent: <b className="text-slate-700">{campaign.sent}</b></span>
                        <span>Open: <b className="text-slate-700">{campaign.open}</b></span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                  View All Campaigns
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}