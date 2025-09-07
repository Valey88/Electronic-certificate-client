import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function PaymantsInfo() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Helmet>
        <title>Оплата электронным сертификатом</title>
        <meta
          name="description"
          content="Теперь оплачивать покупки на нашем сайте вы можете и электронным сертификатом."
        />
        <meta
          name="keywords"
          content="оплата, электронный сертификат, покупки"
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="flex flex-col lg:flex-row justify-between rounded-xl px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-15 gap-4 sm:gap-6 lg:gap-8 bg-gradient-to-r from-[#D3D3FF] to-[#B3B3FA] shadow-md">
        {/* Текстовая часть */}
        <div className="flex flex-col gap-8 w-full lg:w-1/2 text-gray-800">
          <h2 className="text-2xl sm:text-3xl md:text-6xl font-bold leading-tight">
            Оплата электронным сертификатом
          </h2>
          <p className="text-base sm:text-2xl">
            Теперь оплачивать покупки на нашем сайте вы можете и электронным
            сертификатом
          </p>
          <button
            onClick={() => navigate("/certificate")}
            className="bg-[#1C5796] text-white font-medium text-base sm:text-lg px-10 py-3 rounded-lg shadow-md hover:bg-[#15487A] transition-colors w-max"
          >
            Подробнее
          </button>
        </div>

        {/* Изображение */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <LazyLoadImage
            src="/Group31.png"
            alt="Оплата электронным сертификатом"
            className="w-full max-w-xs sm:max-w-md md:max-w-lg h-auto object-cover rounded-lg"
            effect="blur"
            placeholderSrc="/placeholder.jpg"
          />
        </div>
      </section>
    </div>
  );
}

export default React.memo(PaymantsInfo);
