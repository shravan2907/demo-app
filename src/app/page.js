"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, useContext } from "react";
import { Slider } from "@/components/ui/slider";
import { FaWifi, FaBluetooth, FaSun, FaVolumeUp, FaBatteryFull } from "react-icons/fa";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import io from "socket.io-client";

const socket = io("ws://localhost:8080");

export default function Home() {
  const { darkMode, setDarkMode } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [brightness, setBrightness] = useState(50);
  const [bluetooth, setBluetooth] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [volume, setVolume] = useState(50);
  const [status, setStatus] = useState({ battery: 80 });
  const [systemStats, setSystemStats] = useState([
    { name: "CPU", value: 30 },
    { name: "RAM", value: 45 },
  ]);
  const [logs, setLogs] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.on("stateUpdate", (data) => {
      console.log("Response from server:", data);
      setBrightness(data.context.brightness.percentage || brightness);
      setBluetooth(data.context.bluetooth.enabled || bluetooth);
      setWifi(data.context.wifi.enabled || wifi);
      setVolume(data.context.volume.level || volume);
      setStatus({ battery: data.context.battery || status.battery });
      setSystemStats(data.context.stats || systemStats);
      setIsTyping(false);
      setLogs((prev) => [...prev, `Received: ${JSON.stringify(data)}`]);
    });

    socket.on("update-context", (data) => {
      console.log("Received system stats:", data);
      setStatus({ battery: data.context.battery });
      setSystemStats(data.context.stats);
      setIsTyping(false);
      setLogs((prev) => [...prev, `Updated stats: ${JSON.stringify(data)}`]);
    });

    return () => {
      socket.off("stateUpdate");
      socket.off("update-context");
    };
  }, []);

  const handleExecute = () => {
    if (socket && socket.connected) {
      const context = {
        brightness: { percentage: brightness },
        bluetooth: { enabled: bluetooth },
        wifi: { enabled: wifi },
        volume: { level: volume },
        prompt,
      };

      setIsTyping(true);
      setLogs((prev) => [...prev, `Sent: ${JSON.stringify(context)}`]);
      socket.emit("updateState", context);
      toast("State sent to backend!");
    } else {
      toast.error("WebSocket not connected! Try refreshing.");
    }
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Device Assistant</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-blue-500 text-white rounded-lg"
          onClick={() => setDarkMode(!darkMode)}
        >
          Toggle Dark Mode
        </motion.button>
      </div>

      {/* Text Input */}
      <div className="mt-6">
        <label htmlFor="prompt" className="block text-lg font-medium mb-2">
          Enter Command
        </label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type something..."
          className={`w-full border rounded-lg px-5 py-3 text-lg focus:ring-2 focus:ring-blue-400 ${
            darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
          }`}
        />
      </div>

      {/* Brightness Slider */}
      <div className="mt-6">
        <label className="block text-lg font-medium mb-2 flex items-center gap-3">
          <FaSun className="text-yellow-500 text-3xl" /> Brightness
        </label>
        <Slider value={[brightness]} onChange={(value) => setBrightness(value[0])} max={100} step={1} />
        <p className="mt-2 text-lg">Current: {brightness}%</p>
      </div>

      {/* Volume Slider */}
      <div className="mt-6">
        <label className="block text-lg font-medium mb-2 flex items-center gap-3">
          <FaVolumeUp className="text-blue-500 text-3xl" /> Volume
        </label>
        <Slider value={[volume]} onChange={(value) => setVolume(value[0])} max={100} step={1} />
        <p className="mt-2 text-lg">Current: {volume}%</p>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center gap-2">
          <FaBatteryFull className="text-green-500 text-2xl" />
          Battery: {status.battery}%
        </div>
        <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center gap-2">
          <FaWifi className="text-green-500 text-2xl" />
          WiFi: {wifi ? "On" : "Off"}
        </div>
        <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center gap-2">
          <FaBluetooth className="text-blue-500 text-2xl" />
          Bluetooth: {bluetooth ? "On" : "Off"}
        </div>
      </div>

      {/* System Monitoring */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">System Monitoring</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={systemStats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* WebSocket Logs */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">WebSocket Logs</h2>
        <div className="h-32 overflow-auto border p-2 bg-gray-100 dark:bg-gray-800">
          {logs.map((log, index) => <p key={index}>{log}</p>)}
        </div>
      </div>

      {/* Execute Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600"
        onClick={handleExecute}
      >
        Execute
      </motion.button>

      {isTyping && <p className="mt-2">AI is processing...</p>}
    </div>
  );
}
