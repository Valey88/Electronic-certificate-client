import React, { useEffect, useState } from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import { Helmet } from "react-helmet";
import api from "../../configs/axiosConfig";

export default function Contacts() {
  const [content, setContent] = useState({
    "page-title": "Контакты - Компании СД-МЕД",
    "meta-description": "Контактная информация нашей компании",
    "meta-keywords": "контакты, адрес, телефон",
    "main-heading": "<h1>Контакты</h1>",
    "phone-1": "+7 (903) 086 3091",
    "phone-2": "+7 (353) 293 5241",
    "address-1":
      "г. Оренбург, ул. Шевченко д. 20 «В» Магазин - Склад<br>+7 3532 93-52-41",
    "address-2":
      "г. Орск, проспект Мира. 15 «Д», ТД Яшма, магазин «Памперсы»<br>+7 905 896-23-23",
    "address-3":
      "г. Уфа, ул. Степана Кувыкина, 41, Магазин-Склад<br>+7 961 366-82-46",
    "address-4":
      "г. Екатеринбург, пр-т. Ленина 79 «Б», Центр обучения и обеспечения техническими средствами реабилитации<br>+7 903 086-34-11",
    "coords-1": "[51.769, 55.096]",
    "coords-2": "[51.227, 58.562]",
    "coords-3": "[54.738, 55.972]",
    "coords-4": "[56.838, 60.597]",
  });

  const stripHtml = (html) => {
    return html.replace(/<[^>]+>/g, "");
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get("/page/contacts");
        console.log("Contacts API Response:", response.data);
        const newContent = {};
        const elements = Array.isArray(response.data?.data?.elements)
          ? response.data.data.elements
          : Array.isArray(response.data?.elements)
          ? response.data.elements
          : [];
        elements.forEach((item) => {
          newContent[item.element_id] = item.value;
        });
        console.log("Processed content:", newContent);
        setContent((prev) => ({ ...prev, ...newContent }));
      } catch (error) {
        console.error("Error fetching page content:", error);
      }
    };
    fetchContent();
  }, []);

  const addresses = [
    {
      address: content["address-1"],
      coords: JSON.parse(content["coords-1"] || "[51.769, 55.096]"),
    },
    {
      address: content["address-2"],
      coords: JSON.parse(content["coords-2"] || "[51.227, 58.562]"),
    },
    {
      address: content["address-3"],
      coords: JSON.parse(content["coords-3"] || "[54.738, 55.972]"),
    },
    {
      address: content["address-4"],
      coords: JSON.parse(content["coords-4"] || "[56.838, 60.597]"),
    },
  ];

  return (
    <div className="mb-8">
      <Helmet>
        <title>{content["page-title"] || "Контакты - Компании СД-МЕД"}</title>
        <meta name="description" content={content["meta-description"] || ""} />
        <meta name="keywords" content={content["meta-keywords"] || ""} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6 mt-5"
          dangerouslySetInnerHTML={{
            __html: content["main-heading"] || "<h1>Контакты</h1>",
          }}
        />
        <div className="w-full">
          <img
            src="/Line 1.png"
            alt="Линия разделения"
            className="w-full h-1"
          />
        </div>
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          <div className="w-full  md:w-3/5">
            <YMaps>
              <Map
                defaultState={{ center: [55.751574, 37.573856], zoom: 4 }}
                className="w-full h-[300px] sm:h-[400px] md:h-[600px] lg:h-[700px] shadow-sm"
              >
                {addresses.map((item, index) => (
                  <Placemark
                    key={index}
                    geometry={item.coords}
                    properties={{
                      balloonContent: stripHtml(item.address),
                    }}
                  />
                ))}
              </Map>
            </YMaps>
          </div>
          <div className="w-full md:w-2/5 flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <img src="/Phone.png" alt="Иконка телефона" className="w-8 h-8" />
              <div className="flex flex-col">
                <a
                  href={`tel:${stripHtml(
                    content["phone-1"] || "+7 (903) 086 3091"
                  )}`}
                  className="text-xs sm:text-sm md:text-xl text-gray-800 hover:text-[#00B3A4] transition-colors duration-200"
                >
                  {stripHtml(content["phone-1"] || "+7 (903) 086 3091")}
                </a>
                <a
                  href={`tel:${stripHtml(
                    content["phone-2"] || "+7 (353) 293 5241"
                  )}`}
                  className="text-xs sm:text-sm md:text-xl text-gray-800 hover:text-[#00B3A4] transition-colors duration-200"
                >
                  {stripHtml(content["phone-2"] || "+7 (353) 293 5241")}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <img src="/mark.png" alt="Иконка адреса" className="w-8 h-8" />
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-4">
                  Пункты выдачи заказов:
                </h2>
                <ul className="space-y-4">
                  {[1, 2, 3, 4].map((index) => (
                    <li
                      key={index}
                      className="text-sm sm:text-base text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html:
                          content[`address-${index}`] || "<p>Нет данных</p>",
                      }}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
