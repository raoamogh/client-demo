"use client";

import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { 
  Search, Bell, Plus, UserPlus, FileEdit, CheckCircle2, XCircle, 
  Clock, Pause, Play, Send, User, Users, X, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
type Metric = { pct: number; val: string };
type CampaignStatus = "Scheduled" | "Draft" | "Published" | "Sending" | "Suspended";

type Campaign = {
  id: number;
  title: string;
  author: string;
  status: CampaignStatus;
  scheduleDate?: string;
  stats: { leads: string; excluded: string };
  metrics: { sent: Metric; open: Metric; click: Metric; unsub: Metric; bounce: Metric };
};

// --- MOCK DATA ---
const initialCampaigns: Campaign[] = [
  {
    id: 1,
    title: "New Year 2025 Specials Offer",
    author: "Sinan Chengoli",
    status: "Scheduled",
    scheduleDate: "July 19, 2025 at 8:00 PM GMT",
    stats: { leads: "43,534", excluded: "75" },
    metrics: { sent: { pct: 0, val: "-" }, open: { pct: 0, val: "-" }, click: { pct: 0, val: "-" }, unsub: { pct: 0, val: "-" }, bounce: { pct: 0, val: "-" } }
  },
  {
    id: 2,
    title: "Black Friday Early Access",
    author: "Sinan Chengoli",
    status: "Draft",
    stats: { leads: "12,050", excluded: "12" },
    metrics: { sent: { pct: 0, val: "-" }, open: { pct: 0, val: "-" }, click: { pct: 0, val: "-" }, unsub: { pct: 0, val: "-" }, bounce: { pct: 0, val: "-" } }
  },
  {
    id: 3,
    title: "Product Launch Announcement",
    author: "Sinan Chengoli",
    status: "Published",
    stats: { leads: "43,534", excluded: "75" },
    metrics: { sent: { pct: 56, val: "5,535" }, open: { pct: 24, val: "4,533" }, click: { pct: 84, val: "1,443" }, unsub: { pct: 6, val: "42" }, bounce: { pct: 2, val: "9" } }
  },
  {
    id: 4,
    title: "Monthly Newsletter - July",
    author: "Sinan Chengoli",
    status: "Sending",
    stats: { leads: "22,100", excluded: "40" },
    metrics: { sent: { pct: 12, val: "1,200" }, open: { pct: 5, val: "100" }, click: { pct: 2, val: "20" }, unsub: { pct: 0, val: "0" }, bounce: { pct: 0, val: "0" } }
  },
  {
    id: 5,
    title: "Winback Campaign",
    author: "Sinan Chengoli",
    status: "Suspended",
    stats: { leads: "8,400", excluded: "150" },
    metrics: { sent: { pct: 45, val: "3,780" }, open: { pct: 15, val: "560" }, click: { pct: 5, val: "120" }, unsub: { pct: 1, val: "12" }, bounce: { pct: 1, val: "8" } }
  },
  {
    id: 6,
    title: "Q3 Roadmap Update",
    author: "Sinan Chengoli",
    status: "Published",
    stats: { leads: "15,200", excluded: "10" },
    metrics: { sent: { pct: 98, val: "14,800" }, open: { pct: 45, val: "6,660" }, click: { pct: 12, val: "800" }, unsub: { pct: 2, val: "30" }, bounce: { pct: 0, val: "5" } }
  },
  {
    id: 7,
    title: "Flash Sale Alert",
    author: "Sinan Chengoli",
    status: "Sending",
    stats: { leads: "50,000", excluded: "200" },
    metrics: { sent: { pct: 30, val: "15,000" }, open: { pct: 10, val: "1,500" }, click: { pct: 5, val: "750" }, unsub: { pct: 0, val: "10" }, bounce: { pct: 0, val: "2" } }
  },
];

// --- TOAST COMPONENT ---
const ToastContainer = ({ toasts, removeToast }: { toasts: any[], removeToast: (id: number) => void }) => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 pointer-events-auto min-w-[200px]"
        >
          {toast.icon}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-auto text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status, date, onAction }: { status: string; date?: string; onAction?: () => void }) => {
  switch (status) {
    case "Scheduled":
      return (
        <div className="flex items-center gap-2 text-[11px] font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full w-fit">
          <Clock size={12} />
          <span>Scheduled at {date}</span>
        </div>
      );
    case "Draft":
      return (
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full w-fit border border-slate-200/60">
          <FileEdit size={12} />
          <span>Draft</span>
        </div>
      );
    case "Published":
      return (
        <div className="flex items-center gap-2 text-[11px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit border border-green-100">
          <CheckCircle2 size={12} />
          <span>Published</span>
        </div>
      );
    case "Sending":
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-[11px] font-bold text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full w-fit border border-amber-100">
            <Send size={12} />
            <span>Sending...</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onAction && onAction(); }}
            className="flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-500/30"
          >
            <Pause size={10} fill="currentColor" /> Pause
          </button>
        </div>
      );
    case "Suspended":
      return (
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-2 text-[11px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full w-fit border border-red-100">
             <XCircle size={12} />
             <span>Suspended</span>
           </div>
           <button 
            onClick={(e) => { e.stopPropagation(); onAction && onAction(); }}
            className="flex items-center gap-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-slate-50 active:scale-95 transition-all"
          >
            <Play size={10} fill="currentColor" /> Resume
          </button>
        </div>
      );
    default:
      return null;
  }
};

