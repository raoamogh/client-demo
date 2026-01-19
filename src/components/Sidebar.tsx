"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  LayoutDashboard, Inbox, PieChart, LayoutTemplate, Users, Workflow, FolderOpen, 
  Mail, Globe, GitFork, Smartphone, Rss, Share2, FlaskConical,
  Settings, HelpCircle, Folder, Plus, Crown, ChevronDown
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. PORTAL TOOLTIP ---
const PortalTooltip = ({ rect, text }: { rect: DOMRect | null, text: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  if (!mounted || !rect || !text) return null;

  const top = rect.top + (rect.height / 2);
  const left = rect.right + 16;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, x: -10, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{ position: "fixed", top: top, left: left, transform: "translateY(-50%)", zIndex: 9999, marginTop: "-50px" }}
      className="w-64 p-3 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] pointer-events-none"
    >
       <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-white/90 rotate-45 border-l border-b border-white/60 -translate-y-1/2" />
       <div className="text-[11px] leading-relaxed text-slate-600 font-medium relative z-10">{text}</div>
    </motion.div>,
    document.body
  );
};

// --- 2. NAV ITEM (FIXED: Removed legacyBehavior and inner div) ---
const NavItem = ({ 
  icon: Icon, 
  label, 
  href = "#", 
  hasDot = false, 
  count = 0, 
  tooltipText,
  onHover 
}: any) => {
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const isActive = 
     (href === "/" && pathname === "/") ||
     (href !== "/" && pathname?.startsWith(href)) ||
     (pathname === "/coming-soon" && searchParams.get("feature") === label);

  return (
    <Link 
      href={href}
      className={clsx(
        "group flex items-center gap-3 px-4 py-2 mx-1 cursor-pointer transition-all duration-200 rounded-full relative",
        isActive 
          ? "bg-white text-slate-900 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]" 
          : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
      )}
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onHover(rect, tooltipText);
      }}
      onMouseLeave={() => onHover(null, null)}
    >
      <Icon 
        size={18} 
        strokeWidth={isActive ? 2.5 : 2} 
        className={clsx(isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700")} 
      />
      <span className={clsx("text-[13px]", isActive ? "font-bold" : "font-medium")}>{label}</span>
      
      <div className="ml-auto flex items-center gap-2">
        {hasDot && (
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]"></span>
          </div>
        )}
        {count > 0 && (
          <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 bg-white/50">
            {count}
          </span>
        )}
      </div>
    </Link>
  );
};

const SidebarGroup = ({ title, children, className, flex = false }: { title?: string, children: React.ReactNode, className?: string, flex?: boolean }) => (
  <div className={clsx("bg-white/40 backdrop-blur-xl border border-white/40 flex flex-col p-2 rounded-[28px]", flex && "min-h-0 shrink", className)}>
    {title && <div className="text-[11px] font-bold text-slate-500 px-4 mb-2 mt-1">{title}</div>}
    <div className={clsx("space-y-0.5", flex && "overflow-y-auto scrollbar-hide px-1")}>
      {children}
    </div>
  </div>
);

