import { ReactNode } from "react";
import SidebarDashboard from "./SidebarDashboard";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout(props: IProps) {
  return (
    <div className="grid lg:flex">
      <SidebarDashboard />
      <Toaster position="top-center" />
      <div className="flex-1 mt-10 ">{props.children}</div>
    </div>
  );
}

interface IProps {
  children: ReactNode;
}
