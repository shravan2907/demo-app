import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function formatStatusMessage(status) {
  return `Battery: ${status.battery}%, WiFi: ${status.wifi ? "On" : "Off"}, Bluetooth: ${status.bluetooth ? "On" : "Off"}`;
}

