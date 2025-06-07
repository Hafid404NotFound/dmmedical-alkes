import { createClient } from "./server";

export async function trackPageVisit() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Update analytics for visits
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
}

export async function trackAdminLogin() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Update analytics for logins
  await supabase.from("analytics").upsert(
    {
      type: "login",
      date: today,
      count: 1,
      created_at: new Date().toISOString(),
    },
    {
      onConflict: "type,date",
      ignoreDuplicates: false,
    }
  );
}
