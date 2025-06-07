"use client";

import { Fragment, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import SidebarMenu from "./SidebarMenu";
import { ISideBarMenuList } from "@/types/ISidebarMenuList";
import {
  MdClose,
  MdHome,
  MdInventory,
  MdMail,
  MdMenu,
  MdReviews,
} from "react-icons/md";
import DashboardContainer from "./DashboardContainer";
import IconButton from "./IconButton";

export default function SidebarDashboard() {
  const [show, setShow] = useState<boolean>(false);
  const sidebarData: ISideBarMenuList[] = [
    {
      icon: MdHome,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: MdInventory,
      label: "Product",
      path: "/dashboard/product",
    },
    {
      icon: MdMail,
      label: "Pesan",
      path: "/dashboard/message",
    },
    {
      icon: MdReviews,
      label: "Review",
      path: "/dashboard/review",
    },
  ];
  const pathname = usePathname();
  const firstPath = pathname.split("/")[2];

  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  function menuList(item: ISideBarMenuList) {
    const itemFirstPath = item.path?.split("/")[2];
    return (
      <SidebarMenu
        key={item.path}
        active={firstPath === itemFirstPath}
        icon={item.icon}
        path={item.path}
        label={item.label}
        onClick={() => setShow(false)}
      />
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <IconButton
          onClick={() => setShow(!show)}
          className="bg-white shadow-lg hover:bg-gray-50"
        >
          {show ? (
            <MdClose className="w-6 h-6" />
          ) : (
            <MdMenu className="w-6 h-6" />
          )}
        </IconButton>
      </div>

      {/* Overlay */}
      {show && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShow(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 z-40
          h-screen w-[280px]
          bg-white/80 backdrop-blur-xl
          transition-transform duration-300
          lg:translate-x-0
          ${show ? "translate-x-0" : "-translate-x-full"}
          border-r border-gray-200/50
          flex flex-col
        `}
      >
        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-xl font-semibold text-gray-800">
              DM Medical
            </span>
          </div>

          <nav className="space-y-2">
            {sidebarData.map((item) => menuList(item))}
          </nav>
        </div>
      </aside>
    </>
  );
}
