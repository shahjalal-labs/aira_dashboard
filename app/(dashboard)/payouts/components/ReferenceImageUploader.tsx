"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  UploadCloud,
  X,
  Info,
  Image as ImageIcon,
  ClipboardPaste,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";

interface ReferenceImageUploaderProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
}

export const ReferenceImageUploader: React.FC<ReferenceImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Helper to filter, validate and append files
  const addValidFiles = (newFiles: File[]) => {
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} reference images already reached.`);
      return;
    }

    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.warning(`"${file.name}" is not a valid image file.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.warning(`"${file.name}" exceeds 5MB size limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const availableSlots = maxImages - images.length;
    const filesToAdd = validFiles.slice(0, availableSlots);

    if (validFiles.length > availableSlots) {
      toast.warning(
        `Added only ${availableSlots} image(s) to stay within the limit of ${maxImages}.`,
      );
    }

    onChange([...images, ...filesToAdd]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    addValidFiles(selectedFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addValidFiles(droppedFiles);
      toast.success(`${droppedFiles.length} file(s) dropped!`);
    }
  };

  // Button click to read from clipboard directly
  const handlePasteButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} reference images already reached.`);
      return;
    }

    // Attempt navigator.clipboard.read() if available
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.read === "function"
    ) {
      try {
        const clipboardItems = await navigator.clipboard.read();
        const foundImages: File[] = [];

        for (let i = 0; i < clipboardItems.length; i++) {
          const item = clipboardItems[i];
          const imageType = item.types.find((t) => t.startsWith("image/"));
          if (imageType) {
            const blob = await item.getType(imageType);
            const ext = imageType.split("/")[1]?.replace("+xml", "") || "png";
            const file = new File(
              [blob],
              `receipt-paste-${Date.now()}-${i + 1}.${ext}`,
              { type: imageType },
            );
            foundImages.push(file);
          }
        }

        if (foundImages.length > 0) {
          addValidFiles(foundImages);
          toast.success(
            `${foundImages.length} image(s) pasted from clipboard!`,
          );
          return;
        } else {
          toast.info(
            "No image found in clipboard. Copy a screenshot first (e.g. Win+Shift+S or Cmd+Shift+4) and click Paste again or press Ctrl+V.",
          );
          return;
        }
      } catch (err) {
        console.warn("navigator.clipboard.read() error:", err);
      }
    }

    // Fallback info for environments where programmatic read is blocked (e.g. HTTP IP)
    toast.info(
      "Screenshot copied? Press Ctrl+V (or ⌘+V) anywhere on your keyboard to paste it directly!",
    );
  };

  // Global window paste listener (Ctrl+V / Cmd+V anywhere in modal)
  useEffect(() => {
    const handleWindowPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items || items.length === 0) return;

      const pastedImages: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            const ext = file.type.split("/")[1]?.replace("+xml", "") || "png";
            const renamed = new File(
              [file],
              `receipt-paste-${Date.now()}-${i + 1}.${ext}`,
              { type: file.type },
            );
            pastedImages.push(renamed);
          }
        }
      }

      if (pastedImages.length > 0) {
        e.preventDefault();
        addValidFiles(pastedImages);
        toast.success(
          `${pastedImages.length} image(s) pasted from clipboard!`,
        );
      }
    };

    window.addEventListener("paste", handleWindowPaste);
    return () => {
      window.removeEventListener("paste", handleWindowPaste);
    };
  }, [images, maxImages]);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
          Transfer Proof / Reference Images{" "}
          <span className="text-gray-400 font-normal">
            (Optional, max {maxImages})
          </span>
        </label>
        <span
          className={`text-[11px] font-medium ${
            images.length === maxImages ? "text-amber-600" : "text-gray-400"
          }`}
        >
          {images.length}/{maxImages} attached
        </span>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple
        className="hidden"
      />

      {/* Upload Dropzone with Paste & Browse options */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-3.5 text-center transition-all bg-gray-50/70 ${
            isDragging
              ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-400/20 scale-[1.01]"
              : "border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/20"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <UploadCloud
              className={`w-6 h-6 transition-colors ${
                isDragging ? "text-emerald-600" : "text-gray-400"
              }`}
            />
            <p className="text-xs font-medium text-gray-700">
              Drag & drop transfer receipts here, or:
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs transition cursor-pointer active:scale-95"
              >
                <FolderOpen className="w-3.5 h-3.5 text-gray-500" />
                Browse Files
              </button>

              <button
                type="button"
                onClick={handlePasteButtonClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer active:scale-95"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-emerald-600" />
                Paste from Clipboard
              </button>
            </div>

            {/* Keyboard shortcut hint */}
            <p className="text-[10px] text-gray-400 pt-0.5 flex items-center justify-center gap-1">
              or press{" "}
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-mono text-gray-600 shadow-2xs">
                Ctrl+V
              </kbd>{" "}
              /{" "}
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-mono text-gray-600 shadow-2xs">
                ⌘+V
              </kbd>{" "}
              anywhere ({maxImages - images.length} remaining)
            </p>
          </div>
        </div>
      )}

      {/* Thumbnails preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2 pt-0.5">
          {images.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div
                key={idx}
                className="relative group border border-gray-200 rounded-lg overflow-hidden aspect-square bg-gray-100 shadow-2xs"
              >
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-0.5 rounded-full transition shadow cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1 py-0.5 text-[9px] text-white truncate text-center font-mono">
                  {(file.size / 1024).toFixed(0)}KB
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assuring banner for admin */}
      <div className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-200/80 rounded-lg text-blue-800 text-[11px] leading-relaxed">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <span>
          <strong>Email & Host Access:</strong> Uploaded transfer receipts/images
          will be stored with this payout record and automatically attached to
          the notification email sent to the host.
        </span>
      </div>
    </div>
  );
};

export default ReferenceImageUploader;
