"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader,
  Lock,
  ShieldCheck,
  X,
} from "lucide-react";
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
import { useChangePasswordMutation } from "@/redux/api/authApi";

interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SecuritySettings() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const oldPassword = watch("oldPassword") || "";
  const newPassword = watch("newPassword") || "";
  const isDifferentFromCurrent = !oldPassword || !newPassword || newPassword !== oldPassword;

  // Password requirement checks
  const requirements = [
    { label: "At least 8 characters long", met: newPassword.length >= 8 },
    { label: "At least one uppercase letter (A-Z)", met: /[A-Z]/.test(newPassword) },
    { label: "At least one lowercase letter (a-z)", met: /[a-z]/.test(newPassword) },
    { label: "At least one number (0-9)", met: /[0-9]/.test(newPassword) },
    {
      label: "At least one special character (@, $, !, %, *, #, etc.)",
      met: /[@$!%*?&#^()_\-+=\[\]{};:'",.<>\/\\|]/.test(newPassword),
    },
    {
      label: "Different from current password",
      met: oldPassword.length > 0 ? newPassword.length > 0 && newPassword !== oldPassword : true,
    },
  ];

  const allRequirementsMet = requirements.every((r) => r.met);

  const onSubmit = async (values: PasswordFormValues) => {
    if (values.newPassword === values.oldPassword) {
      toast.error("New password must be different from the current password");
      return;
    }

    if (!allRequirementsMet) {
      toast.error("Please ensure all password requirements are met");
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const res = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success(res?.message || "Password changed successfully!");
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password. Please check your current password.");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="bg-white border-[#E5E7EB] shadow-xs rounded-xl">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-bprimary/10 text-bprimary rounded-lg">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Change Password
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Keep your admin account secure by choosing a strong, unique password.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="p-6 space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label
                htmlFor="oldPassword"
                className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  {...register("oldPassword", {
                    required: "Current password is required",
                  })}
                  className="h-11 rounded-lg border-gray-300 focus:border-bprimary focus:ring-bprimary text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    validate: (value) => {
                      if (oldPassword && value === oldPassword) {
                        return "New password must be different from the current password";
                      }
                      return true;
                    },
                  })}
                  className="h-11 rounded-lg border-gray-300 focus:border-bprimary focus:ring-bprimary text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                  {errors.newPassword.message}
                </p>
              )}
              {!errors.newPassword && oldPassword && newPassword && oldPassword === newPassword && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                  New password must be different from the current password
                </p>
              )}

              {/* Password Requirements Real-Time Checklist */}
              {newPassword.length > 0 && (
                <div className="mt-3 p-3.5 bg-gray-50 rounded-lg border border-gray-200/70 space-y-1.5">
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    Password Requirements:
                  </p>
                  {requirements.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        req.met ? "text-emerald-600 font-medium" : "text-gray-500"
                      }`}
                    >
                      {req.met ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      )}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-gray-700 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  className="h-11 rounded-lg border-gray-300 focus:border-bprimary focus:ring-bprimary text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="border-t border-gray-100 px-6 py-4 flex justify-between items-center bg-gray-50/50 rounded-b-xl">
            <p className="text-xs text-gray-500 hidden sm:block">
              After updating, you will remain logged in on this device.
            </p>
            <Button
              type="submit"
              disabled={isLoading || !allRequirementsMet}
              className="bg-bprimary hover:bg-bprimary/90 text-white font-medium px-6 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 ml-auto"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Update Password
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
