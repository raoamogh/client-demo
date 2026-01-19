"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import {
  ArrowLeft,
  Send,
  Check,
  Clock,
  Plus,
  Edit2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layout,
  Calendar as CalendarIcon,
  User,
  Users,
  PenLine,
  Mail,
  X,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import clsx from "clsx";
import { useRouter } from "next/navigation"; // Import Router

// --- TYPES & INTERFACES ---
type StepId =
  | "name"
  | "sender"
  | "recipients"
  | "subject"
  | "template"
  | "time";

interface Step {
  id: StepId;
  title: string;
  description: string;
  icon: React.ElementType;
}

// --- CONFIG ---
const STEPS: Step[] = [
  {
    id: "name",
    title: "Campaign Name",
    description: "Give your campaign a name",
    icon: PenLine,
  },
  {
    id: "sender",
    title: "Sender",
    description: "Who is sending this email campaign?",
    icon: User,
  },
  {
    id: "recipients",
    title: "Recipients",
    description: "The people who receive your campaign",
    icon: PenLine,
  },
  {
    id: "subject",
    title: "Subjects",
    description: "Add a subject line for this campaign",
    icon: PenLine,
  },
  {
    id: "template",
    title: "Template",
    description: "Design the content for your email",
    icon: Layout,
  },
  {
    id: "time",
    title: "Send time",
    description: "When should we send this campaign?",
    icon: CalendarIcon,
  },
];

