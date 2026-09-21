"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { copyTextToClipboard } from "@/lib/clipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  successMessage?: string;
  className?: string;
  iconSize?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  successMessage = "Copied to clipboard!",
  className = "",
  iconSize = 13,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!text) return;

    const ok = await copyTextToClipboard(text);
    if (ok) {
      setIsCopied(true);
      toast.success(successMessage);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } else {
      toast.error("Failed to copy text to clipboard");
    }
  };

  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={label}
            className={`inline-flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:scale-90 transition-all cursor-pointer ${className}`}
          >
            {isCopied ? (
              <Check size={iconSize} className="text-emerald-600 animate-in zoom-in-50 duration-150" />
            ) : (
              <Copy size={iconSize} />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-[11px] py-1 px-2">
          {isCopied ? copiedLabel : label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyButton;
