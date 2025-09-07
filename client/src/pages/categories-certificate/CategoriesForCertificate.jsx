import React, { useEffect } from "react";
import useCategoryStore from "../../store/categoryStore";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { urlPictures } from "../../configs/axiosConfig";

export default function CategoriesPage() {
  const { fetchCategory, category } = useCategoryStore();

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return (
    <div className="my-8">
      <Helmet>
        <title>Категории товаров | Sdmedik.ru</title>
        <meta
          name="description"
          content="Ознакомьтесь с нашими категориями товаров. Мы предлагаем широкий ассортимент продукции для ваших нужд."
        />
        <meta
          name="keywords"
          content="категории, товары, ассортимент, продукция"
        />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Категории товаров
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
          {Array.isArray(category.data) && category.data.length > 0 ? (
            category.data.map((item) => (
              <Link
                to={`/products/certificate/${item.id}`}
                key={item.id}
                className="group"
              >
                <div className="relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full">
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                    <img
                      src={`${urlPictures}/${item.images[0]?.name}`}
                      alt={`Изображение категории ${item.name}`}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center">
                    <h2 className="text-xs sm:text-sm md:text-xl font-semibold text-gray-800 text-center">
                      {item.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-lg text-gray-600 col-span-full text-center">
              Нет данных
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
