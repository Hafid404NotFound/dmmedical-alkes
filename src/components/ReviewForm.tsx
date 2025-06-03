"use client";

import { IReqReview } from "@/types/IReqReview";
import { createClient } from "@/utils/supabase/client";
import { FormikProvider, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import Button from "./Button";
import { Card, CardBody } from "./Card";
import InputText from "./InputText";
import InputTextarea from "./InputTextarea";
import { IReview } from "@/types/IReview";

export default function ReviewForm(props: IProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const supabase = createClient();
  const router = useRouter();

  const initValue: IReqReview = {
    message: props?.data?.message || "",
    name: props?.data?.name || "",
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required(),
    message: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: validationSchema,
    onSubmit: (e) =>
      props.data?.id ? handleEdit(e, String(props.data.id)) : handleCreate(e),
  });

  const handleCreate = async (e: IReqReview) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("review").insert([e]);
      setLoading(false);
      if (error) throw error;
      toast.success("Review berhasil dibuat");
      formik.resetForm();
    } catch (error) {
      setLoading(false);
      toast.error("Gagal buat review");
      console.error("Insert error:", error);
    }
  };
  const handleEdit = async (e: IReqReview, id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("review").update(e).eq("id", id);
      setLoading(false);
      if (error) throw error;
      toast.success("Review berhasil update");
      formik.resetForm();
      router.push("/dashboard/review");
    } catch (error) {
      setLoading(false);
      toast.error("Gagal update review");
      console.error("Insert error:", error);
    }
  };
  return (
    <div className="mt-10">
      <Card>
        <CardBody>
          <FormikProvider value={formik}>
            <div className="grid gap-7">
              <InputText
                name="name"
                id="name"
                label="Nama"
                placeholder="Masukan nama"
              />
              <InputTextarea
                name="message"
                id="message"
                label="Pesan"
                placeholder="Masukan pesan"
              />
              <Button onClick={() => formik.handleSubmit()} loading={loading}>
                SUBMIT
              </Button>
            </div>
          </FormikProvider>
        </CardBody>
      </Card>
    </div>
  );
}

interface IProps {
  data?: IReview;
}
