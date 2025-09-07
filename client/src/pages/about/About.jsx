import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import api from "../../configs/axiosConfig";

// Utility function to strip HTML tags
const stripHtml = (html) => {
  return html.replace(/<[^>]+>/g, "");
};

export default function About() {
  const [content, setContent] = useState({
    "page-title": "О нас - Средства реабилитации и медицинская техника",
    "meta-description":
      "Мы предлагаем широкий выбор средств реабилитации, медицинских товаров и техники с 2000 года. Консультации и доставка.",
    "meta-keywords":
      "реабилитация, медицинские товары, медицинская техника, коляски, калоприемники, катетеры",
    "meta-robots": "index, follow",
    "canonical-link": "https://yourwebsite.com/about",
    "main-heading": "<h1>О нас</h1>",
    "sub-heading":
      "<h2>Средства реабилитации, Товары медицинского назначения и медицинская техника</h2>",
    "accordion-1-title": "Здоровье",
    "accordion-1-content":
      "<p>Хрупкая вещь, его нужно поддерживать и восстанавливать. Людям с хроническими заболеваниями, в периоды послеоперационной реабилитации, при уходе за больными на дому требуются специализированные изделия медицинского назначения: но где их купить, если в стандартный ассортимент аптек эти позиции не входят?</p>",
    "accordion-2-title": "Наш опыт работы с 2000 года.",
    "accordion-2-content":
      "<p>Мы предлагаем большой выбор СРЕДСТВ РЕАБИЛИТАЦИИ (коляски инвалидные, калоприемники, катетеры, уроприемники и другие средства по уходу).</p>",
    "accordion-3-title": "Наши преимущества",
    "accordion-3-content":
      "<p>Предоставим консультации менеджеров с медицинским образованием.<br />Доставим ваш заказ или отгрузим его со склада магазина самостоятельно.</p>",
  });

  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get("/page/about");
        console.log("About API Response:", response.data); // Debugging
        const newContent = {};
        const elements = Array.isArray(response.data?.data?.elements)
          ? response.data.data.elements
          : Array.isArray(response.data?.elements)
          ? response.data.elements
          : [];
        elements.forEach((item) => {
          newContent[item.element_id] = item.value;
        });
        console.log("Processed content:", newContent); // Debugging
        setContent((prev) => ({ ...prev, ...newContent }));
      } catch (error) {
        console.error("Error fetching page content:", error);
      }
    };
    fetchContent();
  }, []);

  const handleAccordionToggle = (panel) => {
    setExpanded(expanded === panel ? null : panel);
  };

  return (
    <div className="bg-gray-100 py-5">
      <Helmet>
        <title>
          {content["page-title"] ||
            "О нас - Средства реабилитации и медицинская техника"}
        </title>
        <meta name="description" content={content["meta-description"] || ""} />
        <meta name="keywords" content={content["meta-keywords"] || ""} />
        <meta
          name="robots"
          content={content["meta-robots"] || "index, follow"}
        />
        <link
          rel="canonical"
          href={content["canonical-link"] || "https://yourwebsite.com/about"}
        />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-800 text-center"
            dangerouslySetInnerHTML={{
              __html: content["main-heading"] || "<h1>О нас</h1>",
            }}
          />
        </div>
        <div className="w-1/2 mx-auto my-4 border-t-2 border-teal-500"></div>
        <div className="w-full mb-8">
          <img className="w-full rounded-lg" src="/about.png" alt="О нас" />
        </div>
        <div className="flex flex-col gap-10">
          <h2
            className="text-center text-xl md:text-2xl font-medium text-teal-500"
            dangerouslySetInnerHTML={{
              __html:
                content["sub-heading"] ||
                "<h2>Средства реабилитации, Товары медицинского назначения и медицинская техника</h2>",
            }}
          />
          {[
            { title: "accordion-1-title", content: "accordion-1-content" },
            { title: "accordion-2-title", content: "accordion-2-content" },
            { title: "accordion-3-title", content: "accordion-3-content" },
          ].map((item, index) => (
            <div
              key={item.title}
              className="bg-teal-300 text-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full text-left p-4 text-lg font-medium flex justify-between items-center"
                onClick={() => handleAccordionToggle(index)}
              >
                <span>
                  {stripHtml(content[item.title] || `Accordion ${index + 1}`)}
                </span>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    expanded === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expanded === index ? "max-h-52" : "max-h-0"
                }`}
              >
                <div className="p-4">
                  <p
                    className="text-base"
                    dangerouslySetInnerHTML={{
                      __html: content[item.content] || "<p>Нет данных</p>",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
