import { Metadata } from "next";
import { Lock, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "./components/ProfileSettings";
import SecuritySettings from "./components/SecuritySettings";

export const metadata: Metadata = {
  title: "Settings - Aira Dashboard",
  description: "Manage admin profile details and security settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">Account Settings</h1>
        <p className="text-[#555555] text-xs pb-2">
          Manage your personal profile information, avatar, and account security.
        </p>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-white border border-[#E5E7EB] p-1.5 h-auto rounded-xl shadow-xs inline-flex gap-1.5 mb-2">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-bprimary data-[state=active]:text-white text-gray-600 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            Profile Details
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-bprimary data-[state=active]:text-white text-gray-600 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            Password & Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 outline-none">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="security" className="mt-4 outline-none">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}