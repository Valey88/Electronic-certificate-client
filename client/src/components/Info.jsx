import React from "react";
import { Helmet } from "react-helmet";

export default function Info() {
  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <Helmet>
        <title>График работы в праздничные дни - Samedik.ru</title>
        <meta
          name="description"
          content="Узнайте график работы Samedik.ru в праздничные дни, важные уведомления и поздравление от коллектива."
        />
        <meta
          name="keywords"
          content="Samedik, график работы, праздничные дни, интернет-магазин, медицинские товары"
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-12 bg-gradient-to-r from-[#D3D3FF] to-[#B3B3FA] rounded-3xl m-4 sm:m-6 md:m-8 shadow-lg flex flex-col items-center text-center gap-6 sm:gap-7">
        {/* Важно */}
        <div className="flex flex-col gap-4 bg-white/80 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-4xl shadow-md">
          <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-gray-800">
            Важно
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-800">
            Имеются медицинские противопоказания. Перед использованием продукции
            обязательно проконсультируйтесь со специалистом.
          </p>
        </div>

        {/* Уведомление о продукции */}
        <div className="flex flex-col gap-4 bg-white/80 backdrop-blur-md rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-4xl shadow-md">
          <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-gray-800">
            Уведомление о продукции и ценах
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-800">
            Информация и цены, указанные на сайте, не являются публичной
            офертой, определяемой положениями статьи 437 Гражданского кодекса
            Российской Федерации. Товар на фото может отличаться от оригинала.
            Для получения подробной информации о модели, характеристиках,
            комплектации, стоимости, сроках и условиях поставки просьба уточнять
            через форму обратной связи или по телефону.
          </p>
        </div>
      </section>
    </div>
  );
}
