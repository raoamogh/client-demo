import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Configure the font
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nanis Campaign Manager",
  description: "Create and manage email campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="antialiased font-sans text-slate-800 selection:bg-brand-500 selection:text-white">
        {/* Persistent Background Layer */}
        <div className="fixed inset-0 z-[-1]">
          {/* We use a standard img tag here for absolute background positioning */}
          <img
            src="/bg-gradient.png"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Main Content Wrapper */}
        <div className="flex h-screen w-full overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}