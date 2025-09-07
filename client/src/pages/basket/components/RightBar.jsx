import React, { useState } from "react";
import { Info } from "@mui/icons-material";
import useBascketStore from "../../../store/bascketStore";
import { useNavigate } from "react-router-dom";

export default function RightBar() {
  const { basket } = useBascketStore();
  const basketData = basket.data || {};
  const navigate = useNavigate();
  const [openDelivery, setOpenDelivery] = useState(false);
  const [openCertificate, setOpenCertificate] = useState(false);

  const handleOpenDelivery = () => setOpenDelivery(true);
  const handleCloseDelivery = () => setOpenDelivery(false);
  const handleOpenCertificate = () => setOpenCertificate(true);
  const handleCloseCertificate = () => setOpenCertificate(false);

  return (
    <div className="w-full lg:w-1/4 mt-6 lg:mt-20">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Оформление заказа
        </h3>
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-7 00">По сертификату</span>
            <button
              onClick={handleOpenCertificate}
              className="text-teal-500 hover:text-teal-600 transition-colors duration-200"
            >
              <Info />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Доставка</span>
            <button
              onClick={handleOpenDelivery}
              className="text-teal-500 hover:text-teal-600 transition-colors duration-200"
            >
              <Info />
            </button>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <p className="text-gray-700">Товаров: {basketData.quantity || 0}</p>
          {basketData.total_price_with_promotion > 0 && (
            <p className="text-gray-600">
              Скидка:{" "}
              {basketData.total_price - basketData.total_price_with_promotion} ₽
            </p>
          )}
          <p className="text-lg font-medium text-teal-500">
            Итого:{" "}
            {basketData.total_price_with_promotion > 0
              ? basketData.total_price_with_promotion
              : basketData.total_price || 0}{" "}
            ₽
          </p>
        </div>
        <button
          onClick={() => navigate("/paymants")}
          className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-colors duration-200"
        >
          Перейти к оплате
        </button>
      </div>

      {/* Delivery Modal */}
      {openDelivery && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white bg-opacity-95 w-full sm:w-3/4 md:w-1/2 max-w-lg p-6 rounded-l-lg shadow-lg border-t-2 border-teal-500 overflow-y-auto">
            <h3 className="text-lg font-semibold text-teal-500 mb-3">
              Условия доставки
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Для уточнения стоимости доставки или возможности бесплатной
              доставки, задайте вопрос в чате специалисту. Также, информация
              указана в разделе «Доставка».
            </p>
            <button
              onClick={handleCloseDelivery}
              className="w-full bg-teal-500 text-white py-2 rounded-lg mt-4 hover:bg-teal-600 transition-colors duration-200"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {openCertificate && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white bg-opacity-95 w-full sm:w-3/4 md:w-1/2 max-w-lg p-6 rounded-l-lg shadow-lg border-t-2 border-teal-500 overflow-y-auto">
            <h3 className="text-lg font-semibold text-teal-500 mb-3">
              По сертификату
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Пошаговая инструкция приобретения по сертификату есть в чате
              поддержки, по всем вопросам Вам также ответят наши специалисты.
            </p>
            <button
              onClick={handleCloseCertificate}
              className="w-full bg-teal-500 text-white py-2 rounded-lg mt-4 hover:bg-teal-600 transition-colors duration-200"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
