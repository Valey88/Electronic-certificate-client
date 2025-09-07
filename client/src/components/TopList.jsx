import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import useProductStore from "../store/productStore";
import useBascketStore from "../store/bascketStore";
import { urlPictures } from "../configs/axiosConfig";

export default function TopList() {
  const { fetchTopList, products } = useProductStore();
  const { addProductThisBascket } = useBascketStore();
  const [quantity] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopList();
  }, [fetchTopList]);

  useEffect(() => {
    const handleScroll = () => {
      const top = document
        .getElementById("top-list")
        .getBoundingClientRect().top;
      if (top < window.innerHeight) {
        setIsVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToBasket = async (id) => {
    await addProductThisBascket(id, quantity);
  };

  return (
    <div id="top-list" className="px-4 py-8">
      <Helmet>
        <title>Лучшие товары - Магазина СД-МЕД</title>
        <meta
          name="description"
          content="Посмотрите лучшие товары нашего магазина."
        />
        <meta name="keywords" content="товары, магазин, кресло-коляска" />
      </Helmet>

      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: isVisible ? 0 : "100%", opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <img src="/Line 1.png" alt="Линия" className="w-full" />
        <h2 className="text-2xl font-bold mt-6 mb-8">Лучшие товары</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.data?.length > 0 ? (
            products.data.map((item) => (
              <div
                key={item.id}
                className="bg-[#F5FCFF] rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
              >
                <div
                  className="h-48 border-b flex items-center justify-center"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img
                    src={`${urlPictures}/${item.image}`}
                    alt={item.name}
                    className="object-cover h-full w-full rounded-t-lg"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="font-semibold text-sm md:text-base truncate"
                    onClick={() => navigate(`/product/certificate/${item.id}`)}
                  >
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    Всего заказов {item.order_count} шт.
                  </p>
                  <button
                    onClick={() => handleAddToBasket(item.id)}
                    className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition"
                  >
                    В корзину
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">Загрузка товаров...</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
