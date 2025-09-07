import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Autoplay, Navigation } from "swiper/modules";
import usePromotionStore from "../../../store/promotionStore";

export default function PromotionalSlider() {
  const { fetchPromotion, promotions } = usePromotionStore();

  useEffect(() => {
    fetchPromotion();
  }, [fetchPromotion]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ru-RU", options);
  };

  return (
    <div className="mb-6">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 10000 }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
      >
        {promotions?.data?.length > 0 ? (
          promotions.data.map((slide, index) => (
            <SwiperSlide key={index}>
              <section
                className="flex flex-col justify-center items-center rounded-lg px-5 lg:px-20 h-[300px] lg:h-[400px] text-white relative text-center"
                style={{
                  backgroundImage: `linear-gradient(280.17deg, rgba(0, 179, 164, 0.8), rgba(102, 209, 198, 0.8)), url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h2 className="text-2xl lg:text-5xl font-bold drop-shadow-md mb-2">
                  {slide.name}
                </h2>
                <p className="text-lg lg:text-xl mb-2">{slide.description}</p>
                <p className="text-base lg:text-lg mb-1">
                  Акция действует с {formatDate(slide.start_date)} до{" "}
                  {formatDate(slide.end_date)}
                </p>
              </section>
            </SwiperSlide>
          ))
        ) : (
          <div className="bg-teal-600 rounded-lg p-8 text-white text-center text-lg">
            Нет доступных акций
          </div>
        )}
      </Swiper>

      {/* Стрелки навигации (если нужны) */}
      <div className="swiper-button-prev !text-white" />
      <div className="swiper-button-next !text-white" />
    </div>
  );
}
