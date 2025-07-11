"use client";
import { createClient } from "@/utils/supabase/client";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast-helper";
import { useState } from "react";
import { createPortal } from "react-dom";
import { MdDelete, MdWarning, MdClose, MdLocalHospital } from "react-icons/md";

export function ButtonDeleteProduct(props: IProps) {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("product")
        .delete()
        .eq("id", props.id);

      if (error) {
        console.error("Error deleting:", error.message);
        showToast.error("Gagal menghapus produk");
      } else {
        showToast.success("Produk berhasil dihapus");
        router.push("/dashboard/product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast.error("Terjadi kesalahan saat menghapus produk");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        className="py-2 px-5 bg-red-700 hover:bg-red-800 active:bg-red-600 text-white rounded-md font-bold cursor-pointer duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setShowConfirmation(true)}
        disabled={isDeleting}
      >
        <MdDelete className="w-4 h-4" />
        <span className="hidden sm:inline">Hapus Produk</span>
      </button>

      {/* Enhanced Modal using Portal */}
      {showConfirmation &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => !isDeleting && setShowConfirmation(false)}
            />

            {/* Modal Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-in fade-in zoom-in">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                    <MdWarning className="text-red-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Konfirmasi Hapus
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tindakan tidak dapat dibatalkan
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !isDeleting && setShowConfirmation(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isDeleting}
                >
                  <MdClose className="text-gray-400 text-xl" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Apakah Anda yakin ingin menghapus produk ini?
                </p>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MdWarning className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        ⚠️ Peringatan Penting
                      </p>
                      <p className="text-sm text-red-700">
                        Data produk yang dihapus tidak dapat dipulihkan.
                        Pastikan Anda yakin dengan keputusan ini.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <MdDelete className="w-4 h-4" />
                      Hapus Produk
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

interface IProps {
  id: string;
}
