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
                {dataCategory.length > 0 && (
                  <InputAutocompleteOptional
                    name="category_id"
                    placeholder="Pilih / buat category"
                    label="Category"
                    required
                    options={dataCategory || []}
                  />
                )}

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
