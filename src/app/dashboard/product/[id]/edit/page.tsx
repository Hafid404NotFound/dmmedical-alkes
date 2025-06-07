"use client";
import Button from "@/components/Button";
import { Card, CardBody } from "@/components/Card";
import InputEditor from "@/components/CKeditor";
import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import InputAutocompleteOptional from "@/components/InputAutocompleteOptional";
import InputText from "@/components/InputText";
import PageTitle from "@/components/PageTitle";
import UploadBoxCropperArea from "@/components/uploadBoxCropper";
import VidioUplaoded from "@/components/VidioUploaded";
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
  MdCloudUpload, // Added for media section consistency
} from "react-icons/md";

export default function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [loading, setLoading] = useState<boolean>(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
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
            setEditorLoaded(true); // Assuming editor depends on this data
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
      const { error } = await supabase
        .from("product")
        .update({
          ...e,
          category_id: idCategory,
        })
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
    video_url: "",
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
        video_url: data.video_url || "",
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
        <div className="space-y-6 sm:space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg shrink-0">
                <MdLocalHospital className="text-xl sm:text-2xl text-white" />
              </div>
              <div>
                <PageTitle title="Edit Alat Kesehatan" />
                <p className="text-gray-500 text-xs sm:text-sm">
                  Perbarui informasi dan spesifikasi alat kesehatan Anda.
                </p>
              </div>
            </div>
          </div>

          <FormikProvider value={formik}>
            <Card>
              <CardBody>
                <div className="flex flex-col gap-6 sm:gap-8">
                  {/* Media Section */}
                  <div className="bg-gray-50/50 p-4 sm:p-5 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-primary-main font-semibold mb-3">
                      <MdCloudUpload className="text-xl sm:text-2xl" />
                      <h2 className="text-base sm:text-lg">
                        Media Alat Kesehatan
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5">
                      Upload foto dan video yang menampilkan detail alat
                      kesehatan dengan jelas.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white">
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                          Video Demonstrasi (Link YouTube/Vimeo)
                        </label>
                        <VidioUplaoded
                          value={formik.values.video_url}
                          onChange={(e) => formik.setFieldValue("video_url", e)}
                        />
                      </div>

                      <div className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white">
                        <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                          Foto Produk Utama
                        </label>
                        <UploadBoxCropperArea
                          folderName="POST"
                          ratio={1}
                          onChange={(e) => formik.setFieldValue("image_url", e)}
                          value={formik.values.image_url}
                        />
                      </div>
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
                    <div className="grid gap-4 sm:gap-5">
                      <InputText
                        label="Nama Alat Kesehatan"
                        placeholder="Contoh: Stetoskop Digital Premium"
                        id="name"
                        name="name"
                        required
                        startIcon={
                          <MdDriveFileRenameOutline className="text-gray-400" />
                        }
                      />

                      {dataCategory.length > 0 && (
                        <InputAutocompleteOptional
                          name="category_id"
                          placeholder="Pilih atau buat kategori baru"
                          label="Kategori Alat Kesehatan"
                          required
                          options={dataCategory}
                          value={formik.values.category_id}
                          onChange={(option) =>
                            formik.setFieldValue(
                              "category_id",
                              option ? option : ""
                            )
                          }
                        />
                      )}
                    </div>
                  </div>

                  {/* Marketplace Links Section */}
                  <div className="bg-gray-50/50 p-4 sm:p-5 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-primary-main font-semibold mb-3">
                      <MdLink className="text-xl sm:text-2xl" />
                      <h2 className="text-base sm:text-lg">
                        Link Pembelian (Opsional)
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5">
                      Tambahkan link ke halaman produk Anda di berbagai
                      marketplace.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputText
                        label="WhatsApp"
                        placeholder="Contoh: https://wa.me/62..."
                        id="wa_link"
                        name="wa_link"
                        // required // Kept as per original, but consider if truly required
                      />
                      <InputText
                        label="Tokopedia"
                        placeholder="Contoh: https://tokopedia.com/..."
                        id="tokopedia_link"
                        name="tokopedia_link"
                        // required
                      />
                      <InputText
                        label="Shopee"
                        placeholder="Contoh: https://shopee.co.id/..."
                        id="shopee_link"
                        name="shopee_link"
                        // required
                      />
                      <InputText
                        label="Bukalapak"
                        placeholder="Contoh: https://bukalapak.com/..."
                        id="bukalapak_link"
                        name="bukalapak_link"
                        // required
                      />
                    </div>
                  </div>

                  {/* Description Editor Section */}
                  {editorLoaded && (
                    <div className="bg-gray-50/50 p-4 sm:p-5 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 text-primary-main font-semibold mb-3">
                        <MdDescription className="text-xl sm:text-2xl" />
                        <h2 className="text-base sm:text-lg">
                          Spesifikasi & Detail Produk
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                        Jelaskan spesifikasi teknis, manfaat, dan cara
                        penggunaan alat kesehatan secara detail.
                      </p>
                      <InputEditor
                        editorLoaded={editorLoaded}
                        name="description"
                        onChange={(data) =>
                          formik.setFieldValue("description", data)
                        }
                        value={formik.values.description}
                      />
                    </div>
                  )}

                  <Button
                    loading={loading}
                    onClick={() => formik.handleSubmit()}
                    className="w-full sm:w-auto sm:self-end bg-primary-main hover:bg-primary-dark text-white font-semibold py-2.5 sm:py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-colors duration-150 shadow-md hover:shadow-lg"
                  >
                    <MdSave className="text-lg sm:text-xl" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardBody>
            </Card>
          </FormikProvider>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
