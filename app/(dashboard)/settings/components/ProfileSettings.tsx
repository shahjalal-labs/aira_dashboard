"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Camera, Check, Loader, Lock, Mail, Phone, ShieldCheck, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateProfilePhotoMutation,
} from "@/redux/api/authApi";

interface ProfileFormValues {
  fullName: string;
}

export default function ProfileSettings() {
  const { data: profileData, isLoading: isFetchingProfile } = useGetMyProfileQuery("");
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateMyProfileMutation();
  const [updateProfilePhoto, { isLoading: isUploadingPhoto }] = useUpdateProfilePhotoMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const profile = profileData?.result;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || "",
      });
    }
  }, [profile, reset]);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    // Client-side preview
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await updateProfilePhoto(formData).unwrap();
      toast.success(res?.message || "Profile photo updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile photo");
      setPreviewImage(null);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const res = await updateProfile({
        fullName: values.fullName.trim(),
      }).unwrap();
      toast.success(res?.message || "Profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  if (isFetchingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] bg-white rounded-xl border border-gray-100 p-8 shadow-xs">
        <Loader className="w-8 h-8 animate-spin text-bprimary mb-3" />
        <p className="text-sm text-gray-500 font-medium">Loading profile details...</p>
      </div>
    );
  }

  const avatarUrl = previewImage || profile?.profileImage;
  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div className="space-y-6">
      {/* Profile Overview & Avatar Card */}
      <Card className="bg-white border-[#E5E7EB] shadow-xs rounded-xl overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar with Upload Button */}
            <div className="relative group">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-3 border-bprimary/20 shadow-md">
                <AvatarImage src={avatarUrl} alt={profile?.fullName || "Admin"} className="object-cover" />
                <AvatarFallback className="bg-bprimary/10 text-bprimary text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute bottom-0 right-0 p-2 bg-bprimary text-white rounded-full shadow-md hover:bg-bprimary/90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Change profile picture"
              >
                {isUploadingPhoto ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            {/* User Meta Information */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile?.fullName || "Administrator"}
                </h2>
                <Badge className="bg-bprimary/10 text-bprimary border border-bprimary/30 w-fit self-center sm:self-auto font-semibold px-2.5 py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-bprimary" />
                  {profile?.role || "ADMIN"}
                </Badge>
              </div>

              <p className="text-sm text-gray-500">{profile?.email}</p>

              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="rounded-lg text-xs font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Camera className="w-3.5 h-3.5 mr-1.5" />
                  {isUploadingPhoto ? "Uploading..." : "Upload New Photo"}
                </Button>
              </div>
              <p className="text-[11px] text-gray-400">
                Supports JPG, PNG or WEBP (Max 5MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form Card */}
      <Card className="bg-white border-[#E5E7EB] shadow-xs rounded-xl">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Personal Information
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            Update your admin personal details and contact information.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Full name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 30,
                      message: "Full name cannot exceed 30 characters",
                    },
                  })}
                  className="h-11 rounded-lg border-gray-300 focus:border-bprimary focus:ring-bprimary text-sm"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email Address (Read-Only) */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-gray-700 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    Email Address
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Read-only
                  </span>
                </label>
                <Input
                  id="email"
                  value={profile?.email || ""}
                  disabled
                  className="h-11 rounded-lg bg-gray-50/80 border-gray-200 text-gray-500 cursor-not-allowed text-sm"
                />
                <p className="text-[11px] text-gray-400">
                  Primary account email cannot be changed.
                </p>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  value={profile?.phoneNumber || "Not configured"}
                  disabled
                  className="h-11 rounded-lg bg-gray-50/80 border-gray-200 text-gray-500 cursor-not-allowed text-sm"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                  System Role
                </label>
                <Input
                  id="role"
                  value={profile?.role || "ADMIN"}
                  disabled
                  className="h-11 rounded-lg bg-gray-50/80 border-gray-200 text-gray-500 font-medium cursor-not-allowed text-sm"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-gray-100 px-6 py-4 flex justify-end">
            <Button
              type="submit"
              disabled={isUpdatingProfile || !isDirty}
              className="bg-bprimary hover:bg-bprimary/90 text-white font-medium px-6 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
