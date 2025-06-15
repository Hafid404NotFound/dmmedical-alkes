"use client";
import { MdClose, MdWhatsapp } from "react-icons/md";
import { Card, CardBody } from "./Card";
import Image from "next/image";
import { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import InputText from "./InputText";
import Button from "./Button";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ActionButtonWa() {
  const router = useRouter();
  const [active, setActive] = useState<boolean>(false);
  const [checkStep, setCheckStep] = useState<number>(0);

  const validationSchema = yup.object().shape({
    name: yup.string().required("Nama wajib diisi"),
    email: yup
      .string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    hospital: yup.string().required("Rumah sakit/Perusahaan wajib diisi"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      hospital: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const message = `Halo, Saya ingin bertanya seputar produk Dm Medical. Nama = ${values.name}, Email = ${values.email}, Perusahaan = ${values.hospital}`;
      const url = `https://api.whatsapp.com/send?phone=6281389037818&text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank", "noopener,noreferrer");
      onCloseActive();
    },
  });

  function onCloseActive() {
    setActive(false);
    setTimeout(() => {
      formik.resetForm();
      setCheckStep(0);
    }, 300);
  }

  function nextStep() {
    return (
      <motion.div
        key="next"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Card className="mb-4 overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-80 sm:w-96">
          <div className="bg-gray-50 dark:bg-gray-700 flex justify-between items-center p-4 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Chat dengan
              </div>
              <div className="text-base sm:text-lg font-semibold text-primary-dark dark:text-primary-main">
                Call Center
              </div>
            </div>
            <button
              onClick={onCloseActive}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Tutup chat form"
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>
          <CardBody className="p-4 sm:p-5">
            <div className="flex flex-col gap-4">
              <FormikProvider value={formik}>
                <InputText placeholder="Nama Lengkap" id="nama" name="name" />
                <InputText placeholder="Alamat Email" id="email" name="email" />
                <InputText
                  placeholder="Nama Rumah Sakit / Perusahaan"
                  id="hospital"
                  name="hospital"
                />
              </FormikProvider>
            </div>
          </CardBody>
          <CardBody className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3 justify-end">
              <Button onClick={() => setCheckStep(0)} variant="primary">
                KEMBALI
              </Button>
              <Button onClick={() => formik.handleSubmit()} variant="secondary">
                KIRIM
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    );
  }

  function firstStep() {
    return (
      <motion.div
        key="first"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Card className="mb-4 overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-80 sm:w-96">
          <div className="bg-gradient-to-br from-primary-main to-primary-dark p-4 sm:p-5 text-white rounded-t-xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xl sm:text-2xl font-bold">Halo!</div>
                <div className="max-w-[240px] sm:max-w-xs text-xs sm:text-sm mt-2 opacity-90">
                  Ada yang bisa kami bantu? Konsultasikan kebutuhan Anda dengan
                  tim kami via WhatsApp.
                </div>
              </div>
              <button
                onClick={onCloseActive}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Tutup sapaan"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div
            className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer p-4 sm:p-5 transition-colors duration-200 ease-in-out"
            onClick={() => setCheckStep(1)}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/img_cs.png"
                alt="Customer Service DM Medical"
                height={40}
                width={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Admin
                </div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">
                  Call Center DM Medical
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5" style={{ zIndex: 999 }}>
      <AnimatePresence mode="wait">
        {active && (checkStep === 0 ? firstStep() : nextStep())}
      </AnimatePresence>
      <button
        onClick={() => setActive((e) => !e)}
        className="bg-primary-main text-white p-3 rounded-full flex items-center gap-2 cursor-pointer hover:bg-primary-dark shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-opacity-50 transform hover:scale-105 transition-all duration-300 ease-in-out"
        style={{ zIndex: 9999 }}
        aria-expanded={active}
        aria-label={active ? "Tutup chat" : "Buka chat WhatsApp"}
      >
        <MdWhatsapp className="w-6 h-6" />
        <span className="hidden sm:block text-sm font-medium pr-1">
          Chat via WhatsApp
        </span>
      </button>
    </div>
  );
}
