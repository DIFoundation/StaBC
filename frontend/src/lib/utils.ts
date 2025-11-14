import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Shortens an Ethereum address for display
 * @param address Full Ethereum address
 * @param chars Number of characters to show at the start and end
 * @returns Formatted address (e.g., 0x1234...5678)
 */
export function shortenAddress(address?: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}
