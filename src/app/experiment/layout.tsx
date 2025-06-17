import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eksperimen 360° Viewer - DM Medical Alkes",
  description:
    "Studi komparatif untuk menentukan jumlah optimal gambar dalam viewer 360° untuk produk alat kesehatan",
};

export default function ExperimentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
