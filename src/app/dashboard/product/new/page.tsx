"use client";
import Button from "@/components/Button";
import { Card, CardBody } from "@/components/Card";
import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import InputAutocompleteOptional from "@/components/InputAutocompleteOptional";
import InputText from "@/components/InputText";
import PageTitle from "@/components/PageTitle";
import UploadBoxCropperArea from "@/components/uploadBoxCropper";
import GalleryUploader from "@/components/GalleryUploader";
import Image360Uploader from "@/components/Image360Uploader";
import MigrationHelper from "@/components/MigrationHelper";
import { ILabelValue } from "@/types/IlabelValue";
import { IReqCreateNewProduct } from "@/types/IReqCreateNewProduct";
import { createClient } from "@/utils/supabase/client";
import { FormikProvider, useFormik } from "formik";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdMedicalServices,
  MdLocalHospital,
  MdInventory,
} from "react-icons/md";

const InputEditor = dynamic(() => import("@/components/CKeditor"), {
  ssr: false,
});

export default function newProductPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [dataCategory, setDataCategory] = useState<ILabelValue<string>[]>([]);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    supabase
      .from("category")
      .select()
      .then((e) => {
        if (e.data) {
          const data: ILabelValue<string>[] = e.data.map((v) => {
            return {
              label: v.name,
              value: v.id,
            };
          });
          setDataCategory(data);
        }
      });
  }, []);

  async function onCreateCategory(e: string) {
    console.log("Creating/finding category for:", e);

    try {
      // First, try to find existing category by ID
      if (!isNaN(parseInt(e))) {
        const { data } = await supabase
          .from("category")
          .select()
          .eq("id", parseInt(e));

        if (data?.[0]) {
          console.log("Found existing category:", data[0]);
          return data[0].id;
        }
      }

      // If not found by ID, try to create new category
      console.log("Creating new category with name:", e);
      const { data, error } = await supabase
        .from("category")
        .insert([{ name: e }])
        .select();

      if (error) {
        console.error(
          "Category creation error:",
          JSON.stringify(error, null, 2)
        );
        return null;
      }

      if (data && data.length > 0) {
        console.log("Created new category:", data[0]);
        return data[0].id;
      } else {
        console.warn("No data returned after category insert.");
        return null;
      }
    } catch (error) {
      console.error("Category creation unexpected error:", error);
      return null;
    }
  }

  const handleCreate = async (e: IReqCreateNewProduct) => {
    setLoading(true);
    try {
      // Validate required fields
      if (!e.name || !e.description || !e.image_url) {
        setLoading(false);
        toast.error("Nama produk, deskripsi, dan gambar utama wajib diisi");
        return;
      }

      // Test database connection first
      console.log("Testing database connection...");
      try {
        const { data: testData, error: testError } = await supabase
          .from("product")
          .select("id")
          .limit(1);

        if (testError && testError.code !== "42P01") {
          console.error("Database connection test failed:", testError);
          setLoading(false);
          toast.error("Koneksi database bermasalah. Coba lagi nanti.");
          return;
        }
        console.log("Database connection test passed");
      } catch (connError) {
        console.error("Database connection exception:", connError);
        setLoading(false);
        toast.error("Tidak dapat terhubung ke database");
        return;
      }

      const idCategory = await onCreateCategory(e.category_id);
      if (!idCategory) {
        setLoading(false);
        toast.error("Gagal membuat kategori");
        return;
      } // Prepare data for database
      const productData: any = {
        name: e.name?.trim() || "",
        description: e.description?.trim() || "",
        image_url: e.image_url?.trim() || "",
        wa_link: e.wa_link?.trim() || "",
        shopee_link: e.shopee_link?.trim() || "",
        tokopedia_link: e.tokopedia_link?.trim() || "",
        bukalapak_link: e.bukalapak_link?.trim() || "",
        category_id: idCategory.toString(),
      };

      // Only add gallery_images if it exists and has content
      if (e.gallery_images && e.gallery_images.length > 0) {
        try {
          productData.gallery_images = JSON.stringify(e.gallery_images);
        } catch (err) {
          console.warn("Failed to stringify gallery_images:", err);
        }
      }

      // Only add images360 if it exists and has content
      if (e.images360 && e.images360.length > 0) {
        try {
          productData.images360 = JSON.stringify(e.images360);
        } catch (err) {
          console.warn("Failed to stringify images360:", err);
        }
      }

      // Check for potential data issues
      const dataIssues = [];
      if (!productData.name) dataIssues.push("name is empty");
      if (!productData.description) dataIssues.push("description is empty");
      if (!productData.image_url) dataIssues.push("image_url is empty");
      if (!productData.category_id) dataIssues.push("category_id is empty");

      if (dataIssues.length > 0) {
        setLoading(false);
        toast.error(`Data tidak valid: ${dataIssues.join(", ")}`);
        return;
      }

      // Insert product to database
      let insertAttempt;
      try {
        insertAttempt = await supabase
          .from("product")
          .insert([productData])
          .select();
      } catch (error) {
        console.error("Exception during insert:", error);
        setLoading(false);
        toast.error(
          `Insert failed with exception: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        return;
      }

      console.log("Insert attempt result:", insertAttempt);
      const { error, data } = insertAttempt;

      // Additional validation of the response
      if (!insertAttempt) {
        console.error("Insert attempt returned null/undefined");
        setLoading(false);
        toast.error("Database connection failed");
        return;
      }

      setLoading(false);

      if (error) {
        console.error("Insert error details:", JSON.stringify(error, null, 2));
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        console.error("Error details:", error.details);
        console.error("Error hint:", error.hint);
        console.error("Full error object:", error);

        // Handle specific error types
        if (
          error.code === "42703" ||
          (error.message?.includes("column") &&
            error.message?.includes("does not exist"))
        ) {
          toast.error(
            "Database schema tidak up-to-date. Silakan jalankan migration SQL terlebih dahulu."
          );
          console.warn(
            "Database migration required. Run the add_images360_column.sql script."
          );
          setLoading(false);
          return;
        }

        if (error.code === "23502" || error.message?.includes("null value")) {
          toast.error(
            "Ada field wajib yang belum diisi. Pastikan nama, deskripsi, dan gambar sudah terisi."
          );
          setLoading(false);
          return;
        }

        if (error.code === "23505" || error.message?.includes("duplicate")) {
          toast.error(
            "Produk dengan nama ini sudah ada. Gunakan nama yang berbeda."
          );
          setLoading(false);
          return;
        }

        // Check if it's a column not found error (gallery_images or images360 doesn't exist)
        if (
          error.message?.includes("gallery_images") ||
          error.message?.includes("images360")
        ) {
          // Retry without gallery_images and images360
          const fallbackData = { ...productData };
          delete fallbackData.gallery_images;
          delete fallbackData.images360;

          console.log(
            "Retrying without gallery_images and images360:",
            fallbackData
          );

          const { error: retryError, data: retryData } = await supabase
            .from("product")
            .insert([fallbackData])
            .select();

          if (retryError) {
            toast.error(`Gagal buat produk: ${retryError.message}`);
            return;
          }
          toast.success("Produk berhasil dibuat (tanpa gallery dan 360°)");
          console.warn(
            "Gallery dan 360° feature tidak tersedia - jalankan migration SQL terlebih dahulu"
          );
          router.push("/dashboard/product");
          return;
        }

        toast.error(`Gagal buat produk: ${error.message || "Unknown error"}`);
        return;
      }

      console.log("Product created successfully:", data);
      toast.success("Produk berhasil dibuat");
      router.push("/dashboard/product");
    } catch (error: any) {
      setLoading(false);
      console.error("Unexpected error:", error);
      toast.error(`Terjadi kesalahan: ${error.message || "Unknown error"}`);
    }
  };
  const initValue: IReqCreateNewProduct = {
    description: "",
    image_url: "",
    gallery_images: [],
    images360: [],
    name: "",
    bukalapak_link: "",
    category_id: "",
    shopee_link: "",
    tokopedia_link: "",
    wa_link: "",
  };

  const formik = useFormik({
    initialValues: initValue,
    onSubmit: (e) => handleCreate(e),
  });

  return (
    <DashboardLayout>
      <DashboardContainer>
        {" "}
        <div className="space-y-4 sm:space-y-6 px-3 sm:px-0 max-w-4xl mx-auto">
          {/* Migration Helper - only show in development */}
          {process.env.NODE_ENV === "development" && <MigrationHelper />}

          {/* Header */}
          <div className="flex items-center gap-3 sm:gap-4 bg-white p-4 sm:p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg flex-shrink-0">
              <MdLocalHospital className="text-xl text-white" />
            </div>
            <div>
              <PageTitle
                title="Tambah Alat Kesehatan"
                className="text-lg sm:text-xl"
              />
              <p className="text-gray-500 text-sm">
                Lengkapi informasi detail alat kesehatan untuk katalog
              </p>
            </div>
          </div>

          <FormikProvider value={formik}>
            <Card>
              {" "}
              <CardBody className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Media Section Header */}
                  <div className="bg-blue-50/70 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 text-primary-main font-medium text-base mb-2">
                      <MdMedicalServices className="text-xl" />
                      Media Alat Kesehatan
                    </div>
                    <p className="text-sm text-gray-600">
                      Upload foto dan video alat kesehatan dengan pencahayaan
                      yang baik
                    </p>
                  </div>
                  {/* Media Upload - Mobile Optimized */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Main Product Image - Priority */}
                    <div className="w-full p-4 border-2 border-blue-200 rounded-lg bg-blue-50/30">
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        📸 Foto Produk Utama (Wajib)
                      </label>
                      <div className="text-sm text-gray-600 mb-3">
                        Upload foto utama produk dengan kualitas terbaik
                      </div>
                      <UploadBoxCropperArea
                        folderName="POST"
                        ratio={1}
                        onChange={(e) => formik.setFieldValue("image_url", e)}
                        value={formik.values.image_url}
                      />
                    </div>
                    {/* Secondary uploads - collapsible on mobile */}{" "}
                    {/* Gallery Images - Full width */}
                    <div className="w-full p-4 border border-green-200 rounded-lg bg-green-50/30">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        🖼️ Gallery Foto Produk
                      </label>
                      <div className="text-sm text-gray-600 mb-3">
                        Upload beberapa foto produk dari sudut berbeda
                      </div>
                      <GalleryUploader
                        value={formik.values.gallery_images}
                        onChange={(images) =>
                          formik.setFieldValue("gallery_images", images)
                        }
                        maxImages={5}
                        folderName="gallery"
                      />
                    </div>
                    {/* 360 Images - Full width */}
                    <div className="w-full p-4 border border-orange-200 rounded-lg bg-orange-50/30">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        🔄 Foto 360° Produk
                      </label>
                      <div className="text-sm text-gray-600 mb-3">
                        Upload folder yang berisi foto-foto 360° produk
                      </div>
                      <Image360Uploader
                        value={formik.values.images360}
                        onChange={(images) =>
                          formik.setFieldValue("images360", images)
                        }
                        maxImages={36}
                        folderName="360-images"
                      />
                    </div>
                  </div>{" "}
                  {/* Form Fields - Mobile Optimized */}
                  <div className="space-y-4">
                    <InputText
                      label="Nama Alat Kesehatan"
                      placeholder="Contoh: Stetoskop Digital Premium"
                      id="name"
                      name="name"
                      required
                      labelClassName="text-base font-medium"
                      inputClassName="text-base p-4 h-auto min-h-[48px]"
                      containerClassName="gap-2"
                    />

                    <InputAutocompleteOptional
                      name="category_id"
                      placeholder="Contoh: Alat Diagnostik"
                      label="Kategori Alat Kesehatan"
                      required
                      options={dataCategory || []}
                      labelClassName="text-base font-medium"
                      inputClassName="text-base p-4 h-auto min-h-[48px]"
                      containerClassName="gap-2"
                    />

                    {/* Purchase Links Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-700 font-medium text-base mb-4">
                        <MdInventory className="text-xl text-secondary-main" />
                        Link Pembelian
                      </div>

                      <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
                        <InputText
                          label="WhatsApp"
                          placeholder="Link konsultasi via WhatsApp"
                          id="wa_link"
                          name="wa_link"
                          required
                          labelClassName="text-sm font-medium"
                          inputClassName="text-base p-3 h-auto min-h-[48px]"
                          containerClassName="gap-2"
                        />
                        <InputText
                          label="Tokopedia"
                          placeholder="Link pembelian di Tokopedia"
                          id="tokopedia_link"
                          name="tokopedia_link"
                          required
                          labelClassName="text-sm font-medium"
                          inputClassName="text-base p-3 h-auto min-h-[48px]"
                          containerClassName="gap-2"
                        />
                        <InputText
                          label="Shopee"
                          placeholder="Link pembelian di Shopee"
                          id="shopee_link"
                          name="shopee_link"
                          required
                          labelClassName="text-sm font-medium"
                          inputClassName="text-base p-3 h-auto min-h-[48px]"
                          containerClassName="gap-2"
                        />
                        <InputText
                          label="Bukalapak"
                          placeholder="Link pembelian di Bukalapak"
                          id="bukalapak_link"
                          name="bukalapak_link"
                          required
                          labelClassName="text-sm font-medium"
                          inputClassName="text-base p-3 h-auto min-h-[48px]"
                          containerClassName="gap-2"
                        />
                      </div>
                    </div>

                    {/* Editor untuk deskripsi */}
                    {editorLoaded && (
                      <div className="space-y-3">
                        <label className="text-base font-medium text-gray-700 block">
                          Spesifikasi & Detail Produk
                        </label>
                        <div className="text-sm text-gray-600 mb-3">
                          Jelaskan spesifikasi teknis, manfaat, dan cara
                          penggunaan alat kesehatan secara detail
                        </div>
                        <InputEditor
                          editorLoaded={editorLoaded}
                          name="description"
                          onChange={(e) =>
                            formik.setFieldValue("description", e)
                          }
                          value={formik.values.description}
                        />
                      </div>
                    )}

                    {/* Submit button - Mobile optimized */}
                    <div className="pt-4">
                      <Button
                        loading={loading}
                        onClick={() => formik.handleSubmit()}
                        className="w-full bg-primary-main hover:bg-primary-dark text-white font-medium text-base p-4 min-h-[52px] rounded-lg shadow-md transition-all duration-200"
                      >
                        {loading ? "Menyimpan..." : "Simpan Alat Kesehatan"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </FormikProvider>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
