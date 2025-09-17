import Database from "@tauri-apps/plugin-sql";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getDatabase() {
  return await Database.load("sqlite:shelves.db");
}
