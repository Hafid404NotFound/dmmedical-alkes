"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { MdDelete, MdWarning, MdClose } from "react-icons/md";
import { toast } from "react-hot-toast";

interface DeleteMessageButtonProps {
  messageId: number;
  messageName: string;
  messagePreview?: string;
  onDeleteSuccess?: () => void;
}

export default function DeleteMessageButton({
  messageId,
  messageName,
  messagePreview,
  onDeleteSuccess,
}: DeleteMessageButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/message/delete?id=${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Pesan berhasil dihapus");
        setShowConfirmation(false);

        // Refresh halaman atau panggil callback
        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Gagal menghapus pesan");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Terjadi kesalahan saat menghapus pesan");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      {" "}
      <button
        onClick={() => setShowConfirmation(true)}
        className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg hover:from-red-100 hover:to-red-200 hover:border-red-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 group"
        title="Hapus pesan"
        disabled={isDeleting}
      >
        <MdDelete className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
        <span className="hidden sm:inline">Hapus</span>
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
                  Apakah Anda yakin ingin menghapus pesan dari{" "}
                  <span className="font-semibold text-gray-900">
                    {messageName}
                  </span>
                  ?
                </p>

                {messagePreview && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Preview Pesan:
                    </p>
                    <p className="text-sm text-gray-700 italic">
                      "{messagePreview}"
                    </p>
                  </div>
                )}

                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MdWarning className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        ⚠️ Peringatan Penting
                      </p>
                      <p className="text-sm text-red-700">
                        Data yang dihapus tidak dapat dipulihkan. Pastikan Anda
                        yakin dengan keputusan ini.
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
                      Hapus Pesan
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
