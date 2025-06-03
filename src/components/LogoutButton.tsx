"use client";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { createClient } from "@/utils/supabase/client";

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
      className="bg-red-500 hover:bg-red-600 active:bg-red-400"
    >
      LOGOUT
    </Button>
  );
}
