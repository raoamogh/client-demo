"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { Check, ArrowRight, LayoutDashboard, Mail, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function CampaignSentPage() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 h-full relative font-sans flex items-center justify-center p-6 overflow-hidden">
        
        {/* Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 max-w-md w-full"
        >
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 mb-8">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Check size={48} className="text-white stroke-[3]" />
            </motion.div>
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Campaign Sent!</h1>
            <p className="text-slate-500">Your campaign is on its way to your audience.</p>
          </div>

          {/* Summary Card */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-xl shadow-slate-200/50 mb-8">
             <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/50 border border-white">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Mail size={18} />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campaign</p>
                      <p className="text-sm font-bold text-slate-800 truncate">Dubai Promotion</p>
                   </div>
                </div>

                <div className="flex gap-3">
                   <div className="flex-1 flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-white">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                         <Users size={14} />
                      </div>
                      <div className="min-w-0">
                         <p className="text-[10px] font-bold text-slate-400">Recipients</p>
                         <p className="text-xs font-bold text-slate-800">5,353</p>
                      </div>
                   </div>
                   <div className="flex-1 flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-white">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                         <Clock size={14} />
                      </div>
                      <div className="min-w-0">
                         <p className="text-[10px] font-bold text-slate-400">Time</p>
                         <p className="text-xs font-bold text-slate-800">Now</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/" legacyBehavior>
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                <LayoutDashboard size={18} />
                Navigate to Dashboard
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
            </Link>
            
            <Link href="/campaigns/new" legacyBehavior>
              <button className="w-full py-4 bg-white text-slate-600 rounded-2xl font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-colors">
                Create Another Campaign
              </button>
            </Link>
          </div>

        </motion.div>
      </main>
    </div>
  );
}