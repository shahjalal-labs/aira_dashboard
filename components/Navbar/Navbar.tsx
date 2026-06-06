"use client";

import { useEffect, useState } from "react";
import NavbarSlider from "./NavbarSlider";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth > 768 : true
  );

  const deviceResponsive = () => {
    const availWidth = window.innerWidth;
    if (availWidth <= 768) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  };

  useEffect(() => {
    // initial state is set lazily above; only register the resize listener here
    window.addEventListener("resize", deviceResponsive);
    return () => {
      window.removeEventListener("resize", deviceResponsive);
    };
  }, []);

  return (
    <div className={`${isSidebarOpen ? "w-[286px]" : "w-fit"}`}>
      <NavbarSlider
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      ></NavbarSlider>
    </div>
  );
};

export default Navbar;
