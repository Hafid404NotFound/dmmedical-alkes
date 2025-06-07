import { ReactNode } from "react";
import SidebarDashboard from "./SidebarDashboard";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout(props: IProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Medical themed decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient backgrounds */}
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-green-100/20 rounded-full blur-3xl"></div>

        {/* Medical cross patterns - Hidden on mobile for cleaner look */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none hidden sm:block">
          <div className="absolute top-12 left-1/4 text-3xl sm:text-4xl text-primary-main">
            +
          </div>
          <div className="absolute top-1/3 right-1/4 text-3xl sm:text-4xl text-secondary-main">
            +
          </div>
          <div className="absolute bottom-1/4 left-1/3 text-3xl sm:text-4xl text-primary-main">
            +
          </div>
          <div className="absolute bottom-1/3 right-1/3 text-3xl sm:text-4xl text-secondary-main">
            +
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <SidebarDashboard />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg p-6 min-h-[calc(100vh-4rem)]">
            {props.children}
          </div>
        </main>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

interface IProps {
  children: ReactNode;
}
