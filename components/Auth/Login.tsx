/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import preview from "@/assets/Logo.png";
import logo from "@/assets/Logo.png";
import { useAdminLoginMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useState } from "react";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const route = useRouter();
  const [Login, { isLoading }] = useAdminLoginMutation();
  const [active, setActive] = useState("password");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await Login({
        email: values.email,
        password: values.password,
      }).unwrap();

      console.log(response.message);
      if (response.success) {
        toast.success("Login successful");
        Cookies.set("token", response.result.accessToken);
        route.push("/");
      }
    } catch (error) {
      toast.error((error as any)?.data?.message);
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col justify-center items-center bg-[#eff6ff]">
      <div className="">
        <Image
          src={logo}
          height={300}
          width={300}
          alt="Logo"
          className="lg:w-[180px] lg:h-[180px] w-[120px] h-[120px]"
          priority
        />
      </div>
      <div className="w-full bg-white p-8 max-w-xl lg:max-w-lg rounded-2xl xl:max-w-xl">
        <div>
          <div className="text-center">
            <h2 className="text-[32px] font-medium text-[#2D2D2D]">Sign In</h2>
            <p className="my-2.5 text-[#636F85]">Login to your admin account</p>
          </div>

          <form className="w-full" onSubmit={handleSubmit(handleLogin)}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#2D2D2D]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="enter your email"
                className="h-12 w-full rounded-2xl border border-[#D1D6DB] px-4 text-sm outline-none transition focus:border-[#2D2D2D]"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-2 relative">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#2D2D2D]"
              >
                Password
              </label>
              <input
                id="password"
                type={active === "password" ? "password" : "text"}
                placeholder="Enter your password"
                className="h-12 w-full rounded-2xl border border-[#D1D6DB] px-4 text-sm outline-none transition focus:border-[#2D2D2D]"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}

              <div className="absolute right-2.5 top-10">
                {active == "text" && (
                  <Eye className="text-gray-500" onClick={() => setActive("password")}></Eye>
                )}
                {active == "password" && (
                  <EyeOff className="text-gray-500" onClick={() => setActive("text")}></EyeOff>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="disabled:opacity-45 disabled:cursor-default w-full mt-5 bg-bprimary text-white font-semibold rounded-xl transition-all duration-500 ease-in-out cursor-pointer px-6 py-4"
            >
              {isLoading ? (
                <Loader className="mx-auto animate-spin"></Loader>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
