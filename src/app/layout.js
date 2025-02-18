"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider, useTheme } from "@/context/ThemeContext"; // Import ThemeProvider
import { Moon, Sun, Menu } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
}

function LayoutContent({ children }) {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <html lang="en" className={darkMode ? "dark" : ""}>
      <body className="min-h-screen bg-gray-900 text-white flex flex-col transition-all">
        {/* Header */}
        <header className="bg-gray-800 text-white py-4 shadow-md flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-center flex-grow">
            Device Assistant
          </h1>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-white focus:outline-none"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-400 py-4">
          <div className="container mx-auto text-center">
            <p>
              &copy; {new Date().getFullYear()} Device Assistant. All rights
              reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