// --- 3. MAIN SIDEBAR ---
export default function Sidebar() {
  const [activeTooltip, setActiveTooltip] = useState<{ rect: DOMRect | null, text: React.ReactNode | null }>({ rect: null, text: null });

  const handleHover = (rect: DOMRect | null, text: React.ReactNode | null) => {
    setActiveTooltip({ rect, text });
  };

  return (
    <>
      <AnimatePresence>
        {activeTooltip.rect && activeTooltip.text && (
          <PortalTooltip rect={activeTooltip.rect} text={activeTooltip.text} />
        )}
      </AnimatePresence>

      <aside className="w-[280px] h-screen max-h-screen flex flex-col gap-3 p-4 overflow-hidden shrink-0 z-20 font-sans selection:bg-brand-100">
        
        {/* Header */}
        <Link href="/" className="bg-white/40 backdrop-blur-xl rounded-full p-2 border border-white/40 flex items-center gap-3 pr-5 shrink-0 cursor-pointer hover:bg-white/60 transition-colors">
          <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg shadow-slate-900/20 shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">Nanis</span>
          <span className="text-[10px] bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full font-bold ml-auto border border-orange-100">Pro</span>
        </Link>

        {/* Middle Section */}
        <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
          <SidebarGroup title="General" flex>
            <NavItem onHover={handleHover} href="/" icon={LayoutDashboard} label="Dashboard" tooltipText="Overview of your campaign performance." />
            
            <NavItem onHover={handleHover} href="/coming-soon?feature=Inbox" icon={Inbox} label="Inbox" hasDot tooltipText="View all incoming messages and alerts." />
            <NavItem onHover={handleHover} href="/coming-soon?feature=Analytics" icon={PieChart} label="Analytics" tooltipText="Detailed reports and conversion metrics." />
            <NavItem onHover={handleHover} href="/coming-soon?feature=Templates" icon={LayoutTemplate} label="Templates" tooltipText="Manage your email and page designs." />
            <NavItem onHover={handleHover} href="/coming-soon?feature=Contacts" icon={Users} label="Contacts" tooltipText="Organize subscribers and segments." />
            <NavItem onHover={handleHover} href="/coming-soon?feature=Integrations" icon={Workflow} label="Integrations" tooltipText="Manage third-party app connections." />
            <NavItem onHover={handleHover} href="/coming-soon?feature=File Manager" icon={FolderOpen} label="File Manager" tooltipText="Access your uploaded media assets." />
          </SidebarGroup>

          <SidebarGroup title="Campaigns" flex>
            <NavItem onHover={handleHover} href="/campaigns/email" icon={Mail} label="Email" tooltipText="Create and schedule email campaigns." />
            
            <NavItem 
              onHover={handleHover}
              href="/coming-soon?feature=Website"
              icon={Globe} 
              label="Website" 
              tooltipText={<span>Send targeted emails to engage your audience. <br/><span className="text-slate-400 italic mt-1 block">Example: Monthly newsletter or product announcement.</span></span>}
            />
            <NavItem onHover={handleHover} href="/coming-soon?feature=Automation" icon={GitFork} label="Automation" tooltipText="Configure workflows and triggers." />
            <NavItem onHover={handleHover} href="/coming-soon?feature=SMS" icon={Smartphone} label="SMS" tooltipText="Send text message campaigns." />
            <NavItem onHover={handleHover} href="/coming-soon?feature=RSS" icon={Rss} label="RSS" tooltipText="Manage RSS feed integrations." />
            <NavItem onHover={handleHover} href="/coming-soon?feature=Social Media" icon={Share2} label="Social Media" tooltipText="Schedule posts for social platforms." />
            <NavItem onHover={handleHover} href="/coming-soon?feature=AB Testing" icon={FlaskConical} label="A/B Testing" tooltipText="Experiment with different variations." />
          </SidebarGroup>

          <SidebarGroup className="shrink-0">
              <div className="flex items-center justify-between px-4 mb-1 cursor-pointer group">
                  <div className="text-[11px] font-bold text-slate-500">Folders</div>
                  <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
              <NavItem onHover={handleHover} href="/coming-soon?feature=Dubai Event" icon={Folder} label="Dubai Event" count={3} tooltipText="Campaigns related to Dubai Event." />
              <NavItem onHover={handleHover} href="/coming-soon?feature=UK Promotions" icon={Folder} label="UK Promotions" count={3} tooltipText="Campaigns for UK market." />
              <div className="flex items-center gap-3 px-5 py-2 mt-1 cursor-pointer text-brand-600 hover:bg-white/40 rounded-full transition-colors opacity-90 hover:opacity-100">
                  <Plus size={16} />
                  <span className="text-[13px] font-bold">New Folders</span>
              </div>
          </SidebarGroup>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-3 shrink-0">
          <div className="bg-white/60 backdrop-blur-xl rounded-[28px] p-4 border border-white/50 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                 <div>
                   <h4 className="font-bold text-[13px] text-slate-900">Salesync LLC</h4>
                   <p className="text-[10px] text-slate-500 font-medium">Free Trial Version</p>
                 </div>
                 <span className="text-[10px] bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                   <div className="bg-orange-500 rounded-full p-[2px]"><Crown size={6} fill="white" color="white" /></div> Pro
                 </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mb-1 relative overflow-hidden">
                 <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-300 rounded-l-full" style={{ width: '70%' }}>
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)' }} />
                   <div className="absolute top-0 right-0 h-full w-[2px] bg-slate-600/80 shadow-[0_0_4px_rgba(0,0,0,0.2)]" />
                 </div>
              </div>
              <p className="text-[11px] text-slate-800 font-bold mb-3">4 days left</p>
              <Link href="/coming-soon?feature=Upgrade" className="w-full bg-brand-600 hover:bg-brand-700 text-white text-[11px] py-2.5 rounded-xl font-semibold shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2">
                <Crown size={14} fill="currentColor" />
                Upgrade to Pro
              </Link>
          </div>

          <SidebarGroup>
             <NavItem onHover={handleHover} href="/coming-soon?feature=Settings" icon={Settings} label="Settings" tooltipText="Manage account and preferences." />
             <NavItem onHover={handleHover} href="/coming-soon?feature=Help" icon={HelpCircle} label="Help & Support" tooltipText="Contact support and view docs." />
          </SidebarGroup>
        </div>
      </aside>
    </>
  );
}