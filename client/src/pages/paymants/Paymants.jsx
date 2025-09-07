import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import useOrderStore from "../../store/orderStore";
import useUserStore from "../../store/userStore";

const scaleVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
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

export default function Payments() {
  const {
    email,
    setEmail,
    fio,
    delivery_address,
    setFio,
    phone_number,
    setPhone_number,
    setDelivery_address,
    payOrder,
  } = useOrderStore();
  const { user, isAuthenticated, getUserInfo } = useUserStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [isAnotherRecipient, setIsAnotherRecipient] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getUserInfo().catch((err) =>
        console.error("Ошибка загрузки данных пользователя:", err)
      );
    }
  }, [isAuthenticated, getUserInfo]);

  useEffect(() => {
    if (isAuthenticated && user?.data && !isAnotherRecipient) {
      setEmail(user.data.email || "");
      setFio(user.data.fio || "");
      setPhone_number(user.data.phone_number || "");

      setValue("email", user.data.email || "");
      setValue("fio", user.data.fio || "");
      setValue("phone_number", user.data.phone_number || "");
    }
  }, [
    user,
    isAuthenticated,
    isAnotherRecipient,
    setEmail,
    setFio,
    setPhone_number,
    setValue,
  ]);

  const handlePay = async (data) => {
    setLoading(true);
    try {
      await payOrder({
        email:
          isAuthenticated && !isAnotherRecipient
            ? user?.data?.email || email
            : data.email,
        fio:
          isAuthenticated && !isAnotherRecipient
            ? user?.data?.fio || fio
            : data.fio,
        phone_number:
          isAuthenticated && !isAnotherRecipient
            ? user?.data?.phone_number || phone_number
            : data.phone_number,
        delivery_address: data.delivery_address,
      });
    } catch (error) {
      console.error("Ошибка оплаты:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone_number(formatted);
  };

  return (
    <div className="flex justify-center py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleVariants}
        className="w-[320px] md:w-[500px]"
      >
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <img src="/previwLogo.svg" alt="logo" className="h-8" />
            <h2 className="text-lg font-bold text-teal-500">Sdmedik</h2>
          </div>

          <h3 className="text-2xl font-semibold mb-6">
            Укажите контактные данные
          </h3>

          <form onSubmit={handleSubmit(handlePay)} className="space-y-5">
            {(!isAuthenticated || isAnotherRecipient) && (
              <>
                <div>
                  <label className="block text-md  mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Это поле обязательно",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Неправильный формат email",
                      },
                    })}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-1 border-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-md  mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    {...register("phone_number", {
                      required: "Это поле обязательно",
                      pattern: {
                        value: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
                        message: "Неправильный формат номера",
                      },
                    })}
                    value={phone_number}
                    onChange={handlePhoneNumberChange}
                    className="w-full border-1 border-gray-200  rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+7 (___) ___-__-__"
                  />
                  {errors.phone_number && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-md  mb-1">ФИО</label>
                  <input
                    type="text"
                    {...register("fio", {
                      required: "Это поле обязательно",
                    })}
                    value={fio}
                    onChange={(e) => setFio(e.target.value)}
                    className="w-full border-1 border-gray-200  rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Иванов Иван Иванович"
                  />
                  {errors.fio && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.fio.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-md  mb-1">
                Адрес доставки
              </label>
              <input
                type="text"
                {...register("delivery_address", {
                  required: "Это поле обязательно",
                })}
                onChange={(e) => setDelivery_address(e.target.value)}
                className="w-full border-1 border-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="ул. Примерная, д. 1"
              />
              {errors.delivery_address && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.delivery_address.message}
                </p>
              )}
            </div>

            {isAuthenticated && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isAnotherRecipient}
                  onChange={(e) => setIsAnotherRecipient(e.target.checked)}
                  className="accent-teal-500"
                />
                <span className="text-sm text-gray-700">
                  Указать другого получателя
                </span>
              </label>
            )}

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition"
              disabled={loading}
              style={{ background: "#00B3A4", cursor: "pointer" }}
            >
              {loading ? (
                <span className="flex justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  />
                </span>
              ) : (
                "Перейти к оплате"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
