"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, Construction, Rocket } from "lucide-react";
import { motion } from "framer-motion";

// Inner component to safely use search params
const ComingSoonContent = () => {
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature") || "Feature";
  const router = useRouter();

  return (
    <div className="flex-1 h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-center font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 backdrop-blur-2xl border border-white/60 p-12 rounded-[40px] shadow-2xl max-w-lg w-full relative z-10"
      >
        <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-500/30">
           <Construction size={40} />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">{feature}</h1>
        <p className="text-slate-500 mb-8 text-lg">
          We are currently building this module. <br/> Stay tuned for updates!
        </p>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
            <Rocket size={18} /> Notify Me
          </button>
        </div>
      </motion.div>

      <p className="absolute bottom-8 text-slate-400 text-sm font-medium">Nanis Dashboard v1.0.0 • Demo Build</p>
    </div>
  );
};

export default function ComingSoonPage() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      {/* Suspense boundary needed for useSearchParams */}
      <Suspense fallback={<div>Loading...</div>}>
         <ComingSoonContent />
      </Suspense>
    </div>
  );
}