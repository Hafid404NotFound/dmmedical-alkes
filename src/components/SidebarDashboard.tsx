"use client";

import { Fragment, useState, useEffect } from "react";
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
import IconButton from "./IconButton";

export default function SidebarDashboard() {
  const [show, setShow] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Close sidebar on route change in mobile view
  const pathname = usePathname();
  useEffect(() => {
    setShow(false);
  }, [pathname]);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const firstPath = pathname.split("/")[2];
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isMenuActive = (menuPath?: string): boolean => {
    if (!menuPath) return false;
    if (!firstPath) {
      return menuPath === "/dashboard";
    }
    return menuPath.includes(`/dashboard/${firstPath}`);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShow(!show)}
        className={`
          fixed top-4 left-4 z-50 lg:hidden
          p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg
          hover:bg-gray-50 active:scale-95
          transition-all duration-200
        `}
        aria-label={show ? "Close menu" : "Open menu"}
      >
        {show ? (
          <MdClose className="w-6 h-6 text-gray-700" />
        ) : (
          <MdMenu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Backdrop Overlay */}
      {show && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setShow(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          h-[100dvh] w-[280px]
          bg-white/95 backdrop-blur-sm shadow-lg lg:shadow-none
          transition-all duration-300 ease-in-out
          transform lg:transform-none
          ${show ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          border-r border-gray-100/50
          flex flex-col
          overflow-hidden
        `}
      >
        {/* Logo Section */}
        <div className="p-6 bg-gradient-to-b from-white to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-main to-secondary-main flex items-center justify-center shadow-lg">
              <MdInventory className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-main to-secondary-main bg-clip-text text-transparent">
                DM Medical
              </h1>
              <p className="text-sm text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-1">
          {sidebarData.map((item, index) => (
            <SidebarMenu
              key={index}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={isMenuActive(item.path)}
              onClick={() => setShow(false)}
            />
          ))}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-100/50 bg-gradient-to-t from-white to-transparent">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
