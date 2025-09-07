import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import useOrderStore from "../../store/orderStore";

const scaleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 25,
    },
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

export default function PayOnclick() {
  const {
    email,
    setEmail,
    fio,
    setFio,
    phone_number,
    delivery_address,
    setPhone_number,
    setDelivery_address,
    payOrderById,
  } = useOrderStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    await payOrderById(id);
  };

  const handlePhoneNumberChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhone_number(formattedPhoneNumber);
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleVariants}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <img src="/previwLogo.svg" alt="Logo" />
          <h1 className="text-lg font-semibold text-teal-500">Sdmedik</h1>
        </div>

        <h2 className="text-2xl font-bold mb-4">Укажите контактные данные</h2>

        <form
          onSubmit={handleSubmit(handlePay)}
          className="flex flex-col gap-6"
        >
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              {...register("email", {
                required: "Это поле обязательно для заполнения",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Неправильный формат email",
                },
              })}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Телефон</label>
            <input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone_number}
              {...register("phone_number", {
                required: "Это поле обязательно для заполнения",
                pattern: {
                  value: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
                  message: "Неправильный формат номера телефона",
                },
              })}
              onChange={handlePhoneNumberChange}
              className={`w-full border ${
                errors.phone_number ? "border-red-500" : "border-gray-300"
              } px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400`}
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone_number.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">ФИО</label>
            <input
              type="text"
              placeholder="Иванов Дмитрий Сергеевич"
              value={fio}
              {...register("fio", {
                required: "Это поле обязательно для заполнения",
              })}
              onChange={(e) => setFio(e.target.value)}
              className={`w-full border ${
                errors.fio ? "border-red-500" : "border-gray-300"
              } px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400`}
            />
            {errors.fio && (
              <p className="text-sm text-red-500 mt-1">{errors.fio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Адрес доставки</label>
            <input
              type="text"
              placeholder="ул. Примерная, д. 1"
              {...register("delivery_address", {
                required: "Это поле обязательно для заполнения",
              })}
              onChange={(e) => setDelivery_address(e.target.value)}
              className={`w-full border ${
                errors.delivery_address ? "border-red-500" : "border-gray-300"
              } px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400`}
            />
            {errors.delivery_address && (
              <p className="text-sm text-red-500 mt-1">
                {errors.delivery_address.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-teal-500 text-white py-3 rounded hover:bg-teal-600 transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <span className="flex justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </span>
            ) : (
              "Перейти к оплате"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
