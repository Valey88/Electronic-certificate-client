import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import api from "../../configs/axiosConfig";

export default function Delivery() {
  const [content, setContent] = useState({
    "page-title": "Доставка - СД-МЕД",
    "meta-description":
      "Узнайте о доставке по Оренбургу и другим городам России. Бесплатная доставка по Оренбургу и информация о стоимости доставки в другие регионы.",
    "meta-keywords":
      "доставка, Оренбург, бесплатная доставка, доставка по России, курьерская доставка",
    "main-heading": "<h1>Доставка</h1>",
    "section-heading": "<h5>Условия доставки</h5>",
    "condition-1":
      "<p>Стоимость заказа включает в себя стоимость заказанных товаров и стоимость почтовой/курьерской доставки до региона получателя – ПРИ ОФОРМЛЕНИИ ПОЛНОГО СЕРТИФИКАТА на выдачу ТСР.</p>",
    "condition-2":
      "<p>ПРИ заказе отдельных ТСР – стоимость доставки УТОЧНЯЙТЕ у специалиста в чате!</p>",
    "condition-3":
      "<p>Способы доставки: ПЭК, СДЭК, Курьеры, Почта РФ, собственная логистика и транспорт, другое.</p>",
    "condition-4":
      "<p>Стоимость доставки зависит от региона получателя (при доставке компанией СДЭК на стоимость доставки влияет также общий вес заказа).</p>",
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get("/page/delivery");
        const newContent = {};
        const elements = Array.isArray(response.data?.data?.elements)
          ? response.data.data.elements
          : [];
        elements.forEach((item) => {
          newContent[item.element_id] = item.value;
        });
        setContent((prev) => ({ ...prev, ...newContent }));
      } catch (error) {
        console.error("Error fetching page content:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <div>
      <Helmet>
        <title>{content["page-title"]}</title>
        <meta name="description" content={content["meta-description"]} />
        <meta name="keywords" content={content["meta-keywords"]} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <div
            className="text-2xl font-bold text-gray-800"
            dangerouslySetInnerHTML={{
              __html: content["main-heading"],
            }}
          />
          <hr className="border-t-2 border-teal-500 w-1/2 mx-auto mt-2" />
        </div>

        <div className="flex flex-col md:flex-row md:space-x-10 items-center my-8">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              className="rounded-lg object-contain w-full max-w-md"
              src="/delivery.png"
              alt="Доставка"
            />
          </div>

          <div className="w-full md:w-2/3 mt-6 md:mt-0">
            <div className="bg-white p-6 rounded-lg shadow">
              <div
                className="text-xl font-bold text-teal-600 text-center mb-4"
                dangerouslySetInnerHTML={{
                  __html: content["section-heading"],
                }}
              />
              <ul className="space-y-4">
                {[
                  "condition-1",
                  "condition-2",
                  "condition-3",
                  "condition-4",
                ].map((id) => (
                  <li key={id}>
                    <div
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: content[id] || "<p>Нет данных</p>",
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
