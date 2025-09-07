import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useUserStore from "../../store/userStore";
import { MdEmail, MdClose } from "react-icons/md";

const scaleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 25 },
  },
};

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {
    loginFunc,
    email,
    setEmail,
    password,
    setPassword,
    checkPasswordResetEmail,
  } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      email: email || "",
      password: password || "",
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setEmail(value.email);
      setPassword(value.password);
    });
    return () => subscription.unsubscribe();
  }, [watch, setEmail, setPassword]);

  const handleAuth = async () => {
    setLoading(true);
    try {
      await loginFunc(navigate);
    } catch (err) {
      setError("Ошибка авторизации. Проверьте email и пароль.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Введите email");
      return;
    }
    setLoading(true);
    try {
      await checkPasswordResetEmail(email);
      setShowResetPasswordModal(false);
    } catch (err) {
      setError("Ошибка при запросе восстановления пароля.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowResetPasswordModalClose = () => {
    setShowResetPasswordModal(false);
    setError(null);
  };

  return (
    <div className="flex justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleVariants}
        className="w-full max-w-md md:max-w-lg mt-10 mb-6"
      >
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="container mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <img src="/previwLogo.svg" alt="Sdmedik Logo" className="h-8" />
              <h6 className="text-xl text-purple-500 font-semibold">Sdmedik</h6>
            </div>
            <div className="flex flex-col">
              <h3 className="text-3xl p-1">Вход</h3>
              <form
                className="flex flex-col gap-6 mt-5"
                onSubmit={handleSubmit(handleAuth)}
              >
                <div>
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("email", {
                        required: "Email обязателен",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Неправильный или некорректный email",
                        },
                      })}
                      onChange={(e) => setValue("email", e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Пароль"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("password", {
                      required: "Пароль обязателен",
                    })}
                    onChange={(e) => setValue("password", e.target.value)}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors flex justify-center items-center disabled:opacity-50"
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
                    "Войти"
                  )}
                </button>
              </form>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-4 mb-4">
              <span>У вас нет аккаунта?</span>
              <Link to="/register" className="text-purple-500 hover:underline">
                Зарегистрироваться
              </Link>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-4 mb-4">
              <span>Забыли пароль?</span>
              <button
                onClick={() => setShowResetPasswordModal(true)}
                className="text-purple-500 hover:underline"
              >
                Восстановить пароль
              </button>
            </div>
            {showResetPasswordModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm md:max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src="/previwLogo.svg"
                        alt="Sdmedik Logo"
                        className="h-8"
                      />
                      <h6 className="text-xl text-purple-500 font-semibold">
                        Sdmedik
                      </h6>
                    </div>
                    <button
                      onClick={handleShowResetPasswordModalClose}
                      className="text-purple-500 hover:text-purple-600"
                    >
                      <MdClose className="text-xl" />
                    </button>
                  </div>
                  <h6 className="text-xl font-semibold mb-4">
                    Укажите ваш Email для восстановления пароля
                  </h6>
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="email@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                  <button
                    onClick={handleResetPassword}
                    className="w-full bg-purple-500 text-white p-3 rounded-lg mt-4 hover:bg-purple-600 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-6 w-6 text-white mx-auto"
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
                      "Подтвердить"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
