import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useUserStore from "../store/userStore";

const scaleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 25 },
  },
};

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    chengePasswordReset,
  } = useUserStore();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      password: password || "",
      confirmPassword: confirmPassword || "",
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setPassword(value.password);
      setConfirmPassword(value.confirmPassword);
    });
    return () => subscription.unsubscribe();
  }, [watch, setPassword, setConfirmPassword]);

  const handleResetPassword = async () => {
    setLoading(true);
    await chengePasswordReset(queryToken, confirmPassword);
    setLoading(false);
  };

  return (
    <div className="flex justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleVariants}
        className="w-full max-w-md md:max-w-lg mt-5 mb-5"
      >
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="container mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <img src="/previwLogo.svg" alt="Sdmedik Logo" className="h-8" />
              <h6 className="text-xl text-teal-500 font-semibold">Sdmedik</h6>
            </div>
            <div className="flex flex-col">
              <h4 className="text-2xl font-bold">Восстановление пароля</h4>
              <form
                className="flex flex-col gap-6 mt-5"
                onSubmit={handleSubmit(handleResetPassword)}
              >
                <div>
                  <input
                    type="password"
                    placeholder="Пароль"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    onChange={(e) => setValue("password", e.target.value)}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Повторите пароль"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                    })}
                    onChange={(e) =>
                      setValue("confirmPassword", e.target.value)
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-colors flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                  ) : (
                    "Изменить пароль"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
