"use client";
import { MdDelete } from "react-icons/md";
import IconButton from "./IconButton";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import { data } from "framer-motion/client";
import { IReview } from "@/types/IReview";

export default function DeleteReviewButton(props: IProps) {
  const supabase = createClient();
  async function onDelete() {
    window.location.reload();
    try {
      const { error } = await supabase
        .from("review")
        .delete()
        .eq("id", props.data.id);
      if (error) throw error;
      toast.success("Review berhasil dihapus");
    } catch (error) {
      toast.error("Gagal hapus review");
      console.error("Insert error:", error);
    }
  }
  return (
    <IconButton onClick={onDelete}>
      <MdDelete className="text-red-800" />
    </IconButton>
  );
}

interface IProps {
  data: IReview;
}
