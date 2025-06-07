"use client";

import Button from "@/components/Button";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

function NotFoundContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-primary-main">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan kembali ke halaman utama.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-primary-main hover:bg-primary-dark text-white px-6 py-3 rounded-lg inline-flex items-center"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
