"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

function AnalyticsContent() {
  const pathname = usePathname();
  const supabase = createClient();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const trackVisit = async () => {
      // Skip tracking for internal paths and repeated visits to the same page
      if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === lastTrackedPath.current
      ) {
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      try {
        // First try to update existing record
        const { data: existingRecord } = await supabase
          .from("analytics")
          .select()
          .eq("type", "visit")
          .eq("date", today)
          .single();

        if (existingRecord) {
          // Update existing record
          await supabase
            .from("analytics")
            .update({ count: existingRecord.count + 1 })
            .eq("id", existingRecord.id);
        } else {
          // Create new record
          await supabase.from("analytics").insert({
            type: "visit",
            date: today,
            count: 1,
            created_at: new Date().toISOString(),
          });
        }

        lastTrackedPath.current = pathname;
      } catch (error) {
        console.error("Error tracking page visit:", error);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}
