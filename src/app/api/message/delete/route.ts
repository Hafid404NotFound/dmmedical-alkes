import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("id");

    if (!messageId) {
      return NextResponse.json(
        { error: "ID pesan diperlukan" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Hapus pesan dari database
    const { error } = await (await supabase)
      .from("question")
      .delete()
      .eq("id", messageId);

    if (error) {
      console.error("Error deleting message:", error);
      return NextResponse.json(
        { error: "Gagal menghapus pesan" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Pesan berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
