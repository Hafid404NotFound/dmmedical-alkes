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
      />
    );
  }

  return (
    <>
      <div>
        <div className="w-full h-16 lg:hidden fixed bg-white border-b shadow-lg flex items-center justify-between">
          <DashboardContainer>
            <div className="flex items-center justify-between  w-full">
              <div className="flex gap-2 items-center ">
                <div
                  onClick={handleLogout}
                  className="h-4 w-4 rounded-full bg-[#F8625D] cursor-pointer"></div>
                <div className="h-4 w-4 rounded-full bg-[#F7BB3F]"></div>
                <div className="h-4 w-4 rounded-full bg-[#34C749]"></div>
              </div>
              <div>
                <IconButton onClick={() => setShow((e) => !e)}>
                  {!show ? <MdMenu /> : <MdClose />}
                </IconButton>
              </div>
            </div>
          </DashboardContainer>
        </div>
        <div className="h-top-bar-height lg:hidden grid"></div>
      </div>
      <div className="w-sidebar-width ">
        <div
          className={`fixed top-0 h-screen duration-700 border-r w-sidebar-width  bg-white ${
            show ? "translate-x-0" : "lg:translate-x-0 -translate-x-96"
          }`}>
          <div className="h-top-bar-height border-b px-4 flex items-center">
            <div className="flex h-full text-xl font-semibold gap-2 text-primary-main">
              <div className="flex gap-2 items-center flex-1">
                <div
                  onClick={handleLogout}
                  className="h-4 w-4 rounded-full bg-[#F8625D] cursor-pointer"></div>
                <div className="h-4 w-4 rounded-full bg-[#F7BB3F]"></div>
                <div className="h-4 w-4 rounded-full bg-[#34C749]"></div>
              </div>
            </div>
          </div>
          <div className="p-4 grid gap-1">
            {sidebarData.map((item, i) => (
              <Fragment key={i}>{menuList(item)}</Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
