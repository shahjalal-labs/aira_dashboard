/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import Image from "next/image";
import download from "@/assets/download.svg";

const TopNavbar = () => {
  return (
    <>
      <div className="bg-white flex justify-between items-center gap-2 h-[90px] fixed z-20 top-0 left-20 lg:left-[250px] xl:left-[286px] right-0 w-[calc(100%-80px)] lg:w-[calc(100%-250px)] xl:w-[calc(100%-286px)] px-4 md:px-6 lg:shadow-xs">
        <h1 className="md:text-2xl text-[#2D2D2D] font-bold"></h1>

        <div className="flex justify-end items-center gap-3 lg:gap-4">
          <div className="bg-bprimary shadow-[0_0_10px_0_rgba(227, 83, 20, 0.10)] rounded-full p-1.5">
            <Image
              src={download}
              height={50}
              width={50}
              alt="avatar"
              className="rounded-full w-6 h-6"
              priority
            />
          </div>

          <Link
            href="/settings"
            className="flex justify-center items-center gap-3 text-[#636F85] font-medium bg-[#F5F5F5] rounded-3xl h-full cursor-pointer"
          >
            <Image
              src={
                "https://api.zenexcloud.com/emdadullah/uploads/courses/profileImage/1769748934067-lltt6p250pb.jpg"
              }
              height={50}
              width={50}
              alt="avatar"
              className="rounded-full w-10 h-10"
              priority
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
