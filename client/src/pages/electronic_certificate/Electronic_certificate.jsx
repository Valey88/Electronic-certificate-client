import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import api from "../../configs/axiosConfig";
import { AnimatePresence, motion } from "framer-motion";

// Утилита для удаления HTML-тегов
const stripHtml = (html) =>
  typeof html === "string" ? html.replace(/<[^>]+>/g, "") : "";

export default function ElectronicCertificate() {
  const [content, setContent] = useState({
    "page-title":
      "Электронные сертификаты - Получите государственную поддержку",
    "meta-description":
      "Узнайте о электронных сертификатах для получения государственной поддержки на технические средства реабилитации.",
    "meta-keywords":
      "электронные сертификаты, государственная поддержка, технические средства реабилитации, инвалидность",
    "main-heading": "<h1>Электронные сертификаты</h1>",
    "intro-1":
      "<p>Электронный сертификат (ЭС) - это новый платёжный инструмент, при помощи которого можно получать государственную поддержку на приобретение необходимых технических средств реабилитации (ТСР). Электронный сертификат является записью в реестре государственной системы электронных сертификатов, которая привязывается к номеру банковской карты «МИР» получателя. То есть для лица с инвалидностью ЭС работает как банковская карта и позволяет мгновенно оплатить выбранное изделие, если оно соответствует предписаниям медико-социальной экспертизы. Перечень технических средств реабилитации, которые можно приобрести с помощью электронного сертификата, утверждается Министерством труда России.</p>",
    "intro-2":
      "<p>До появления электронного сертификата россияне с инвалидностью могли получить средства реабилитации в отделении Фонда социального страхования, либо приобрести нужное изделие самостоятельно и затем подать документы на компенсацию затраченных средств. Наличие электронного сертификата является дополнительным. Он лишь дополняет уже существующие возможности получения ТСР и оформляется человеком по желанию.</p>",
    "accordion-1-title": "Как можно оформить электронный сертификат?",
    "accordion-1-content":
      "<p>Вы можете подать заявление на оформление ЭС в сети интернет через портал Госуслуг (www.gosuslugi.ru) или же очно – в вашем территориальном органе ФСС РФ, через МФЦ, либо по почте. Для оформления ЭС через Госуслуги вам понадобится написать заявление и предоставить реквизиты вашей банковской карты «МИР». Для оформления ЭС через территориальный орган ФСС или МФЦ вам понадобятся: заявление; документ, удостоверяющий личность, реквизиты вашей банковской карты «МИР».</p>",
    "accordion-2-title": "Как быстро я получу электронный сертификат?",
    "accordion-2-content":
      "<p>После подачи нужного обращения вас известят об открытии для вас ЭС в течение пяти дней.</p>",
    "accordion-3-title": "В чём плюсы электронного сертификата?",
    "accordion-3-content":
      "<p>Удобно то, что господдержкой вы можете воспользоваться быстро — непосредственно в момент покупки, выбрав нужный товар. ЭС индивидуализирует подход к приобретению требуемых ТСР – вы можете выбрать именно то изделие, которое вам нравится.</p>",
    "accordion-4-title": "Какую информацию содержит электронный сертификат?",
    "accordion-4-content":
      "<p>В ЭС указан вид и количество ТСР, которые вы можете приобрести по сертификату; максимальная цена за единицу ТСР, которую можно оплатить сертификатом; срок действия, в течение которого можно использовать сертификат для оплаты ТСР.</p>",
    "list-1-title": "Как определяется номинал моего электронного сертификата?",
    "list-1-content":
      "<p>Фонд социального страхования записывает на ЭС определённую сумму, которую можно использовать для приобретения ТСР. Сумма, положенная по сертификату, определяется по цене таких технических средств реабилитации, которые Фонд социального страхования приобрёл по государственному контракту для обеспечения граждан. Причём, согласно действующему законодательству, учитывается последний исполненный контракт в данном регионе. При этом при расчёте компенсации по электронному сертификату не используются те закупки, когда поставщик демпинговал.</p>",
    "list-2-title": "Что можно купить с помощью электронного сертификата?",
    "list-2-content":
      "<p>Выбор ТСР по электронному сертификату стал более разнообразным. Люди с инвалидностью по нему могут приобрести: Трости, костыли, опоры и поручни; — Кресла-коляски с ручным приводом, с электроприводом и аккумуляторные батареи к ним; — Ортопедическую обувь; — Противопролежневые матрацы и подушки; — Приспособления для одевания, раздевания и захвата предметов; — Специальную одежду; — Специальные устройства для чтения «говорящих книг», для оптической коррекции слабовидения; — Медицинские термометры и тонометры с речевым выходом; — Сигнализаторы звука световые и вибрационные; — Слуховые аппараты, в том числе с ушными вкладышами индивидуального изготовления кресло-стулья с санитарным оснащением; — Брайлевский дисплей, программное обеспечение экранного доступа; — Абсорбирующее белье и подгузники.</p>",
    "list-3-title": "Каков механизм оплаты товара по электронному сертификату?",
    "list-3-content":
      "<p>Деньги резервируются, но не перечисляются на вашу банковскую карту «МИР». При оплате картой того изделия, которое предусмотрено в вашей индивидуальной программе реабилитации (абилитации), средства поступят напрямую продавцу.</p>",
    "list-4-title":
      "Что делать, если мне понравилось ТСР, чья стоимость больше номинала моего ЭС?",
    "list-4-content":
      "<p>Если вам понравилось изделие по цене, превышающей сумму, положенную вам по электронному сертификату, вы всё равно сможете с его помощью оплатить покупку, доплатив из личных средств по карте МИР разницу в цене. Единственное условие – изделие должно соответствовать ИПРА (Индивидуальной программе реабилитации или абилитации инвалида).</p>",
    "list-5-title": "Как выяснить, выгоден ли для меня электронный сертификат?",
    "list-5-content-1":
      "<p>Посмотреть сумму, привязанную к тому или иному ТСР, можно в электронном каталоге. https://ktsr.sfr.gov.ru/ru-RU/ Здесь же можно посмотреть, каков номинал вашего электронного сертификата. Как совершить покупку нужного ТСР при помощи электронного сертификата? Найдите в «Каталоге технических средств реабилитации» на сайте ФСС.</p>",
    "list-5-content-2":
      "<p>РФ(https://ktsr.sfr.gov.ru/ru-RU/) необходимый вам товар. Выберите изделие в «Каталоге технических средств реабилитации» (https://ktsr.sfr.gov.ru/ru-RU/) в разделе «карточка товара». Примите решение о необходимости совершения покупки по электронному сертификату.</p>",
    "list-6-title":
      "Где посмотреть ближайшие ко мне точки, работающие с электронным сертификатом?",
    "list-6-content":
      "<p>Проверить в каталоге технических средств реабилитации Фонда социального страхования на интерактивной карте подключение удобной для вас торговой точки можно на сайте: https://ktsr.sfr.gov.ru/ru-RU/</p>",
  });
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get("/page/certificate");
        const elements = Array.isArray(response.data?.data?.elements)
          ? response.data.data.elements
          : Array.isArray(response.data?.elements)
          ? response.data.elements
          : [];
        const newContent = {};
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

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const accordionItems = [
    { title: "accordion-1-title", content: "accordion-1-content" },
    { title: "accordion-2-title", content: "accordion-2-content" },
    { title: "accordion-3-title", content: "accordion-3-content" },
    { title: "accordion-4-title", content: "accordion-4-content" },
  ];

  const listItems = [
    { title: "list-1-title", content: ["list-1-content"] },
    { title: "list-2-title", content: ["list-2-content"] },
    { title: "list-3-title", content: ["list-3-content"] },
    { title: "list-4-title", content: ["list-4-content"] },
    {
      title: "list-5-title",
      content: ["list-5-content-1", "list-5-content-2"],
    },
    { title: "list-6-title", content: ["list-6-content"] },
  ];

  return (
    <div className="bg-gray-100 px-4 py-8">
      <Helmet>
        <title>{content["page-title"]}</title>
        <meta name="description" content={content["meta-description"]} />
        <meta name="keywords" content={content["meta-keywords"]} />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <div
            className="text-3xl font-bold text-gray-800"
            dangerouslySetInnerHTML={{
              __html:
                content["main-heading"] || "<h1>Электроный Сертификат</h1>",
            }}
          />
          <div className="w-1/2 mx-auto mt-2 border-t-4 border-teal-500" />
        </header>

        <section className="space-y-4 mb-6">
          <div
            className="text-gray-700 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{
              __html: content["intro-1"],
            }}
          />
          <div
            className="text-gray-700 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{
              __html: content["intro-2"],
            }}
          />
        </section>

        <section className="space-y-4 mb-8">
          {accordionItems.map((item, index) => (
            <div key={item.title} className="rounded-lg bg-teal-400 text-white">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-left p-4 font-semibold text-xl flex justify-between items-center"
              >
                {stripHtml(content[item.title])}
                <span>{activeIndex === index ? "−" : "+"}</span>
              </button>

              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden bg-white text-gray-700"
                  >
                    <div
                      className="p-4 text-base"
                      dangerouslySetInnerHTML={{
                        __html: content[item.content] || "<p>Нет данных</p>",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </section>

        <section className="space-y-8">
          {listItems.map((section, index) => (
            <div key={section.title}>
              <div
                className="text-xl font-bold text-teal-600 mb-2"
                dangerouslySetInnerHTML={{
                  __html:
                    content[section.title] || `<p>Раздел ${index + 1}</p>`,
                }}
              />
              <ul className="space-y-2 list-disc list-inside">
                {section.content.map((contentId) => (
                  <li key={contentId} className="text-gray-700 text-base">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: content[contentId] || "<p>Нет данных</p>",
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
