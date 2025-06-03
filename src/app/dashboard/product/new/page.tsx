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
        <PageTitle title="Buat produk baru" />
        <FormikProvider value={formik}>
          <Card>
            <CardBody>
              <div className="grid gap-5">
                <VidioUplaoded
                  value={formik.values.video_url}
                  onChange={(e) => formik.setFieldValue("video_url", e)}
                />
                <UploadBoxCropperArea
                  folderName="POST"
                  ratio={1}
                  onChange={(e) => formik.setFieldValue("image_url", e)}
                  value={formik.values.image_url}
                />
                <InputText
                  label="Nama produk"
                  placeholder="Masukan nama produk"
                  id="name"
                  name="name"
                  required
                />
                <InputAutocompleteOptional
                  name="category_id"
                  placeholder="Pilih / buat category"
                  label="Category"
                  required
                  options={dataCategory || []}
                />

                <div className="grid gap-3 grid-cols-2">
                  <InputText
                    label="Link WA"
                    placeholder="Masukan link wa"
                    id="wa_link"
                    name="wa_link"
                    required
                  />
                  <InputText
                    label="Link Tokopedia"
                    placeholder="Masukan link tokopedia"
                    id="tokopedia_link"
                    name="tokopedia_link"
                    required
                  />
                  <InputText
                    label="Link Shoppe"
                    placeholder="Masukan link shopee"
                    id="shopee_link"
                    name="shopee_link"
                    required
                  />
                  <InputText
                    label="Link Bukalapak"
                    placeholder="Masukan link bukalapak"
                    id="bukalapak_link"
                    name="bukalapak_link"
                    required
                  />
                </div>

                {editorLoaded && (
                  <InputEditor
                    editorLoaded={editorLoaded}
                    name="description"
                    onChange={(e) => formik.setFieldValue("description", e)}
                    value={formik.values.description}
                  />
                )}

                <Button loading={loading} onClick={() => formik.handleSubmit()}>
                  SUBMIT
                </Button>
              </div>
            </CardBody>
          </Card>
        </FormikProvider>
      </DashboardContainer>
    </DashboardLayout>
  );
}
