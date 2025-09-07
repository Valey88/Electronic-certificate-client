import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const navItems = [
    { text: "Доставка", href: "/delivery" },
    { text: "Реквизиты", href: "/deteils" },
    { text: "Сертификат", href: "/certificate" },
    // { text: "Блог", href: "/blog-list" },
    { text: "Возврат", href: "/returnpolicy" },
    { text: "О нас", href: "/about" },
    { text: "Контакты", href: "/contacts" },
  ];

  return (
    <nav className="hidden lg:flex items-center space-x-6">
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.href}
          className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
        >
          {item.text}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
