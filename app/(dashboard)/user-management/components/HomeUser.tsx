"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { RotateCw, Trash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoData from "@/components/Common/NoData";
import { useAllUsersQuery, useBlockUnblockMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import UserDetailsModal from "./UserDetailsModal";
import { IoCheckmarkSharp } from "react-icons/io5";
import Link from "next/link";

const HomeUser = () => {
  const searchParams = useSearchParams();
  const searchData = searchParams.get("searchData");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchData); // 🔑 Track which row is being acted on
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const {
    data: users,
    isLoading,
    isFetching,
  } = useAllUsersQuery({ page, searchTerm: searchTerm || "" });
  const [blockUnblock, { isLoading: blockUnblockLoading }] =
    useBlockUnblockMutation();

  const totalPage = users?.result?.meta?.totalPages;

  const handleBlockUnblockUser = async (id: string) => {
    const response = await blockUnblock(id).unwrap();
    if (response?.success) {
      toast.success(response?.message || "Action performed successfully");
    } else {
      toast.error(response?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-5 my-6 bg-white rounded-xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <h1 className="md:font-medium">User List</h1>
        <Link
          href="/user-management"
          className="flex flex-col md:flex-row gap-2 w-full lg:w-auto"
        >
          <button className="border flex items-center justify-center gap-1 px-4 text-gray-600 rounded-[6px] cursor-pointer py-1 md:justify-start">
            See All
          </button>
        </Link>
      </div>

      <Table className="rounded-lg min-w-[900px]">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[250px] whitespace-nowrap">
              User Details
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Profession</TableHead>
            <TableHead>Sub-Profession</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users?.result?.users?.length > 0 ? (
            users.result.users.map((user: any) => {
              const isCurrent = activeUserId === user.id;

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            user?.profileImage ||
                            "https://api.zenexcloud.com/emdadullah/uploads/messages/files/1780416667413-yjvj4j0m9i.png"
                          }
                          alt={user?.userName}
                        />
                        <AvatarFallback>{user?.userName}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {user?.userName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>
                    {user?.userProfile?.profession || "N/A"}
                  </TableCell>
                  <TableCell>
                    {user?.userProfile?.subProfession || "N/A"}
                  </TableCell>
                  <TableCell>
                    {user?.userProfile?.skills?.length > 0
                      ? user?.userProfile?.skills
                          ?.map((skill: any) => skill)
                          .join(", ")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="px-2 py-1">
                    <span
                      className={`px-3 py-1 rounded-xl text-sm font-medium ${
                        user?.status === "Deleted"
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserDetailsModal id={user.id}></UserDetailsModal>
                      <button>
                        {user.status == "Active" ? (
                          <Trash
                            onClick={() => handleBlockUnblockUser(user.id)}
                            size={25}
                            className="text-red-500 cursor-pointer"
                          ></Trash>
                        ) : (
                          <IoCheckmarkSharp
                            size={25}
                            className="text-green-500 cursor-pointer"
                            onClick={() => handleBlockUnblockUser(user.id)}
                          ></IoCheckmarkSharp>
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoData
              title="User"
              isLoading={isLoading}
              isFetching={isFetching}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default HomeUser;