const MetricItem = ({ label, pct, val }: { label: string; pct: number; val: string }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold text-slate-700">{val === "-" ? "-" : `${pct}%`}</span>
      <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-500 font-bold shadow-sm">
        {val}
      </span>
    </div>
    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{label}</div>
  </div>
);

// --- SKELETON LOADER ---
const EmailRowSkeleton = () => (
  <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] p-4 relative overflow-hidden h-[100px]">
    <div 
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full z-10 animate-shimmer"
      style={{ transform: 'skewX(-20deg) translateX(-150%)' }}
    />
    <div className="flex items-center gap-6 h-full">
      <div className="w-28 h-16 bg-white/50 rounded-xl" />
      <div className="flex-1 space-y-3">
         <div className="h-4 bg-white/50 rounded-full w-1/3" />
         <div className="h-3 bg-white/50 rounded-full w-1/4" />
      </div>
    </div>
  </div>
);

export default function EmailCampaigns() {
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [toasts, setToasts] = useState<{ id: number; message: string; icon: React.ReactNode }[]>([]);

  // Simulate Initial Load
  useEffect(() => {
    const timer = setTimeout(() => {
        setCampaigns(initialCampaigns);
        setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- ACTIONS ---

  const addToast = (message: string, icon: React.ReactNode = <CheckCircle2 size={16} className="text-green-400" />) => {
    // FIX: Add Math.random() to ensure unique ID
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, icon }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    setCampaigns(prev => prev.map(c => {
        if (c.id === id) {
            const newStatus = currentStatus === "Sending" ? "Suspended" : "Sending";
            addToast(
                newStatus === "Suspended" ? "Campaign Paused" : "Campaign Resumed", 
                newStatus === "Suspended" ? <Pause size={16} className="text-amber-400" /> : <Play size={16} className="text-blue-400" />
            );
            return { ...c, status: newStatus };
        }
        return c;
    }));
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
        const matchesTab = activeTab === "All" || c.status === activeTab;
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });
  }, [campaigns, activeTab, searchQuery]);

  // Dynamic Tab Counts
  const counts = useMemo(() => {
    const map = { All: campaigns.length, Draft: 0, Published: 0, Scheduled: 0, Sending: 0, Suspended: 0 };
    campaigns.forEach(c => { if (map[c.status] !== undefined) map[c.status]++; });
    return map;
  }, [campaigns]);

  return (
    <div className="flex w-full h-screen overflow-hidden relative">
      <Sidebar />
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6 font-sans scrollbar-hide">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Email</h1>

          <div className="flex items-center gap-3">
            {/* Interactive Search */}
            <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/60 px-4 py-2.5 rounded-full shadow-sm w-80 focus-within:ring-2 ring-blue-500/20 transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search Campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400 w-full font-medium"
              />
              {searchQuery && <button onClick={() => setSearchQuery("")}><X size={14} className="text-slate-400 hover:text-slate-600"/></button>}
            </div>

            <button 
                onClick={() => addToast("No new notifications", <Bell size={16} />)}
                className="p-2.5 bg-white rounded-full text-slate-500 hover:text-slate-800 shadow-sm border border-slate-100 transition-colors active:scale-95"
            >
               <Bell size={20} />
            </button>

            <div className="relative group cursor-pointer">
               <img src="https://i.pravatar.cc/150?img=12" className="w-10 h-10 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-105" alt="Profile" />
               <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">✓</div>
            </div>

            <button 
                onClick={() => addToast("Invitation link copied!", <UserPlus size={16} />)}
                className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full text-slate-700 text-sm font-bold shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
            >
              <User size={18} /> Invite
            </button>
            <button 
                onClick={() => {
                  addToast("Opening Campaign Wizard...", <Loader2 size={16} className="animate-spin" />);
                  window.location.href = "/campaigns/new";
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
            >
              <Plus size={18} /> Email Campaign
            </button>
          </div>
        </header>

        {/* TABS */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {['All', 'Draft', 'Published', 'Scheduled', 'Sending', 'Suspended'].map((tab) => {
            const isActive = tab === activeTab;
            // @ts-ignore
            const count = counts[tab] || 0;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-2
                  ${isActive
                    ? 'bg-white text-slate-900 border-slate-200 shadow-sm scale-105'
                    : 'bg-transparent text-slate-500 border-transparent hover:bg-white/40'}
                `}
              >
                {tab}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-slate-100' : 'bg-white/50'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="space-y-4 pb-10">
          <AnimatePresence mode="popLayout">
            {loading ? (
               <motion.div key="skeleton" exit={{ opacity: 0 }} className="space-y-4">
                  {[1,2,3,4,5].map(i => <EmailRowSkeleton key={i} />)}
               </motion.div>
            ) : filteredCampaigns.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-slate-400"
                >
                    <Search size={48} className="mb-4 opacity-50" />
                    <p className="font-medium">No campaigns found</p>
                </motion.div>
            ) : (
               filteredCampaigns.map((camp) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={camp.id}
                  onClick={() => addToast(`Viewing ${camp.title}`)}
                  className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[24px] p-5 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex flex-col lg:flex-row gap-6 items-center">
                    
                    {/* LEFT */}
                    <div className="flex gap-5 w-full lg:w-[32%] shrink-0">
                      <div className="w-28 h-20 bg-white rounded-xl border border-slate-200 shrink-0 relative overflow-hidden group-hover:border-blue-200 transition-colors shadow-sm">
                         <div className="absolute inset-0 flex flex-col items-center justify-center p-2 opacity-50">
                             <div className="w-full h-2 bg-slate-100 rounded-full mb-2" />
                             <div className="w-2/3 h-2 bg-slate-100 rounded-full mb-auto" />
                             <div className="w-1/2 h-8 bg-blue-50 rounded-md" />
                         </div>
                      </div>

                      <div className="flex flex-col justify-center gap-1.5 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate pr-2">
                           🥳 {camp.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Created by <span onClick={(e) => { e.stopPropagation(); addToast("Opening Profile..."); }} className="underline decoration-slate-300 cursor-pointer hover:text-blue-600">{camp.author}</span>
                        </p>
                        <div className="mt-0.5">
                          <StatusBadge 
                            status={camp.status} 
                            date={camp.scheduleDate} 
                            onAction={() => handleToggleStatus(camp.id, camp.status)} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* MIDDLE */}
                    <div className="hidden xl:flex flex-col gap-2 w-[15%] border-l border-slate-200/50 pl-6 py-1 shrink-0">
                      <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                        <span className="flex items-center gap-1.5 text-slate-500 font-bold underline decoration-dotted"><Users size={12} /> Leads For Nanis</span>
                        <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-slate-100 shadow-sm text-[10px]">{camp.stats.leads}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                        <span className="flex items-center gap-1.5 text-slate-500 font-bold underline decoration-dotted"><UserPlus size={12} /> Excluded Contacts</span>
                        <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-slate-100 shadow-sm text-[10px]">{camp.stats.excluded}</span>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-5 gap-y-4 gap-x-2 border-l border-slate-200/50 pl-6 py-1">
                      <MetricItem label="Email Sent" pct={camp.metrics.sent.pct} val={camp.metrics.sent.val} />
                      <MetricItem label="Opens" pct={camp.metrics.open.pct} val={camp.metrics.open.val} />
                      <MetricItem label="Clicks" pct={camp.metrics.click.pct} val={camp.metrics.click.val} />
                      <MetricItem label="Unsubscribed" pct={camp.metrics.unsub.pct} val={camp.metrics.unsub.val} />
                      <MetricItem label="Bounces" pct={camp.metrics.bounce.pct} val={camp.metrics.bounce.val} />
                    </div>

                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
