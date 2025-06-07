import { createClient } from "./server";

export async function trackPageVisit() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

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
}

export async function trackAdminLogin() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // First try to update existing record
  const { data: existingRecord } = await supabase
    .from("analytics")
    .select()
    .eq("type", "login")
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
      type: "login",
      date: today,
      count: 1,
      created_at: new Date().toISOString(),
    });
  }
}
