/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logo } from "@/assets";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import * as yup from "yup";
import { verifyOtp } from "@/services/auth"; 
import { useNavigate } from "react-router-dom";

const VerifyOtp: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  type OtpInput = {
    otpCode: string;
  };

  const otpSchema = yup.object({
    otpCode: yup
      .string()
      .required("OTP is required")
      .matches(/^\d{6}$/, "OTP must be 6 digits"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpInput>({
    resolver: yupResolver(otpSchema) as Resolver<OtpInput, any>,
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<OtpInput> = async (data) => {
    setLoading(true);
    try {
      const response = await verifyOtp(data.otpCode);
      if (response.success) {
        alert("OTP verified successfully!");
        navigate("/auth/login"); 
      } else {
        alert(response.message || "OTP verification failed");
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pt-[20vh] min-h-screen">
      <Helmet>
        <title>Verify OTP</title>
      </Helmet>
      <div className="flex flex-col rounded-xl border border-slate-200 p-10 w-11/12 msm:w-[80%] sm:w-[70%] md:w-[50%] mlg:w-[40%] lg:w-[35%] 2xl:w-[28%] bg-white items-center">
        <img src={Logo} alt="Logo" className="w-24" />
        <span className="text-2xl my-1">Verify OTP</span>
        <span className="my-4 text-center text-gray-600">
          Enter the 6-digit code sent to your email.
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-3 w-full flex flex-col items-center"
        >
          <div className="w-full my-2">
            <label className="text-sm font-medium leading-none text-gray-800">
              OTP Code
            </label>
            <input
              {...register("otpCode")}
              type="text"
              className="bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
              placeholder="Enter your 6-digit OTP"
            />
            {errors.otpCode && (
              <span className="text-red-400 text-[16px]">
                {errors?.otpCode?.message}
              </span>
            )}
          </div>
          <button
            disabled={loading}
            type="submit"
            className={`${
              loading ? "bg-primary-blue/70" : "bg-primary-blue"
            } my-4 text-white w-44 flex justify-center px-6 py-3 rounded-lg`}
          >
            {loading ? (
              <BiLoaderAlt className="animate-spin " size={25} />
            ) : (
              "Verify"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
