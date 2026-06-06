"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserDetailsQuery } from "@/redux/api/authApi";
import { Eye } from "lucide-react";

interface UserDetailsModalProps {
  id: string;
}

const UserDetailsModal = ({ id }: UserDetailsModalProps) => {
  const { data: user, isLoading, isError } = useUserDetailsQuery(id);

  const report = user?.result;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer text-yellow-500 bg-yellow-50 px-4 py-2 rounded-2xl">
          View Details
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-auto bg-white rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3 text-xl font-semibold text-gray-800">
            User Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-gray-500 mt-4">Loading details…</p>
        ) : isError ? (
          <p className="text-sm text-gray-500 mt-4">
            Error fetching user details
          </p>
        ) : !report ? (
          <p className="text-sm text-gray-500 mt-4">No user details found</p>
        ) : (
          <div className="flex flex-col gap-6 mt-4">
            {/* Profile Header Section */}
            <div className="md:flex items-center gap-2 md:gap-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-2 md:p-6 border border-blue-100">
              <div className="relative">
                <img
                  src={
                    report.profileImage ||
                    "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                  }
                  alt={`${report.userName}'s profile`}
                  className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">
                  {report.userName}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{report.email}</p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Basic Information
              </h4>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">User ID</p>
                  <p className="font-medium text-gray-800">
                    {report.id || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Profession</p>
                  <p className="font-medium text-gray-800">
                    {report.userProfile?.profession || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Sub-Profession</p>
                  <p className="font-medium text-gray-800">
                    {report.userProfile?.subProfession || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Education</p>
                  <p className="font-medium text-gray-800">
                    {report.userProfile?.education || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {report.userProfile?.skills?.length > 0 ? (
                  report.userProfile.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No skills provided</p>
                )}
              </div>
            </div>

            {/* Bio */}
            {report.userProfile?.bio && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Bio
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {report.userProfile?.bio}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
