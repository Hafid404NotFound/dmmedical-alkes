"use client";
import Button from "@/components/Button";
import { Card, CardBody } from "@/components/Card";
import SafeCKEditor from "@/components/SafeCKEditor";
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
import { IProduct } from "@/types/IProduct";
import { IReqCreateNewProduct } from "@/types/IReqCreateNewProduct";
import { createClient } from "@/utils/supabase/client";
import { FormikProvider, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdLocalHospital,
  MdMedicalServices,
  MdSave,
  MdLink,
  MdDescription,
  MdCategory,
  MdDriveFileRenameOutline,
  MdCloudUpload,
  MdInventory,
} from "react-icons/md";

export default function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IProduct | undefined>(undefined);
  const [dataCategory, setDataCategory] = useState<ILabelValue<string>[]>([]);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      supabase
        .from("product")
        .select()
        .eq("id", id)
        .single() // Use single to get one record or null
        .then(({ data: productData, error }) => {
          if (error) {
            console.error("Error fetching product:", error);
            toast.error("Gagal memuat data produk.");
            // router.push("/dashboard/product"); // Optional: redirect if product not found or error
            return;
          }
          if (productData) {
            setData(productData as IProduct);
          } else {
            toast.error("Produk tidak ditemukan.");
            // router.push("/dashboard/product"); // Optional: redirect
          }
        });
    }
  }, [id, supabase, router]); // Added supabase and router to dependency array
  const handleEdit = async (e: IReqCreateNewProduct) => {
    setLoading(true);
    try {
      const idCategory = await onCreateCategory(e.category_id);
      if (!idCategory) {
        toast.error("Kategori tidak valid.");
        setLoading(false);
        return;
      }

      // Prepare data for database
      const productData: any = {
        name: e.name?.trim() || "",
        description: e.description?.trim() || "",
        image_url: e.image_url?.trim() || "",
        wa_link: e.wa_link?.trim() || "",
        shopee_link: e.shopee_link?.trim() || "",
        tokopedia_link: e.tokopedia_link?.trim() || "",
        bukalapak_link: e.bukalapak_link?.trim() || "",
        category_id: idCategory,
      };

      // Always update gallery_images (even if empty to clear existing data)
      try {
        productData.gallery_images =
          e.gallery_images && e.gallery_images.length > 0
            ? JSON.stringify(e.gallery_images)
            : null; // Set to null to clear existing data
        console.log(
          "Updated gallery_images:",
          productData.gallery_images ? "with data" : "cleared"
        );
      } catch (err) {
        console.warn("Failed to process gallery_images:", err);
        productData.gallery_images = null;
      }

      // Always update images360 (even if empty to clear existing data)
      try {
        productData.images360 =
          e.images360 && e.images360.length > 0
            ? JSON.stringify(e.images360)
            : null; // Set to null to clear existing data
        console.log(
          "Updated images360:",
          productData.images360 ? "with data" : "cleared"
        );
      } catch (err) {
        console.warn("Failed to process images360:", err);
        productData.images360 = null;
      }

      const { error } = await supabase
        .from("product")
        .update(productData)
        .eq("id", id);

      if (error) throw error;
      toast.success("Produk berhasil diupdate");
      router.push("/dashboard/product/" + id);
    } catch (error) {
      toast.error("Gagal update produk");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
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
    onSubmit: (e) => handleEdit(e),
    enableReinitialize: true, // Important for re-populating form when `data` changes
  });

  async function onCreateCategory(e: string) {
    // Check if e is a valid number (existing category ID)
    if (!isNaN(parseInt(e))) {
      const { data: existingCategory, error: fetchError } = await supabase
        .from("category")
        .select("id")
        .eq("id", parseInt(e))
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116: "Searched item was not found"
        console.error("Error fetching category:", fetchError);
        return null;
      }
      if (existingCategory) {
        return existingCategory.id;
      }
    }

    // If not a valid existing ID, or if it's a new category name (string)
    // Try to find by name first if it's a string that might match an existing name
    const { data: namedCategory, error: namedFetchError } = await supabase
      .from("category")
      .select("id")
      .ilike("name", e) // Case-insensitive match
      .single();

    if (namedFetchError && namedFetchError.code !== "PGRST116") {
      console.error("Error fetching category by name:", namedFetchError);
    }
    if (namedCategory) {
      return namedCategory.id;
    }

    // If still not found, insert as new category
    const { data: newCategoryData, error: insertError } = await supabase
      .from("category")
      .insert([{ name: e }])
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert category error:", insertError);
      return null;
    }
    return newCategoryData?.id || null;
  }

  useEffect(() => {
    if (data) {
      formik.setValues({
        description: data.description || "",
        image_url: data.image_url || "",
        name: data.name || "",
        bukalapak_link: data.bukalapak_link || "",
        wa_link: data.wa_link || "",
        category_id: String(data.category_id) || "", // Ensure category_id is a string for Autocomplete
        tokopedia_link: data.tokopedia_link || "",
        shopee_link: data.shopee_link || "",
        gallery_images: (() => {
          try {
            if (typeof data.gallery_images === "string") {
              return JSON.parse(data.gallery_images) || [];
            }
            return Array.isArray(data.gallery_images)
              ? data.gallery_images
              : [];
          } catch {
            return [];
          }
        })(),
        images360: (() => {
          try {
            if (typeof data.images360 === "string") {
              return JSON.parse(data.images360) || [];
            }
            return Array.isArray(data.images360) ? data.images360 : [];
          } catch {
            return [];
          }
        })(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]); // formik instance is stable, setValues is also stable

  useEffect(() => {
    supabase
      .from("category")
      .select("id, name")
      .then((e) => {
        if (e.data) {
          const categories: ILabelValue<string>[] = e.data.map((v) => ({
            label: String(v?.name),
            value: String(v?.id),
          }));
          setDataCategory(categories);
        }
      });
  }, [supabase]); // Added supabase to dependency array

  return (
    <DashboardLayout>
      <DashboardContainer>
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
                title="Edit Alat Kesehatan"
                className="text-lg sm:text-xl"
              />
              <p className="text-gray-500 text-sm">
                Perbarui informasi detail alat kesehatan untuk katalog
              </p>
            </div>
          </div>

          <FormikProvider value={formik}>
            {" "}
            <Card>
              <CardBody className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Migration Helper - only show in development */}
                  {process.env.NODE_ENV === "development" && (
                    <MigrationHelper />
                  )}
                  {/* Media Section */}
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
                  </div>
                  {/* Product Info Section */}
                  <div className="bg-gray-50/50 p-4 sm:p-5 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-primary-main font-semibold mb-3">
                      <MdMedicalServices className="text-xl sm:text-2xl" />
                      <h2 className="text-base sm:text-lg">
                        Informasi Dasar Produk
                      </h2>
                    </div>
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
                          />{" "}
                        </div>
                      </div>

                      {/* Editor untuk deskripsi */}
                      <div className="space-y-3">
                        <label className="text-base font-medium text-gray-700 block">
                          Spesifikasi & Detail Produk
                        </label>
                        <div className="text-sm text-gray-600 mb-3">
                          Jelaskan spesifikasi teknis, manfaat, dan cara
                          penggunaan alat kesehatan secara detail
                        </div>
                        <SafeCKEditor
                          name="description"
                          onChange={(content: string) =>
                            formik.setFieldValue("description", content)
                          }
                          value={formik.values.description}
                        />
                      </div>

                      {/* Submit button - Mobile optimized */}
                      <div className="pt-4">
                        <Button
                          loading={loading}
                          onClick={() => formik.handleSubmit()}
                          className="w-full bg-primary-main hover:bg-primary-dark text-white font-medium text-base p-4 min-h-[52px] rounded-lg shadow-md transition-all duration-200"
                        >
                          {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                      </div>
                    </div>
                  </div>{" "}
                </div>
              </CardBody>
            </Card>
          </FormikProvider>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
