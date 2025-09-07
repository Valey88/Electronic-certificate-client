import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import api from "../../configs/axiosConfig";

export default function Details() {
  const [content, setContent] = useState({
    "page-title": "Реквизиты компании СД-МЕД - Полная информация о компании",
    "meta-description":
      "Узнайте полные реквизиты компании СД-МЕД, включая ИНН, КПП, адрес и контактные данные. Мы предоставляем качественные медицинские услуги.",
    "meta-keywords":
      "реквизиты СД-МЕД, ИНН СД-МЕД, контактные данные СД-МЕД, адрес СД-МЕД",
    "main-heading": "<h1>Реквизиты</h1>",
    "section-heading":
      "<h2>ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ «СД-МЕД»</h2>",
    "detail-1":
      "<p>ИНН 5609198444, КПП 560901001 ОГРН 1225600000361 460005, Оренбургская область, г. Оренбург, ул. Шевченко д. 20В, этаж 1, офис 1</p>",
    "detail-2": "<p>БИК 042202824</p>",
    "detail-3": "<p>К/с 30101810200000000824</p>",
    "detail-4": "<p>Р/с 40702810529250005622</p>",
    "detail-5": "<p>E-mail: Sd2-info@yandex.ru | www.sdmedik.ru</p>",
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get("/page/deteils");
        const newContent = {};
        const elements = Array.isArray(response.data?.data?.elements)
          ? response.data.data.elements
          : Array.isArray(response.data?.elements)
          ? response.data.elements
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
    <div className="py-6 px-4">
      <Helmet>
        <title>{content["page-title"]}</title>
        <meta name="description" content={content["meta-description"]} />
        <meta name="keywords" content={content["meta-keywords"]} />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <div
            className="text-2xl font-bold text-gray-800"
            dangerouslySetInnerHTML={{
              __html: content["main-heading"],
            }}
          />
          <hr className="border-teal-500 border-t-2 w-1/2 mx-auto my-2" />
        </div>

        <div className="text-center mb-4">
          <div
            className="text-xl font-bold text-teal-600"
            dangerouslySetInnerHTML={{
              __html: content["section-heading"],
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ul className="space-y-4">
            {["detail-1", "detail-2", "detail-3", "detail-4", "detail-5"].map(
              (id) => (
                <li key={id}>
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: content[id] || "<p>Нет данных</p>",
                    }}
                  />
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
