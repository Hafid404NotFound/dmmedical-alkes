"use client";
import { MdClose, MdWhatsapp } from "react-icons/md";
import { Card, CardBody } from "./Card";
import Image from "next/image";
import { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import InputText from "./InputText";
import Button from "./Button";
import * as yup from "yup";
import Divider from "./Divider";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ActionButtonWa() {
  const router = useRouter();
  const [active, setActive] = useState<boolean>(false);
  const [checkStep, setCheckStep] = useState<number>(0);

  const validationSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    hospital: yup.string().required(),
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
      const url = `https://api.whatsapp.com/send?phone=62895366450806&text=${encodeURIComponent(
        message
      )}`;
      router.push(url);
    },
  });

  function onCloseActive() {
    setActive(false);
    setCheckStep(0);
    formik.resetForm();
  }

  function nextStep() {
    return (
      <motion.div
        key="next"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-4 overflow-hidden rounded-xl shadow-lg">
          <div className="bg-primary-dark flex justify-between p-3 text-white">
            <div>
              <div className="text-xs">Admin</div>
              <div className="font-semibold">Call center</div>
            </div>
            <div onClick={onCloseActive} className="cursor-pointer">
              <MdClose />
            </div>
          </div>
          <CardBody>
            <div className="grid gap-3">
              <FormikProvider value={formik}>
                <InputText placeholder="Nama" id="nama" name="name" />
                <InputText placeholder="Email" id="email" name="email" />
                <InputText
                  placeholder="Rumah sakit"
                  id="hospital"
                  name="hospital"
                />
              </FormikProvider>
            </div>
          </CardBody>
          <Divider />
          <CardBody>
            <div className="flex gap-2">
              <Button onClick={() => setCheckStep(0)}>KEMBALI</Button>
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-4 overflow-hidden rounded-xl shadow-lg">
          <div className="bg-primary-dark flex justify-between p-3 text-white">
            <div>
              <div className="lg:text-5xl text-3xl font-semibold">Halo!</div>
              <div className="max-w-[200px] lg:max-w-xs text-xs lg:text-base mt-4">
                Konsultasikan kebutuhan Anda dengan tim representatif kami untuk
                chat via WhatsApp
              </div>
            </div>
            <div onClick={onCloseActive} className="cursor-pointer">
              <MdClose />
            </div>
          </div>
          <div className="hover:bg-gray-200 cursor-pointer py-7 px-6">
            <div
              className="flex items-center gap-3"
              onClick={() => setCheckStep(1)}
            >
              <Image
                src="/img_cs.png"
                alt="hello"
                height={100}
                width={100}
                className="h-10 w-10"
              />
              <div>
                <div className="text-xs">Admin</div>
                <div className="font-semibold">Call center</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="fixed bottom-3 right-3" style={{ zIndex: 999 }}>
      <AnimatePresence mode="wait">
        {active && (checkStep === 0 ? firstStep() : nextStep())}
      </AnimatePresence>
      <div
        onClick={() => setActive((e) => !e)}
        className="bg-primary-main text-white px-5 py-2 rounded-full flex items-center gap-3 lg:text-xl text-xs cursor-pointer hover:bg-primary-dark"
        style={{ zIndex: 9999 }}
      >
        <MdWhatsapp />
        <div>Halo, Kami siap membantu Anda?</div>
      </div>
    </div>
  );
}
