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
import { MdLocalHospital, MdMedicalServices, MdSave } from "react-icons/md";

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
        .then((query) => {
          const getdata: IProduct[] = query?.data || [];
          if (getdata[0]) {
            setData(getdata[0]);
            setEditorLoaded(true);
          }
        });
    }
  }, [id]);

  const handleEdit = async (e: IReqCreateNewProduct) => {
    setLoading(true);
    try {
      const idCategory = await onCreateCategory(e.category_id);
      if (!idCategory) return;
      const { error } = await supabase
        .from("product")
        .update({
          ...e,
          category_id: idCategory,
        })
        .eq("id", id);
      setLoading(false);
      if (error) throw error;
      toast.success("Produk berhasil diupdate");
      router.push("/dashboard/product/" + id);
    } catch (error) {
      setLoading(false);
      toast.error("Gagal update produk");
      console.error("Insert error:", error);
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
  });

  async function onCreateCategory(e: string) {
    const { data } = await supabase
      .from("category")
      .select()
      .eq("id", parseInt(e));

    if (data?.[0]) {
      return data[0].id;
    } else {
      const { data, error } = await supabase
        .from("category")
        .insert([{ name: e }])
        .select();

      if (error) {
        console.error("Insert error:", error);
        return null;
      }

      if (data && data.length > 0) {
        return data[0].id;
      } else {
        console.warn("No data returned after insert.");
        return null;
      }
    }
  }

  useEffect(() => {
    if (data) {
      formik.setValues({
        description: data.description,
        image_url: data.image_url,
        name: data.name,
        bukalapak_link: data.bukalapak_link,
        wa_link: data.wa_link,
        category_id: data.category_id,
        tokopedia_link: data.tokopedia_link,
        shopee_link: data.shopee_link,
        video_url: data.video_url,
      });
    }
  }, [data]);

  useEffect(() => {
    supabase
      .from("category")
      .select()
      .then((e) => {
        if (e.data) {
          const data: ILabelValue<string>[] = e.data.map((v) => {
            return {
              label: String(v?.name),
              value: String(v?.id),
            };
          });
          setDataCategory(data);
        }
      });
  }, []);
  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg">
                <MdLocalHospital className="text-2xl text-white" />
              </div>
              <div>
                <PageTitle title="Edit Alat Kesehatan" />
                <p className="text-gray-500 text-sm">
                  Perbarui informasi dan spesifikasi alat kesehatan
                </p>
              </div>
            </div>
          </div>

          <FormikProvider value={formik}>
            <Card>
              <CardBody>
                <div className="grid gap-6">
                  {/* Media Section */}
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 text-primary-main font-medium mb-2">
                      <MdMedicalServices className="text-xl" />
                      Media Alat Kesehatan
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload foto dan video yang menampilkan detail alat
                      kesehatan dengan jelas
                    </p>

                    <div className="grid gap-6">
                      <div className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Video Demonstrasi
                        </label>
                        <VidioUplaoded
                          value={formik.values.video_url}
                          onChange={(e) => formik.setFieldValue("video_url", e)}
                        />
                      </div>

                      <div className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Foto Produk
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

                  {/* Product Info */}
                  <div className="grid gap-4">
                    <InputText
                      label="Nama Alat Kesehatan"
                      placeholder="Contoh: Stetoskop Digital Premium / Tensimeter Otomatis"
                      id="name"
                      name="name"
                      required
                    />

                    {dataCategory.length > 0 && (
                      <InputAutocompleteOptional
                        name="category_id"
                        placeholder="Contoh: Alat Diagnostik / Peralatan Bedah"
                        label="Kategori Alat Kesehatan"
                        required
                        options={dataCategory || []}
                      />
                    )}
                  </div>

                  {/* Marketplace Links */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 font-medium mb-4">
                      <svg
                        className="w-5 h-5 text-secondary-main"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Link Pembelian
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputText
                        label="WhatsApp"
                        placeholder="Link konsultasi & pemesanan via WhatsApp"
                        id="wa_link"
                        name="wa_link"
                        required
                      />
                      <InputText
                        label="Tokopedia"
                        placeholder="Link pembelian di Tokopedia"
                        id="tokopedia_link"
                        name="tokopedia_link"
                        required
                      />
                      <InputText
                        label="Shopee"
                        placeholder="Link pembelian di Shopee"
                        id="shopee_link"
                        name="shopee_link"
                        required
                      />
                      <InputText
                        label="Bukalapak"
                        placeholder="Link pembelian di Bukalapak"
                        id="bukalapak_link"
                        name="bukalapak_link"
                        required
                      />
                    </div>
                  </div>

                  {/* Description Editor */}
                  {editorLoaded && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        Spesifikasi & Detail Produk
                      </label>
                      <div className="text-sm text-gray-500 mb-2">
                        Jelaskan spesifikasi teknis, manfaat, dan cara
                        penggunaan alat kesehatan secara detail
                      </div>
                      <InputEditor
                        editorLoaded={editorLoaded}
                        name="description"
                        onChange={(e) => formik.setFieldValue("description", e)}
                        value={formik.values.description}
                      />
                    </div>
                  )}

                  <Button
                    loading={loading}
                    onClick={() => formik.handleSubmit()}
                    className="bg-primary-main hover:bg-primary-dark text-white font-medium py-3 flex items-center justify-center gap-2"
                  >
                    <MdSave className="text-xl" />
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
