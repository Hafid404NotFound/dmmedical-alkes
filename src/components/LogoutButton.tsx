"use client";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { createClient } from "@/utils/supabase/client";
import { MdLogout } from "react-icons/md"; // Import logout icon

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
  };
  return (
    <Button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 active:bg-red-400 text-white font-medium text-[10px] sm:text-xs p-1.5 sm:px-3 sm:py-2 rounded-lg flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-150"
    >
      <MdLogout className="text-sm sm:text-base" />
      <span className="hidden sm:inline">LOGOUT</span>
    </Button>
  );
}
