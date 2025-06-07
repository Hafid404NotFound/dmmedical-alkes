import { ReactNode } from "react";
import SidebarDashboard from "./SidebarDashboard";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout(props: IProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Medical themed decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Soft gradients for medical theme */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100/20 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-main/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Medical cross patterns */}
        <div className="absolute inset-0 opacity-[0.02]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute text-4xl ${
                i % 2 === 0 ? "text-primary-main" : "text-secondary-main"
              }`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 45}deg)`,
              }}
            >
              +
            </div>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="relative flex flex-col lg:flex-row min-h-screen">
        <SidebarDashboard />

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            className: "bg-white shadow-lg rounded-lg p-4",
          }}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-200">
          <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-lg p-4 sm:p-6 min-h-[calc(100vh-2rem)] transition-all duration-200">
            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
}

interface IProps {
  children: ReactNode;
}
