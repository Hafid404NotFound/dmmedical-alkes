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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center px-4">
      {/* Medical themed decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100/20 rounded-full blur-3xl"></div>

        {/* Medical cross patterns */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-12 left-1/4 text-4xl text-primary-main">
            +
          </div>
          <div className="absolute top-1/3 right-1/4 text-4xl text-secondary-main">
            +
          </div>
          <div className="absolute bottom-1/4 left-1/3 text-4xl text-primary-main">
            +
          </div>
          <div className="absolute top-2/3 right-1/3 text-4xl text-secondary-main">
            +
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg p-4 rotate-45 transform hover:rotate-[135deg] transition-transform duration-500">
              <div className="w-full h-full bg-gradient-to-r from-primary-main to-secondary-main rounded-xl flex items-center justify-center -rotate-45 transform hover:rotate-45 transition-transform duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <CardTitle
            title="Masuk ke Dashboard"
            className="text-center pt-16 text-primary-main"
          />
          <CardBody className="px-8 pb-8">
            <div className="grid gap-6">
              <FormikProvider value={formik}>
                <InputText
                  name="email"
                  id="email"
                  placeholder="Masukan email"
                  label="Email"
                  required
                />
                <InputText
                  name="password"
                  id="password"
                  placeholder="Masukan password"
                  label="Password"
                  required
                  type={showPassword ? "text" : "password"}
                  endIcon={
                    <div
                      className="cursor-pointer text-gray-400 hover:text-primary-main transition-colors duration-300"
                      onClick={() => setShowPassword((e) => !e)}
                    >
                      {showPassword ? (
                        <MdVisibility className="text-xl" />
                      ) : (
                        <MdVisibilityOff className="text-xl" />
                      )}
                    </div>
                  }
                />
                <Button
                  onClick={() => formik.handleSubmit()}
                  loading={loading}
                  className="mt-4 bg-gradient-to-r from-primary-main to-secondary-main hover:from-secondary-main hover:to-primary-main transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  MASUK
                </Button>
              </FormikProvider>

              <div className="text-center text-sm text-gray-500">
                Selamat datang di Dashboard DM Medical Alkes
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
