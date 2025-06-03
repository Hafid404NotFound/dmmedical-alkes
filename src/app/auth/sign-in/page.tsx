"use client";
import Button from "@/components/Button";
import { Card, CardBody, CardTitle } from "@/components/Card";
import InputText from "@/components/InputText";
import { createClient } from "@/utils/supabase/client";
import { FormikProvider, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function SignInPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (e) => {
      handleLogin(e);
    },
  });

  const handleLogin = async (e: any) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: e.email,
      password: e.password,
    });
    setLoading(false);

    if (error) {
      alert("Gagal login, periksa email atau password");
      console.error(error);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardTitle title="Masuk ke dashboard" />
        <CardBody>
          <div className="grid gap-4 min-w-sm">
            <FormikProvider value={formik}>
              <InputText
                name="email"
                id="email"
                placeholder="masukan email"
                label="email"
                required
              />
              <InputText
                name="password"
                id="password"
                placeholder="masukan password"
                label="password"
                required
                type={showPassword ? "text" : "password"}
                endIcon={
                  <div
                    className="cursor-pointer text-gray-400"
                    onClick={() => setShowPassword((e) => !e)}>
                    {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                  </div>
                }
              />
              <Button onClick={() => formik.handleSubmit()} loading={loading}>
                MASUK
              </Button>
            </FormikProvider>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
