"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { UploadService } from "@/services/upload.service";
import { MdUpload, MdDelete, MdRotateRight, MdPhoto } from "react-icons/md";

interface Image360UploaderProps {
  value?: string[];
  onChange: (images: string[]) => void;
  folderName?: string;
  maxImages?: number;
}

export default function Image360Uploader({
  value = [],
  onChange,
  folderName = "360-images",
  maxImages = 36,
}: Image360UploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadService = new UploadService();

  const handleFolderUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Filter only image files and sort them
    const imageFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (imageFiles.length === 0) {
      toast.error("Tidak ada file gambar yang ditemukan dalam folder");
      return;
    }

    if (imageFiles.length > maxImages) {
      toast.error(`Maksimal ${maxImages} gambar yang diizinkan`);
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const uploadResult = await uploadService.uploadBlob(file, folderName);

        if (uploadResult) {
          uploadedUrls.push(uploadResult);

          // Update progress
          toast.loading(
            `Mengupload gambar ${i + 1} dari ${imageFiles.length}...`,
            {
              id: "upload-progress",
            }
          );
        } else {
          throw new Error(`Gagal upload ${file.name}`);
        }
      }

      onChange([...value, ...uploadedUrls]);
      toast.success(`Berhasil mengupload ${uploadedUrls.length} gambar 360°`, {
        id: "upload-progress",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Gagal mengupload: ${error}`, {
        id: "upload-progress",
      });
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);

    // Adjust current index if needed
    if (currentIndex >= newImages.length && newImages.length > 0) {
      setCurrentIndex(newImages.length - 1);
    } else if (newImages.length === 0) {
      setCurrentIndex(0);
    }
  };

  const removeAllImages = () => {
    onChange([]);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    if (value.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % value.length);
    }
  };

  const prevImage = () => {
    if (value.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + value.length) % value.length);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        {" "}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          // @ts-ignore - webkitdirectory is not in TypeScript types but is valid HTML
          webkitdirectory=""
          accept="image/*"
          onChange={handleFolderUpload}
          className="hidden"
          disabled={uploading}
        />
        {value.length === 0 ? (
          <div className="space-y-3">
            <MdPhoto className="text-4xl text-gray-400 mx-auto" />
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Upload Folder Gambar 360°
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Pilih folder yang berisi gambar-gambar 360° (maksimal{" "}
                {maxImages} gambar)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90 disabled:opacity-50 text-sm"
              >
                <MdUpload className="text-lg" />
                {uploading ? "Mengupload..." : "Pilih Folder"}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Tips: Beri nama file dengan urutan (contoh: 001.jpg, 002.jpg, dst)
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {value.length} gambar 360° tersimpan
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  + Tambah Folder
                </button>
                <button
                  type="button"
                  onClick={removeAllImages}
                  className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Hapus Semua
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 360° Viewer */}
      {value.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Preview 360°</h4>
            <div className="text-xs text-gray-500">
              Gambar {currentIndex + 1} dari {value.length}
            </div>
          </div>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
            <Image
              src={value[currentIndex]}
              alt={`360° view ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 50vw"
            />

            {/* Navigation Controls */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                type="button"
                onClick={prevImage}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                disabled={value.length <= 1}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                disabled={value.length <= 1}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Auto rotate button */}
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={() => {
                  const interval = setInterval(() => {
                    setCurrentIndex((prev) => (prev + 1) % value.length);
                  }, 200);

                  setTimeout(() => {
                    clearInterval(interval);
                  }, value.length * 200);
                }}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                title="Putar otomatis"
              >
                <MdRotateRight className="text-lg" />
              </button>
            </div>
          </div>{" "}
          {/* Thumbnail Strip */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {value.map((image, index) => (
              <div
                key={index}
                className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                  index === currentIndex
                    ? "border-primary-main"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-xs z-10"
                  title="Hapus gambar"
                >
                  <MdDelete className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
