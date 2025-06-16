"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MdAdd,
  MdDelete,
  MdDragIndicator,
  MdPhotoLibrary,
} from "react-icons/md";
import { UploadService } from "@/services/upload.service";
import toast from "react-hot-toast";

interface GalleryUploaderProps {
  value?: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  folderName?: string;
}

export default function GalleryUploader({
  value = [],
  onChange,
  maxImages = 5,
  folderName = "gallery",
}: GalleryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const uploadService = new UploadService();

  const handleFileUpload = async (files: FileList) => {
    if (value.length + files.length > maxImages) {
      toast.error(`Maksimal ${maxImages} foto gallery`);
      return;
    }

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const imageUrl = await uploadService.uploadBlob(file, folderName);
        return imageUrl;
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Gagal upload ${file.name}`);
        return null;
      }
    });
    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(
        (url): url is string => typeof url === "string"
      );

      if (validUrls.length > 0) {
        onChange([...value, ...validUrls]);
        toast.success(`${validUrls.length} foto berhasil diupload`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat upload");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
    toast.success("Foto dihapus");
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...value];
    const draggedImage = newImages[draggedIndex];

    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    onChange(newImages);
    setDraggedIndex(null);
    toast.success("Urutan foto diubah");
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-main transition-colors duration-200 bg-gray-50/50"
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="gallery-upload"
          disabled={uploading || value.length >= maxImages}
        />

        <label
          htmlFor="gallery-upload"
          className={`flex flex-col items-center justify-center cursor-pointer ${
            uploading || value.length >= maxImages
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <MdPhotoLibrary className="text-4xl text-gray-400 mb-2" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">
              {uploading ? "Mengupload..." : "Upload Foto Gallery"}
            </p>
            <p className="text-xs text-gray-500">
              Drag & drop atau klik untuk memilih ({value.length}/{maxImages})
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP (Max 5MB per file)
            </p>
          </div>
        </label>
      </div>

      {/* Gallery Preview */}
      {value.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MdPhotoLibrary className="text-lg" />
            Gallery Foto ({value.length})
            {value.length > 1 && (
              <span className="text-xs text-gray-500">
                (Drag untuk mengatur urutan)
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {value.map((imageUrl, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`relative group border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                  draggedIndex === index
                    ? "border-primary-main shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="aspect-square relative">
                  <Image
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                      <button
                        onClick={() => removeImage(index)}
                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200"
                        title="Hapus foto"
                      >
                        <MdDelete className="text-sm" />
                      </button>

                      {value.length > 1 && (
                        <div className="p-1.5 bg-white/20 text-white rounded-full cursor-move">
                          <MdDragIndicator className="text-sm" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Index Badge */}
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            {value.length < maxImages && (
              <label
                htmlFor="gallery-upload"
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-main hover:bg-primary-main/5 transition-all duration-200"
              >
                <div className="text-center">
                  <MdAdd className="text-2xl text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Tambah</span>
                </div>
              </label>
            )}
          </div>
        </div>
      )}

      {uploading && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-primary-main">
            <div className="w-4 h-4 border-2 border-primary-main border-t-transparent rounded-full animate-spin"></div>
            Mengupload foto...
          </div>
        </div>
      )}
    </div>
  );
}
