"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
      return;
    }

    const trackPageVisit = async () => {
      const today = new Date().toISOString().split("T")[0];

      await supabase.from("analytics").upsert(
        {
          type: "visit",
          date: today,
          count: 1,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: "type,date",
          ignoreDuplicates: false,
        }
      );
    };

    trackPageVisit();
  }, [pathname, searchParams]);

  return null;
}
