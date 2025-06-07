"use client";
import Button from "@/components/Button";
import { Card, CardBody } from "@/components/Card";
import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import InputAutocompleteOptional from "@/components/InputAutocompleteOptional";
import InputText from "@/components/InputText";
import PageTitle from "@/components/PageTitle";
import UploadBoxCropperArea from "@/components/uploadBoxCropper";
import VidioUplaoded from "@/components/VidioUploaded";
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
              label: String(v?.name),
              value: String(v?.id),
            };
          });
          setDataCategory(data || []);
        }
      });
  }, []);

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

  const handleCreate = async (e: IReqCreateNewProduct) => {
    setLoading(true);
    try {
      const idCategory = await onCreateCategory(e.category_id);
      if (!idCategory) return;
      const { error } = await supabase.from("product").insert([
        {
          ...e,
          category_id: idCategory,
        },
      ]);
      setLoading(false);
      if (error) throw error;
      toast.success("Produk berhasil dibuat");
      router.push("/dashboard/product");
    } catch (error) {
      setLoading(false);
      toast.error("Gagal buat produk");
      console.error("Insert error:", error);
    }
  };

  const initValue: IReqCreateNewProduct = {
    description: "",
    image_url: "",
    name: "",
    bukalapak_link: "",
    category_id: "",
    shopee_link: "",
    tokopedia_link: "",
    video_url: "",
    wa_link: "",
  };
  const formik = useFormik({
    initialValues: initValue,
    onSubmit: (e) => handleCreate(e),
  });

  useEffect(() => {
    console.log(formik.values.video_url);
  }, [formik.values.video_url]);
  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg">
              <MdLocalHospital className="text-2xl text-white" />
            </div>
            <div>
              <PageTitle title="Tambah Alat Kesehatan" />
              <p className="text-gray-500 text-sm">
                Lengkapi informasi detail alat kesehatan untuk katalog
              </p>
            </div>
          </div>

          <FormikProvider value={formik}>
            <Card>
              <CardBody>
                <div className="grid gap-6">
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 text-primary-main font-medium mb-2">
                      <MdMedicalServices className="text-xl" />
                      Media Alat Kesehatan
                    </div>
                    <p className="text-sm text-gray-600">
                      Upload foto dan video alat kesehatan dengan pencahayaan
                      yang baik untuk menampilkan detail produk dengan jelas
                    </p>
                  </div>

                  <div className="grid gap-5">
                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Video Produk
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

                    <InputText
                      label="Nama Alat Kesehatan"
                      placeholder="Contoh: Stetoskop Digital Premium / Tensimeter Otomatis"
                      id="name"
                      name="name"
                      required
                    />

                    <InputAutocompleteOptional
                      name="category_id"
                      placeholder="Contoh: Alat Diagnostik / Peralatan Bedah"
                      label="Kategori Alat Kesehatan"
                      required
                      options={dataCategory || []}
                    />

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-700 font-medium mb-4">
                        <MdInventory className="text-xl text-secondary-main" />
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
                          onChange={(e) =>
                            formik.setFieldValue("description", e)
                          }
                          value={formik.values.description}
                        />
                      </div>
                    )}

                    <Button
                      loading={loading}
                      onClick={() => formik.handleSubmit()}
                      className="bg-primary-main hover:bg-primary-dark text-white font-medium py-3 mt-4"
                    >
                      Simpan Alat Kesehatan
                    </Button>
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