// --- CUSTOM DATE PICKER COMPONENT ---
const CustomDatePicker = ({
  selectedDate,
  onSelect,
  onClose,
}: {
  selectedDate: Date;
  onSelect: (d: Date) => void;
  onClose: () => void;
}) => {
  const [viewDate, setViewDate] = useState(selectedDate);

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();
  const startDay = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1,
  ).getDay();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const changeMonth = (delta: number) => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1),
    );
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onSelect(newDate);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-50 w-64 select-none"
    >
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            changeMonth(-1);
          }}
          className="p-1 hover:bg-slate-50 rounded-full text-slate-500"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-slate-700">
          {viewDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            changeMonth(1);
          }}
          className="p-1 hover:bg-slate-50 rounded-full text-slate-500"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span
            key={d}
            className="text-[10px] font-bold text-slate-400 uppercase"
          >
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const isSelected =
            day === selectedDate.getDate() &&
            viewDate.getMonth() === selectedDate.getMonth() &&
            viewDate.getFullYear() === selectedDate.getFullYear();

          return (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                handleDayClick(day);
              }}
              className={clsx(
                "h-8 w-8 flex items-center justify-center rounded-full text-xs font-medium cursor-pointer transition-colors",
                isSelected
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-700 hover:bg-blue-50",
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// --- CUSTOM TIME PICKER COMPONENT ---
const CustomTimePicker = ({
  selectedTime,
  onSelect,
  onClose,
}: {
  selectedTime: string;
  onSelect: (t: string) => void;
  onClose: () => void;
}) => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const date = new Date();
      date.setHours(i, j);
      times.push(
        date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 w-full max-h-60 overflow-y-auto scrollbar-thin"
    >
      {times.map((t) => (
        <div
          key={t}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(t);
            onClose();
          }}
          className={clsx(
            "px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center justify-between",
            t === selectedTime
              ? "bg-blue-50 text-blue-600"
              : "text-slate-700 hover:bg-slate-50",
          )}
        >
          {t}
          {t === selectedTime && <Check size={14} />}
        </div>
      ))}
    </motion.div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function CreateCampaignPage() {
  const router = useRouter(); // Initialize Router
  const [loading, setLoading] = useState(true);

  // Steps State
  const [activeStep, setActiveStep] = useState<StepId | null>("name");
  const [completedSteps, setCompletedSteps] = useState<Record<string, string>>(
    {},
  );

  // Data State
  const [formData, setFormData] = useState({
    name: "Dubai Promotion",
    sender: "sinan@promotion.com",
    recipients: "Based in Dubai (5,353) · Excluded: 535",
    subject: "👋 New year 202... & Happy New Year...",
    template: "Modern SaaS Template",
    date: new Date("2026-05-14"),
    time: "6:30 PM",
  });

  // UI Toggles
  const [senderDropdownOpen, setSenderDropdownOpen] = useState(false);
  const [excludeExpanded, setExcludeExpanded] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const [sendType, setSendType] = useState<"schedule" | "timezone" | "now">(
    "schedule",
  );

  // Recipient & Country Tags
  const [recipientTags, setRecipientTags] = useState([
    { label: "Based in dubai", count: "4,533" },
    { label: "UK", count: "4,533" },
    { label: "New Users", count: "4,533" },
    { label: "Subscribers", count: "4,533" },
  ]);
  const [countryTags, setCountryTags] = useState([
    { name: "United Kingdom", flag: "🇬🇧", count: "4,533" },
    { name: "India", flag: "🇮🇳", count: "4,533" },
    { name: "United Arab Emirates", flag: "🇦🇪", count: "4,533" },
    { name: "Italy", flag: "🇮🇹", count: "4,533" },
  ]);
  const [toggles, setToggles] = useState({
    country: true,
    lists: false,
    unsub: false,
    bounced: false,
    inactive: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- ACTIONS ---
  const handleSave = (e: React.MouseEvent, id: StepId) => {
    e.stopPropagation();
    const displayVal =
      id === "time"
        ? `${formData.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at ${formData.time}`
        : (formData[id as keyof typeof formData] as string);

    setCompletedSteps((prev) => ({ ...prev, [id]: displayVal || "Completed" }));

    const currentIndex = STEPS.findIndex((s) => s.id === id);
    if (currentIndex < STEPS.length - 1)
      setActiveStep(STEPS[currentIndex + 1].id);
    else setActiveStep(null);
  };

  const toggleStep = (id: StepId) => {
    if (activeStep !== id) setActiveStep(id);
  };

  // Helper Toggle Component
  const ToggleSwitch = ({
    isOn,
    onToggle,
  }: {
    isOn: boolean;
    onToggle: () => void;
  }) => (
    <div
      onClick={onToggle}
      className={clsx(
        "w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out relative flex items-center shadow-inner",
        isOn ? "bg-blue-600" : "bg-slate-200",
      )}
    >
      <motion.div
        className="w-5 h-5 bg-white rounded-full shadow-md"
        animate={{ x: isOn ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  );

  return (
    <div
      className="flex w-full h-screen overflow-hidden"
      onClick={() => {
        setDatePickerOpen(false);
        setTimePickerOpen(false);
        setSenderDropdownOpen(false);
      }}
    >
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto p-6 font-sans scrollbar-hide relative bg-[#F3EBF6]/30">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8 max-w-4xl mx-auto pt-4">
          <button 
            className="flex items-center gap-2 text-slate-600 font-bold bg-white px-4 py-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors text-sm" 
            onClick={() => router.back()} // Use router.back()
          >
            <ArrowLeft size={16} /> Save Draft
          </button>
          <h1 className="text-2xl font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">
            Create New Campaign {/* Corrected typo */}
          </h1>
          <button 
            onClick={() => router.push("/campaigns/sent")} // Navigate to Success Page
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all text-sm"
          >
            <Send size={16} /> Send
          </button>
        </header>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto mt-8 space-y-4"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-white/50 rounded-[24px] animate-pulse"
                />
              ))}
            </motion.div>
          ) : (
            <LayoutGroup>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto space-y-3 pb-20"
              >
                {STEPS.map((step) => {
                  const isActive = activeStep === step.id;
                  const isCompleted = !!completedSteps[step.id];
                  const value = completedSteps[step.id];

                  return (
                    <motion.div
                      layout
                      key={step.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStep(step.id);
                      }}
                      className={clsx(
                        "rounded-[24px] transition-all duration-300 overflow-visible relative cursor-pointer",
                        isActive
                          ? "bg-[#EBF3FF] border border-blue-100 shadow-sm"
                          : "bg-white/60 backdrop-blur-xl border border-white/60 hover:bg-white/80",
                      )}
                    >
                      <motion.div layout className="p-5">
                        <div className="flex items-start gap-4">
                          {/* ICON */}
                          <div className="mt-1 shrink-0">
                            <AnimatePresence mode="wait">
                              {isCompleted ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md shadow-green-500/30"
                                >
                                  <Check size={14} strokeWidth={3} />
                                </motion.div>
                              ) : isActive ? (
                                <motion.div
                                  key="active"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex gap-3"
                                >
                                  <step.icon
                                    size={20}
                                    className="text-blue-600"
                                  />
                                  <div className="w-[2px] h-6 bg-blue-600 rounded-full" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="pending"
                                  className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-500"
                                >
                                  <Clock size={14} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start h-8">
                              <div className="flex flex-col justify-center">
                                {isCompleted ? (
                                  <div className="flex flex-col">
                                    <h3 className="text-[13px] font-bold text-slate-400 line-through decoration-slate-300 decoration-2">
                                      {step.title}
                                    </h3>
                                    <p className="text-[14px] font-bold text-slate-900 mt-0.5">
                                      {value}
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    <h3
                                      className={clsx(
                                        "text-[15px]",
                                        isActive
                                          ? "font-semibold text-slate-900"
                                          : "font-bold text-slate-700",
                                      )}
                                    >
                                      {step.title}
                                    </h3>
                                    <p className="text-[13px] text-slate-500 font-medium leading-tight">
                                      {step.description}
                                    </p>
                                  </>
                                )}
                              </div>

                              {/* BUTTONS (3D/Glass) */}
                              <div className="flex items-center">
                                {isActive ? (
                                  <div className="flex items-center gap-2">
                                    {step.id !== "template" && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveStep(null);
                                        }}
                                        className="px-4 py-1.5 bg-white rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-[0_2px_5px_rgba(0,0,0,0.05)] border border-white/50"
                                      >
                                        Cancel
                                      </button>
                                    )}
                                    <button
                                      onClick={(e) => handleSave(e, step.id)}
                                      className={clsx(
                                        "px-5 py-1.5 rounded-full text-xs font-bold text-white transition-all shadow-[0_4px_10px_rgba(59,130,246,0.3)] hover:shadow-blue-500/40 hover:-translate-y-0.5",
                                        step.id === "template"
                                          ? "bg-white text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50"
                                          : "bg-blue-600 hover:bg-blue-700",
                                      )}
                                    >
                                      {step.id === "template"
                                        ? "+ Add"
                                        : "Save"}
                                    </button>
                                  </div>
                                ) : isCompleted ? (
                                  <button className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white border border-slate-100 px-4 py-1.5 rounded-full hover:bg-slate-50 transition-all shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                                    <Edit2 size={12} /> Edit
                                  </button>
                                ) : (
                                  <button className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white border border-slate-100 px-4 py-1.5 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:text-blue-600 transition-all">
                                    <Plus size={12} /> Add
                                  </button>
                                )}
                              </div>
                            </div>

                            <AnimatePresence mode="sync">
                              {isActive && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-visible"
                                >
                                  <div className="mt-6 pt-4 border-t border-blue-200/50 space-y-6">
                                    {step.id === "name" && (
                                      <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 ml-1">
                                          Campaign name
                                        </label>
                                        <div className="relative">
                                          <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                name: e.target.value,
                                              })
                                            }
                                            className="w-full bg-white rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:ring-0 focus:outline-none shadow-sm"
                                          />
                                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-slate-400">
                                            <span className="text-slate-800">
                                              {formData.name.length}
                                            </span>
                                            /60
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {step.id === "sender" && (
                                      <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 ml-1">
                                          Email address
                                        </label>
                                        <div className="relative">
                                          <div
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSenderDropdownOpen(
                                                !senderDropdownOpen,
                                              );
                                            }}
                                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex items-center gap-3 cursor-pointer hover:border-blue-200 transition-colors"
                                          >
                                            <Mail
                                              size={16}
                                              className="text-slate-400"
                                            />
                                            <span className="text-sm font-medium text-slate-800">
                                              {formData.sender}
                                            </span>
                                            <ChevronDown
                                              size={16}
                                              className={clsx(
                                                "ml-auto text-slate-400 transition-transform",
                                                senderDropdownOpen &&
                                                  "rotate-180",
                                              )}
                                            />
                                          </div>
                                          <AnimatePresence>
                                            {senderDropdownOpen && (
                                              <motion.div
                                                initial={{
                                                  opacity: 0,
                                                  y: -10,
                                                  height: 0,
                                                }}
                                                animate={{
                                                  opacity: 1,
                                                  y: 0,
                                                  height: "auto",
                                                }}
                                                exit={{
                                                  opacity: 0,
                                                  y: -10,
                                                  height: 0,
                                                }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                                              >
                                                <div className="p-2 space-y-1">
                                                  {[
                                                    "sinan@promotion.com",
                                                    "support@nanis.com",
                                                    "hello@salesync.io",
                                                  ].map((email, i) => (
                                                    <div
                                                      key={i}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFormData({
                                                          ...formData,
                                                          sender: email,
                                                        });
                                                        setSenderDropdownOpen(
                                                          false,
                                                        );
                                                      }}
                                                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                                    >
                                                      <Mail
                                                        size={14}
                                                        className="text-slate-400"
                                                      />
                                                      <span className="text-xs font-medium text-slate-600">
                                                        {email}
                                                      </span>
                                                      {formData.sender ===
                                                        email && (
                                                        <Check
                                                          size={14}
                                                          className="ml-auto text-blue-600"
                                                        />
                                                      )}
                                                    </div>
                                                  ))}
                                                  <div className="h-px bg-slate-100 my-1" />
                                                  <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-lg transition-colors">
                                                    <Plus size={14} /> Add new
                                                    sender
                                                  </button>
                                                </div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      </div>
                                    )}

                                    {step.id === "recipients" && (
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-700 ml-1">
                                            Send to
                                          </label>
                                          <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-blue-200 transition-colors">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                              <Mail
                                                size={16}
                                                className="text-slate-400"
                                              />{" "}
                                              {formData.sender}
                                            </div>
                                            <ChevronDown
                                              size={16}
                                              className="text-slate-400"
                                            />
                                          </div>
                                          <div className="flex flex-wrap gap-2 mt-2">
                                            {recipientTags.map((tag, i) => (
                                              <div
                                                key={i}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 text-[11px] font-bold text-slate-700 shadow-sm"
                                              >
                                                <Users
                                                  size={12}
                                                  className="text-slate-500"
                                                />
                                                {tag.label}
                                                <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-[10px] text-slate-500 font-bold">
                                                  {tag.count}
                                                </span>
                                                <X
                                                  size={12}
                                                  className="text-slate-400 cursor-pointer hover:text-red-500 ml-1 transition-colors"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setRecipientTags((prev) =>
                                                      prev.filter(
                                                        (_, idx) => idx !== i,
                                                      ),
                                                    );
                                                  }}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-50">
                                          <div
                                            className="p-3 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setExcludeExpanded(
                                                !excludeExpanded,
                                              );
                                            }}
                                          >
                                            <span className="text-xs font-bold text-slate-700">
                                              Exclude
                                            </span>
                                            <ChevronUp
                                              size={16}
                                              className={clsx(
                                                "text-slate-400 transition-transform",
                                                !excludeExpanded &&
                                                  "rotate-180",
                                              )}
                                            />
                                          </div>
                                          <AnimatePresence>
                                            {excludeExpanded && (
                                              <motion.div
                                                initial={{
                                                  height: 0,
                                                  opacity: 0,
                                                }}
                                                animate={{
                                                  height: "auto",
                                                  opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="p-4 space-y-3"
                                              >
                                                <div className="space-y-3">
                                                  <div className="flex items-center justify-between">
                                                    <span className="text-[13px] font-medium text-slate-800">
                                                      Exclude by country
                                                    </span>
                                                    <ToggleSwitch
                                                      isOn={toggles.country}
                                                      onToggle={() =>
                                                        setToggles({
                                                          ...toggles,
                                                          country:
                                                            !toggles.country,
                                                        })
                                                      }
                                                    />
                                                  </div>
                                                  <AnimatePresence>
                                                    {toggles.country && (
                                                      <motion.div
                                                        initial={{
                                                          height: 0,
                                                          opacity: 0,
                                                        }}
                                                        animate={{
                                                          height: "auto",
                                                          opacity: 1,
                                                        }}
                                                        exit={{
                                                          height: 0,
                                                          opacity: 0,
                                                        }}
                                                        className="flex flex-wrap gap-2 pl-1 overflow-hidden"
                                                      >
                                                        {countryTags.map(
                                                          (c, i) => (
                                                            <div
                                                              key={c.name}
                                                              className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-700 shadow-sm"
                                                            >
                                                              <span className="text-base">
                                                                {c.flag}
                                                              </span>
                                                              {c.name}
                                                              <span className="text-slate-500 bg-slate-50 px-1.5 rounded border border-slate-100">
                                                                {c.count}
                                                              </span>
                                                              <X
                                                                size={12}
                                                                className="text-slate-300 hover:text-red-500 cursor-pointer"
                                                                onClick={(
                                                                  e,
                                                                ) => {
                                                                  e.stopPropagation();
                                                                  setCountryTags(
                                                                    (prev) =>
                                                                      prev.filter(
                                                                        (
                                                                          _,
                                                                          idx,
                                                                        ) =>
                                                                          idx !==
                                                                          i,
                                                                      ),
                                                                  );
                                                                }}
                                                              />
                                                            </div>
                                                          ),
                                                        )}
                                                      </motion.div>
                                                    )}
                                                  </AnimatePresence>
                                                </div>
                                                {[
                                                  {
                                                    key: "lists",
                                                    label:
                                                      "Exclude contacts from specific contacts lists",
                                                  },
                                                  {
                                                    key: "unsub",
                                                    label:
                                                      "Exclude unsubscribed contacts",
                                                    count: "633",
                                                  },
                                                  {
                                                    key: "bounced",
                                                    label:
                                                      "Exclude bounced contacts",
                                                    count: "633",
                                                  },
                                                  {
                                                    key: "inactive",
                                                    label:
                                                      "Exclude inactive (no opens 90 days)",
                                                    count: "633",
                                                  },
                                                ].map((item) => (
                                                  <div
                                                    key={item.key}
                                                    className="flex items-center justify-between py-2 border-t border-slate-50/80"
                                                  >
                                                    <div className="flex items-center gap-2">
                                                      <span className="text-[13px] font-medium text-slate-800">
                                                        {item.label}
                                                      </span>
                                                      {item.count && (
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                                                          {item.count}
                                                        </span>
                                                      )}
                                                    </div>
                                                    <ToggleSwitch
                                                      isOn={
                                                        toggles[
                                                          item.key as keyof typeof toggles
                                                        ]
                                                      }
                                                      onToggle={() =>
                                                        setToggles({
                                                          ...toggles,
                                                          [item.key]:
                                                            !toggles[
                                                              item.key as keyof typeof toggles
                                                            ],
                                                        })
                                                      }
                                                    />
                                                  </div>
                                                ))}
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      </div>
                                    )}

                                    {step.id === "subject" && (
                                      <div className="space-y-6">
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-700 ml-1">
                                            Subject Line
                                          </label>
                                          <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                subject: e.target.value,
                                              })
                                            }
                                            className="w-full bg-white rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:ring-0 focus:outline-none shadow-sm"
                                          />
                                          <p className="text-[10px] text-slate-500 italic ml-1">
                                            Main headline recipients see first
                                          </p>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-700 ml-1">
                                            Preview text
                                          </label>
                                          <input
                                            type="text"
                                            placeholder="Your supporting text"
                                            className="w-full bg-white rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:ring-0 focus:outline-none shadow-sm placeholder:text-slate-400"
                                          />
                                          <p className="text-[10px] text-slate-500 italic ml-1">
                                            Supporting text that increases opens
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {step.id === "template" && (
                                      <div className="space-y-4">
                                        <div className="flex gap-2">
                                          <button className="px-4 py-2 bg-white rounded-full text-xs font-bold text-slate-800 shadow-sm border border-slate-200">
                                            System Templates{" "}
                                            <span className="ml-1 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-500">
                                              142
                                            </span>
                                          </button>
                                          <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-white/50 rounded-full transition-colors">
                                            Saved Templates{" "}
                                            <span className="ml-1 bg-white/50 px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                                              2
                                            </span>
                                          </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                          {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div
                                              key={i}
                                              className="group cursor-pointer"
                                            >
                                              <div className="aspect-[4/3] bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden relative group-hover:ring-2 ring-blue-500 transition-all">
                                                <div className="p-3 space-y-2 opacity-50">
                                                  <div className="h-2 w-8 bg-orange-400 rounded-full" />
                                                  <div className="h-2 w-20 bg-slate-200 rounded-full" />
                                                  <div className="space-y-1 pt-2">
                                                    <div className="h-1 w-full bg-slate-100 rounded-full" />
                                                    <div className="h-1 w-2/3 bg-slate-100 rounded-full" />
                                                  </div>
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center bg-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <button
                                                    onClick={(e) =>
                                                      handleSave(e, "template")
                                                    }
                                                    className="bg-white text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg"
                                                  >
                                                    Select
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2">
                                          <Plus size={14} /> Create from Scratch
                                        </button>
                                      </div>
                                    )}

                                    {/* --- 6. TIME (CUSTOM CALENDAR & TIME) --- */}
                                    {step.id === "time" && (
                                      <div className="space-y-6">
                                        <div className="grid grid-cols-3 gap-3">
                                          {[
                                            {
                                              id: "schedule",
                                              title: "Schedule a time",
                                              desc: "Optimize your timing at a specific time.",
                                            },
                                            {
                                              id: "timezone",
                                              title: "Based on timezone",
                                              desc: "For a specific time in all the timezones.",
                                            },
                                            {
                                              id: "now",
                                              title: "Send now",
                                              desc: "Immediately send your campaign.",
                                            },
                                          ].map((opt) => (
                                            <div
                                              key={opt.id}
                                              onClick={() =>
                                                setSendType(opt.id as any)
                                              }
                                              className={clsx(
                                                "p-4 bg-white rounded-xl border-2 transition-all cursor-pointer relative hover:border-blue-200",
                                                sendType === opt.id
                                                  ? "border-blue-500 shadow-md"
                                                  : "border-transparent shadow-sm",
                                              )}
                                            >
                                              <div
                                                className={clsx(
                                                  "w-4 h-4 rounded-full border flex items-center justify-center mb-2",
                                                  sendType === opt.id
                                                    ? "border-blue-500"
                                                    : "border-slate-300",
                                                )}
                                              >
                                                {sendType === opt.id && (
                                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                                )}
                                              </div>
                                              <h4 className="text-xs font-bold text-slate-800">
                                                {opt.title}
                                              </h4>
                                              <p className="text-[10px] text-slate-500 leading-tight mt-1">
                                                {opt.desc}
                                              </p>
                                            </div>
                                          ))}
                                        </div>

                                        {sendType === "schedule" && (
                                          <div className="flex gap-4">
                                            {/* DATE PICKER */}
                                            <div className="flex-1 space-y-1 relative">
                                              <label className="text-xs font-bold text-slate-700 ml-1">
                                                Delivery date
                                              </label>
                                              <div
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setDatePickerOpen(
                                                    !datePickerOpen,
                                                  );
                                                  setTimePickerOpen(false);
                                                }}
                                                className="relative cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                                              >
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                                  <CalendarIcon size={14} />
                                                </div>
                                                <div className="w-full pl-9 pr-8 py-3 text-xs font-bold text-slate-800">
                                                  {formData.date.toLocaleDateString(
                                                    "en-US",
                                                    {
                                                      month: "long",
                                                      day: "numeric",
                                                      year: "numeric",
                                                    },
                                                  )}
                                                </div>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                  <ChevronDown size={14} />
                                                </div>
                                              </div>
                                              <AnimatePresence>
                                                {datePickerOpen && (
                                                  <CustomDatePicker
                                                    selectedDate={formData.date}
                                                    onSelect={(d) =>
                                                      setFormData({
                                                        ...formData,
                                                        date: d,
                                                      })
                                                    }
                                                    onClose={() =>
                                                      setDatePickerOpen(false)
                                                    }
                                                  />
                                                )}
                                              </AnimatePresence>
                                            </div>

                                            {/* TIME PICKER */}
                                            <div className="flex-1 space-y-1 relative">
                                              <label className="text-xs font-bold text-slate-700 ml-1">
                                                Send at a specific time
                                              </label>
                                              <div
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setTimePickerOpen(
                                                    !timePickerOpen,
                                                  );
                                                  setDatePickerOpen(false);
                                                }}
                                                className="relative cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                                              >
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                                  <Clock size={14} />
                                                </div>
                                                <div className="w-full pl-9 pr-8 py-3 text-xs font-bold text-slate-800">
                                                  {formData.time}
                                                </div>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                  <ChevronDown size={14} />
                                                </div>
                                              </div>
                                              <AnimatePresence>
                                                {timePickerOpen && (
                                                  <CustomTimePicker
                                                    selectedTime={formData.time}
                                                    onSelect={(t) =>
                                                      setFormData({
                                                        ...formData,
                                                        time: t,
                                                      })
                                                    }
                                                    onClose={() =>
                                                      setTimePickerOpen(false)
                                                    }
                                                  />
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </LayoutGroup>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}