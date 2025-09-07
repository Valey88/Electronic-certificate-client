import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useUserStore from "../../store/userStore";
import { MdClose, MdEmail, MdPerson, MdPhone, MdLock } from "react-icons/md";

const scaleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 25 },
  },
};

const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/^7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  if (!match) return "+7 (";
  const [, areaCode, firstPart, secondPart, thirdPart] = match;
  return `+7 (${areaCode}${areaCode ? ")" : ""}${
    firstPart ? ` ${firstPart}` : ""
  }${secondPart ? `-${secondPart}` : ""}${thirdPart ? `-${thirdPart}` : ""}`;
};

export default function Register() {
  const {
    email,
    setEmail,
    fio,
    setFio,
    phone_number,
    setPhone_number,
    password,
    setPassword,
    registerFunc,
    showConfirmation,
    setShowConfirmation,
    code,
    setCode,
    verifyFunc,
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
      phone_number: phone_number || "",
      fio: fio || "",
      password: password || "",
    },
  });

  const [error, setError] = useState(null);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const subscription = watch((value) => {
      setEmail(value.email);
      setPhone_number(value.phone_number);
      setFio(value.fio);
      setPassword(value.password);
    });
    return () => subscription.unsubscribe();
  }, [watch, setEmail, setPhone_number, setFio, setPassword]);

  const handleRegister = async () => {
    if (!isConsentGiven) {
      setError("Необходимо согласиться с политикой конфиденциальности");
      return;
    }
    try {
      await registerFunc();
      setError(null);
    } catch (err) {
      setError("Ошибка регистрации. Проверьте введенные данные.");
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setError(null);
    setCode("");
  };

  const handleVerify = async () => {
    if (!code) {
      setError("Код подтверждения обязателен");
      return;
    }
    try {
      await verifyFunc(navigate);
      setError(null);
    } catch (err) {
      setError("Ошибка подтверждения. Проверьте код.");
    }
  };

  const handlePhoneNumberChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setValue("phone_number", formattedPhoneNumber);
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
              <h6 className="text-xl text-purple-500 font-semibold">Sdmedik</h6>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-2xl font-bold">Регистрация</h4>
              <form
                onSubmit={handleSubmit(handleRegister)}
                className="flex flex-col gap-6 mt-2"
              >
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
                        value: /^\S+@\S+$/i,
                        message: "Неправильный формат email",
                      },
                    })}
                    onChange={(e) => setValue("email", e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.phone_number ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("phone_number", {
                      required: "Номер телефона обязателен",
                      pattern: {
                        value: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
                        message: "Неправильный формат номера телефона",
                      },
                    })}
                    onChange={handlePhoneNumberChange}
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Иванов Дмитрий Сергеевич"
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.fio ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("fio", {
                      required: "ФИО обязательно",
                    })}
                    onChange={(e) => setValue("fio", e.target.value)}
                  />
                  {errors.fio && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fio.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Пароль"
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("password", {
                      required: "Пароль обязателен",
                      minLength: {
                        value: 6,
                        message: "Пароль должен быть не короче 6 символов",
                      },
                    })}
                    onChange={(e) => setValue("password", e.target.value)}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isConsentGiven}
                    onChange={(e) => setIsConsentGiven(e.target.checked)}
                    className="h-5 w-5 text-purple-500 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm md:text-base">
                    Я согласен на обработку персональных данных в соответствии с{" "}
                    <a
                      href="/privacy-policy.pdf"
                      target="_blank"
                      className="text-purple-500 hover:underline"
                    >
                      политикой конфиденциальности
                    </a>
                  </span>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <button
                  type="submit"
                  className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-400"
                  disabled={!isConsentGiven}
                >
                  Зарегистрироваться
                </button>
              </form>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-4 mb-4">
              <span>У вас есть аккаунт?</span>
              <Link to="/auth" className="text-purple-500 hover:underline">
                Войти
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm md:max-w-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <img src="/previwLogo.svg" alt="Sdmedik Logo" className="h-8" />
                <h6 className="text-xl text-purple-500 font-semibold">
                  Sdmedik
                </h6>
              </div>
              <button
                onClick={handleConfirmationClose}
                className="text-purple-500 hover:text-purple-600"
              >
                <MdClose className="text-xl" />
              </button>
            </div>
            <h6 className="text-xl font-semibold mb-4">Подтверждение почты</h6>
            <div className="relative">
              <input
                type="text"
                placeholder="Код"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full pl-3 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <button
              onClick={handleVerify}
              className="w-full bg-purple-500 text-white p-3 rounded-lg mt-4 hover:bg-purple-600 transition-colors"
            >
              Подтвердить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
