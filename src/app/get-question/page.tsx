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
import { MdMail, MdPhone, MdPinDrop } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import toast from "react-hot-toast";
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
    <div className="relative bg-gradient-to-bl from-primary-main to-secondary-main min-h-screen">
      <ActionButtonWa />
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-light/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>{" "}
      </div>

      <TopBar transparent />

      <div className="relative pb-10 lg:mt-0 mt-12">
        <PageContainer>
          <div className="lg:mt-10 gap-7">
            <div className="mb-8">
              <h1 className="font-semibold text-4xl lg:text-5xl text-white mb-4 animate-fade-in">
                Get Question
              </h1>
              <div className="w-20 h-1 bg-white/30 rounded-full"></div>
            </div>

            <div className="lg:flex mt-2 lg:mt-0 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl transform hover:scale-[1.01] transition-all duration-500">
              <div className="bg-gray-100/90 backdrop-blur-sm lg:w-md p-8 flex flex-col items-center relative overflow-hidden">
                <div className="relative transform hover:scale-105 transition-all duration-500">
                  <Image
                    src="/question_1.png"
                    width={200}
                    height={200}
                    alt="question"
                    className="h-40 w-auto drop-shadow-xl"
                  />
                </div>

                <div className="text-start mt-10 grid gap-4">
                  <h2 className="font-semibold text-xl text-primary-main">
                    DM MEDICAL ALKES
                  </h2>
                  <div className="grid gap-3 text-gray-600">
                    <div className="flex items-start gap-3 group hover:text-primary-main transition-colors duration-300">
                      <MdPinDrop className="mt-1 text-xl text-primary-main" />
                      <p>
                        Kp.Bojong Tua, Jl. Masjid Al-Ikhlas RT 003/RW 001 (Blok
                        B No.18), Pondok Gede.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 group hover:text-primary-main transition-colors duration-300">
                      <MdPhone className="text-xl text-primary-main" />
                      <p>+62 81389037818</p>
                    </div>
                    <div className="flex items-center gap-3 group hover:text-primary-main transition-colors duration-300">
                      <IoLogoWhatsapp className="text-xl text-primary-main" />
                      <p>+62 81389037818</p>
                    </div>
                    <div className="flex items-center gap-3 group hover:text-primary-main transition-colors duration-300">
                      <MdMail className="text-xl text-primary-main" />
                      <p>marketing@dm.co.id</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:p-20 p-6 flex-1">
                <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                  <h3 className="text-center text-xl mb-8 text-gray-700 font-medium">
                    Silakan isi formulir di bawah ini untuk menjelaskan
                    kebutuhan Anda terkait produk Dm Medical!
                  </h3>

                  <FormikProvider value={formik}>
                    <div className="grid gap-8 h-fit">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 text-white flex items-center justify-center rounded-xl bg-primary-main shadow-lg">
                          <span className="font-medium">1</span>
                        </div>
                        <h4 className="font-semibold text-gray-700">
                          Informasi Kontak
                        </h4>
                      </div>

                      <div className="space-y-6">
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
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        <div className="h-10 w-10 text-white flex items-center justify-center rounded-xl bg-primary-main shadow-lg">
                          <span className="font-medium">2</span>
                        </div>
                        <h4 className="font-semibold text-gray-700">
                          Informasi Tambahan
                        </h4>
                      </div>

                      <div className="space-y-6">
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
                          className="w-full py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                        >
                          KIRIM
                        </Button>
                      </div>
                    </div>
                  </FormikProvider>
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
