"use client";
import ActionButtonWa from "@/components/ActionButtonWa";
import Button from "@/components/Button";
import FooterComponent from "@/components/FooterComponent";
import InputText from "@/components/InputText";
import InputTextarea from "@/components/InputTextarea";
import PageContainer from "@/components/PageContainer";
import TopBar from "@/components/TopBar";
import { IReqGetQuestion } from "@/types/IReqGetQuestion";
import { createClient } from "@/utils/supabase/client";
import { FormikProvider, useFormik } from "formik";
import Image from "next/image";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as yup from "yup";

export default function GetQuestionPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const supabase = createClient();

  const initValue: IReqGetQuestion = {
    email: "",
    message: "",
    name: "",
    phone: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().required(),
    message: yup.string().required(),
    phone: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: validationSchema,
    onSubmit: (e) => handleCreate(e),
  });

  const handleCreate = async (e: IReqGetQuestion) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("question").insert([e]);
      setLoading(false);
      if (error) throw error;
      toast.success("Pesan berhasil dikirim");
      formik.resetForm();
    } catch (error) {
      setLoading(false);
      toast.error("Gagal kirim pesan");
      console.error("Insert error:", error);
    }
  };

  return (
    <div className="bg-gradient-to-bl from-primary-main to-secondary-main min-h-screen">
      <ActionButtonWa />

      <Toaster position="bottom-center" />
      <TopBar transparent />
      <div className="pb-10 lg:mt-0 mt-12  ">
        <PageContainer>
          <div className="lg:mt-10  gap-7">
            <div>
              <div className="font-semibold mb-4 text-4xl text-white">
                Get question
              </div>
            </div>
            <div className=" lg:flex mt-2 lg:mt-0 bg-white rounded-3xl overflow-hidden">
              <div className="bg-gray-100  lg:w-md p-7 flex flex-col items-center">
                <Image
                  src={"/question_1.png"}
                  width={200}
                  height={200}
                  alt="question"
                  className="h-40 w-auto"
                />
                <div className="text-start mt-10 grid gap-3">
                  <p className="font-semibold ">DM MEDICAL ALKES</p>
                  <div className="grid gap-2">
                    <p>
                      Kp.Bojong Tua, Jl. Masjid Al-Ikhlas RT 003/RW 001 (Blok B
                      No.18), Pondok Gede.
                    </p>
                    <p>Telp: +62-21-78838951</p>
                    <p>WA: +62-812-8877-0321</p>
                    <p>E-mail: marketing@kp3.co.id</p>
                  </div>
                </div>
              </div>
              <div className="lg:p-20 p-3 ">
                <div className="bg-gray-100 rounded-lg p-8 mt-10 lg:mt-0">
                  <p className="text-center text-xl mb-5">
                    Silakan isi formulir di bawah ini untuk menjelaskan
                    kebutuhan Anda terkait produk Dm Medical!
                  </p>
                  <div>
                    <FormikProvider value={formik}>
                      <div className="grid gap-6 h-fit">
                        <div className=" flex items-center font-semibold gap-3">
                          <div className="h-8 w-8 text-white flex items-center justify-center rounded-t-lg rounded-br-lg bg-primary-main">
                            1
                          </div>
                          <p>Informasi Kontak</p>
                        </div>
                        <InputText
                          label="Nama"
                          placeholder="Nama anda"
                          id="name"
                          name="name"
                          required
                        />
                        <InputText
                          label="Email"
                          placeholder="Masukan email"
                          id="email"
                          name="email"
                          required
                        />
                        <InputText
                          label="Nomor HP"
                          placeholder="No Telepon/WhatsApp Aktif *"
                          id="phone"
                          name="phone"
                          required
                        />
                        <div className=" flex items-center font-semibold gap-3">
                          <div className="h-8 w-8 text-white flex items-center justify-center rounded-t-lg rounded-br-lg bg-primary-main">
                            2
                          </div>
                          <p> Informasi Tambahan</p>
                        </div>
                        <InputTextarea
                          label="Pesan"
                          placeholder="Masukan pesan"
                          id="message"
                          name="message"
                          required
                        />
                        <Button
                          loading={loading}
                          onClick={() => formik.handleSubmit()}
                        >
                          KIRIM
                        </Button>
                      </div>
                    </FormikProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
      <FooterComponent />
    </div>
  );
}
