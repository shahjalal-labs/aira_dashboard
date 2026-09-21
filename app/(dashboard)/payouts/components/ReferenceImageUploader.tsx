"use client";

import React, { useRef } from "react";
import { UploadCloud, X, Info, Image as ImageIcon } from "lucide-react";
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} reference images allowed.`);
      return;
    }

    // Filter valid image types
    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length < selectedFiles.length) {
      toast.warning("Some files were skipped because they are not valid images.");
    }

    if (validFiles.length > 0) {
      onChange([...images, ...validFiles].slice(0, maxImages));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

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

      {/* Upload Dropzone */}
      {images.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-gray-300 hover:border-emerald-500 rounded-xl p-3 text-center cursor-pointer transition bg-gray-50/60 hover:bg-emerald-50/20 group"
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition" />
            <p className="text-xs font-medium text-gray-600 group-hover:text-emerald-700">
              Click to select or drag transfer receipts
            </p>
            <p className="text-[10px] text-gray-400">
              PNG, JPG, WebP up to 5MB each ({maxImages - images.length} remaining)
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
                  className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-0.5 rounded-full transition shadow"
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
