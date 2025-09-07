import React from "react";
import { Link as RouterLink } from "react-router-dom";

const menuItems = [
  { text: "Доставка", href: "/delivery" },
  { text: "Реквизиты", href: "/deteils" },
  { text: "Возврат", href: "/returnpolicy" },
  { text: "О нас", href: "/about" },
  { text: "Контакты", href: "/contacts" },
];

const addresses = [
  {
    text: "г. Оренбург, ул. Шевченко д. 20 «В» Магазин - Склад",
    phone: "+7 3532 93-52-41",
  },
  {
    text: "г. Орск, проспект Мира. 15 «Д», ТД Яшма, магазин «Памперсы»",
    phone: "+7 905 896-23-23",
  },
  {
    text: "г. Уфа, ул. Степана Кувыкина, 41, Магазин-Склад",
    phone: "+7 961 366-82-46",
  },
  {
    text: "г. Екатеринбург, пр-т. Ленина 79 «Б», Центр обучения и обеспечения техническими средствами реабилитации",
    phone: "+7 903 086-34-11",
  },
  {
    text: "респ. Чечня, г. Гудермес, ул. Нагорная, 2",
    phone: "+7 928 002-34-19",
  },
  {
    text: "респ. Чечня, г. Грозный, ул. Маты Кишиева, 142",
    phone: "+7 928 002-34-19",
  },
];

export default function Footer() {
  return (
    <div className="bg-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-10">
        <div className="w-full">
          <div>
            <RouterLink to="/">
              <img src="/medi_logo2.png" alt="Sdmedik Logo" className="h-12" />
            </RouterLink>
            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-5">
              <div className="flex flex-col md:flex-row justify-center items-center gap-5">
                {menuItems.map((item, index) => (
                  <RouterLink
                    key={index}
                    to={item.href}
                    className="text-black text-lg hover:text-teal-600 no-underline"
                  >
                    {item.text}
                  </RouterLink>
                ))}
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center gap-5">
                <span className="text-lg font-semibold">+7 (903) 086 3091</span>
                <span className="text-lg font-semibold">+7 (353) 293 5241</span>
              </div>
            </div>
          </div>
        </div>
        {/* Uncomment to include addresses section */}
        {/* <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
          <h4 className="text-2xl font-bold">Адреса магазина</h4>
          <div className="flex flex-wrap gap-6 mt-4">
            {addresses.map((address, index) => (
              <div key={index} className="w-60">
                <p className="text-lg font-semibold">{address.text}</p>
                <p className="text-lg text-gray-600">{address.phone}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
      <div
        className="bg-gradient-to-r from-teal-500 to-teal-400 h-16 flex items-center"
        style={{
          background: `linear-gradient(280.17deg, #00B3A4 -56.17%, #66D1C6 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between w-full">
          <span className="text-gray-600">
            ©️ 2024 ООО “Sdmedik”. Все права защищены.
          </span>
          <span className="text-gray-600">
            Политика конфиденциальных данных
          </span>
        </div>
      </div>
    </div>
  );
}
