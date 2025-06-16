import { MdInfo, MdWarning } from "react-icons/md";

export default function MigrationHelper() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  // return (
  //   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
  //     <div className="flex items-start gap-3">
  //       <MdInfo className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
  //       <div className="text-sm">
  //         <h3 className="font-semibold text-blue-800 mb-2">
  //           🔄 Migration Required - Fitur 360° Images
  //         </h3>{" "}
  //         <p className="text-blue-700 mb-3">
  //           Untuk menggunakan fitur foto 360° dan gallery, jalankan migration
  //           SQL berikut di Supabase:
  //         </p>
  //         <div className="bg-blue-100 p-3 rounded border text-blue-800 font-mono text-xs overflow-x-auto mb-3">
  //           <div>-- Step 1: Tambah kolom gallery_images (jika belum ada)</div>
  //           <div>
  //             ALTER TABLE product ADD COLUMN IF NOT EXISTS gallery_images JSONB
  //             DEFAULT '[]'::jsonb;
  //           </div>
  //           <div className="mt-2">
  //             -- Step 2: Tambah kolom images360 untuk fitur baru
  //           </div>
  //           <div>
  //             ALTER TABLE product ADD COLUMN IF NOT EXISTS images360 JSONB
  //             DEFAULT '[]'::jsonb;
  //           </div>
  //           <div className="mt-2">-- Step 3: Tambah index untuk performa</div>
  //           <div>
  //             CREATE INDEX IF NOT EXISTS idx_product_gallery_images ON product
  //             USING GIN (gallery_images);
  //           </div>
  //           <div>
  //             CREATE INDEX IF NOT EXISTS idx_product_images360 ON product USING
  //             GIN (images360);
  //           </div>
  //         </div>
  //         <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
  //           <p className="text-yellow-800 text-xs font-medium">
  //             ⚠️ Tanpa migration, fitur gallery dan 360° tidak akan berfungsi.
  //             Produk akan tetap bisa dibuat tapi tanpa fitur ini.
  //           </p>
  //         </div>
  //         <p className="text-blue-600 text-xs">
  //           File migration lengkap tersedia di:{" "}
  //           <code>add_images360_column.sql</code>
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // );
}
