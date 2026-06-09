"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/assets/Logo.png";
import expert from "@/assets/expert.png";
import logout from "@/assets/logout.png";
import dispute from "@/assets/dispute.png";
import content from "@/assets/content.png";
import settings from "@/assets/settings.png";
import dashboard from "@/assets/dashboard.png";
import start from "@/assets/star.png";
import bell from "@/assets/bell.png";
import jobSeeker from "@/assets/jobSeeker.png";
import withdrawals from "@/assets/withdrawals.png";
import { SlMenu } from "react-icons/sl";
import { IoClose } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { FaQuestion } from "react-icons/fa6";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { TbAlignBoxCenterMiddle } from "react-icons/tb";
import { TfiAngleDown, TfiAngleUp } from "react-icons/tfi";
import { JWTDecodeToken } from "@/lib/jwtDecode";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const NavbarSlider = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const path = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const { decoded } = JWTDecodeToken();

  const navigation = [
    {
      label: "Dashboard",
      route: "/",
      iconPath: dashboard,
    },
    {
      label: "Users",
      route: "/user-management",
      iconPath: jobSeeker,
    },
    {
      label: "Listings",
      route: "/listings",
      iconPath: expert,
    },
    {
      label: "Bookings",
      route: "/bookings",
      iconPath: withdrawals,
    },
    {
      label: "Payouts",
      route: "/payouts",
      iconPath: dispute,
    },

    {
      label: "Reports",
      route: "/reports",
      iconPath: content,
    },
    {
      label: "Reviews",
      route: "/reviews",
      iconPath: start,
    },
    {
      label: "Notification",
      route: "/notification",
      iconPath: bell,
    },
    {
      label: "Settings",
      route: "/settings",
      iconPath: settings,
    },
  ];

  const handleLogOut = () => {
    // dispatch(logout());
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="h-screen bg-white">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="m-4 p-2 text-black rounded-md bg-white shadow-md lg:hidden"
      >
        {isOpen ? <IoClose size={20} /> : <SlMenu size={20} />}
      </button>

      {/* Sidebar Content */}
      <aside
        className={`duration-300 flex flex-col justify-between h-[calc(100%-80px)] font-inter ${isOpen ? "w-[250px] xl:w-[286px]" : "w-20"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          {isOpen && (
            <Link
              href="/"
              className="hidden lg:flex justify-start items-center gap-1 mx-6 mt-6"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={logo}
                  alt="Aira Logo"
                  height={300}
                  width={300}
                  className="h-24 w-24"
                  priority
                />
                
              </div>
            </Link>
          )}

          {/* Navigation */}
          <div className={`flex flex-col ${isOpen ? "pt-0" : ""} mt-3 lg:mt-0`}>
            <ul className="m-4 lg:m-6">
              {navigation.map((item) => (
                <li key={item.route}>
                  <Link
                    href={item.route}
                    onClick={() => {
                      if (item.label === "Content Management")
                        setShowDropdown(!showDropdown);
                    }}
                    className={`group flex items-center gap-2 mb-2 rounded-lg hover:bg-bprimary/90 hover:text-white transition-colors duration-300 ease-in-out
                      ${!isOpen ? "justify-center py-2" : "justify-start px-4 py-2"}
                      ${path === item.route ? "bg-bprimary text-white" : "text-[#636F85]"}
                      ${item.label === "Content Management" && (path === "/terms-and-conditions" || path === "/privacy-policy" || path === "/faq") ? "bg-[#FF6B00] text-white" : "text-[#636F85]"}`}
                  >
                    <div className="flex justify-center items-center">
                      <Image
                        src={item.iconPath}
                        height={50}
                        width={50}
                        alt={item.label}
                        className={`h-6 w-6 transition-all duration-300 filter
                          ${path === item.route ? "brightness-0 invert" : "brightness-0 invert-50"} group-hover:invert`}
                        priority
                      />
                    </div>

                    {isOpen && (
                      <p className="text-sm xl:text-base flex items-center">
                        {item.label}
                      </p>
                    )}
                    {item.label === "Content Management" ? (
                      showDropdown ? (
                        <TfiAngleUp className="w-2 lg:w-5 h-2 lg:h-5" />
                      ) : (
                        <TfiAngleDown className="w-2 lg:w-5 h-2 lg:h-5" />
                      )
                    ) : (
                      <></>
                    )}
                  </Link>
                  {showDropdown && item.label === "Content Management" ? (
                    <div className="flex flex-col text-[#636F85] bg-[#FAD6D666] rounded-lg space-y-2">
                      <Link
                        href="/terms-and-conditions"
                        className={`font-medium p-3 ${isOpen && "pl-8"} ${path === "/terms-and-conditions" ? "text-white bg-[#FF6B00] rounded-lg" : "hover:bg-[#FF6B00] hover:text-white hover:rounded-lg"}`}
                      >
                        {!isOpen ? (
                          <div className="text-[#CBD5E1]">
                            <TbAlignBoxCenterMiddle
                              color={`${path === "/terms-and-conditions" ? "#FFF" : "#64748B"}`}
                              size={24}
                            />
                          </div>
                        ) : (
                          <div className="text-sm flex items-center gap-2">
                            <GoDotFill
                              color={`${path === "/terms-and-conditions" ? "#FFF" : "#CBD5E1"}`}
                              size={16}
                            />
                            <span>Terms & Conditions</span>
                          </div>
                        )}
                      </Link>
                      <Link
                        href="/privacy-policy"
                        className={`font-medium p-3 ${isOpen && "pl-8"} ${path === "/privacy-policy" ? "text-white bg-[#FF6B00] rounded-lg" : "hover:bg-[#FF6B00] hover:text-white hover:rounded-lg"}`}
                      >
                        {!isOpen ? (
                          <div className="text-[#CBD5E1]">
                            <MdOutlinePrivacyTip
                              color={`${path === "/privacy-policy" ? "#FFF" : "#64748B"}`}
                              size={24}
                            />
                          </div>
                        ) : (
                          <div className="text-sm flex items-center gap-2">
                            <GoDotFill
                              color={`${path === "/privacy-policy" ? "#FFF" : "#CBD5E1"}`}
                              size={16}
                            />
                            <span>Privacy Policy</span>
                          </div>
                        )}
                      </Link>
                      <Link
                        href="/faq"
                        className={`font-medium p-3 ${isOpen && "pl-8"} ${path === "/faq" ? "text-white bg-[#FF6B00] rounded-lg" : "hover:bg-[#FF6B00] hover:text-white hover:rounded-lg"}`}
                      >
                        {!isOpen ? (
                          <div className="text-[#CBD5E1]">
                            <FaQuestion
                              color={`${path === "/faq" ? "#FFF" : "#64748B"}`}
                              size={24}
                            />
                          </div>
                        ) : (
                          <div className="text-sm flex items-center gap-2">
                            <GoDotFill
                              color={`${path === "/faq" ? "#FFF" : "#CBD5E1"}`}
                              size={16}
                            />
                            <span>FAQ</span>
                          </div>
                        )}
                      </Link>
                    </div>
                  ) : (
                    <></>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Spacer to push logout to bottom */}
          <div className="grow"></div>

          {/* Logout Button */}
          <div className="mt-auto p-6">
            <button
              onClick={handleLogOut}
              className="flex items-center justify-start gap-2 text-red-500 bg-red-100 transition-colors duration-500 ease-in-out cursor-pointer rounded-md hover:bg-[#FF4D4F33] w-full p-1.5 lg:py-2 lg:px-4"
            >
              <Image
                src={logout}
                height={50}
                width={50}
                alt="Log out"
                className="h-5 w-5"
                priority
              />
              {isOpen && <span className="">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default NavbarSlider;
