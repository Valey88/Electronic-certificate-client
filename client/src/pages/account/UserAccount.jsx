import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  MdShoppingCart,
  MdFavorite,
  MdAccountCircle,
  MdLocalOffer,
  MdSettings,
  MdExitToApp,
} from "react-icons/md";
import useUserStore from "../../store/userStore";
import useOrderStore from "../../store/orderStore";
import { useLocation } from "react-router-dom";

export default function UserAccount() {
  const { getUserInfo, user, logout } = useUserStore();
  const { fetchUserOrders, userOrders } = useOrderStore();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    window.history.replaceState({}, document.title, location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getUserInfo(), fetchUserOrders()]);
      } catch (err) {
        console.error("Error fetching user data or orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getUserInfo, fetchUserOrders]);

  const handleTabChange = (newValue) => {
    setCurrentTab(newValue);
  };

  const statusStyles = {
    pending: "text-orange-600 bg-orange-100",
    processing: "text-blue-600 bg-blue-100",
    completed: "text-green-600 bg-green-100",
    canceled: "text-red-600 bg-red-100",
  };

  const statusTranslations = {
    pending: "В ожидании",
    processing: "Рассмотрен",
    completed: "Завершен",
    canceled: "Отменен",
  };

  const tabs = [
    {
      label: "Мои заказы",
      icon: <MdShoppingCart className="text-purple-500" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Мои заказы
          </h2>
          <div className="grid gap-6">
            {userOrders.data?.length ? (
              userOrders.data.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    Заказ №{order.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Дата заказа:{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-800">
                      Статус заказа
                    </h4>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        statusStyles[order.status]
                      }`}
                    >
                      {statusTranslations[order.status] || "Неизвестный статус"}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-800">
                      Товары:
                    </h4>
                    <ul className="space-y-2">
                      {order.items.map((item) => (
                        <li
                          key={item.id}
                          className="text-sm text-gray-700 flex items-center gap-2"
                        >
                          {item.image && (
                            <LazyLoadImage
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-md"
                              effect="blur"
                              placeholderSrc="/placeholder.jpg"
                            />
                          )}
                          <span>
                            {item.name} — Количество: {item.quantity}, Цена:{" "}
                            {item.price} руб
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">Нет заказов</p>
            )}
          </div>
        </div>
      ),
    },
    {
      label: "Избранное",
      icon: <MdFavorite className="text-purple-500" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Избранное
          </h2>
          <p className="text-gray-600 text-center">
            Список избранного пуст. Добавьте товары, чтобы они отобразились
            здесь.
          </p>
        </div>
      ),
    },
    {
      label: "Бонусы и скидки",
      icon: <MdLocalOffer className="text-purple-500" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Бонусы и скидки
          </h2>
          <p className="text-gray-600 text-center">
            Информация о бонусах и скидках скоро появится.
          </p>
        </div>
      ),
    },
    {
      label: "Настройки",
      icon: <MdSettings className="text-purple-500" />,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Настройки
          </h2>
          <p className="text-gray-600 text-center">
            Настройки аккаунта скоро будут доступны.
          </p>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <svg
          className="animate-spin h-8 w-8 text-purple-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-80">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 flex items-center gap-4 border-b border-gray-200">
                <MdAccountCircle className="text-purple-500 text-4xl" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user?.data?.fio || "Пользователь"}
                  </h3>
                  <p className="text-sm text-gray-600">{user?.data?.email}</p>
                </div>
              </div>
              <ul className="py-2">
                {tabs.map((tab, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-3 px-6 py-3 cursor-pointer text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 ${
                      currentTab === index ? "bg-purple-50 text-purple-600" : ""
                    }`}
                    onClick={() => handleTabChange(index)}
                  >
                    {tab.icon}
                    <span className="text-sm font-medium">{tab.label}</span>
                  </li>
                ))}
                <li
                  className="flex items-center gap-3 px-6 py-3 cursor-pointer text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                  onClick={() => logout()}
                >
                  <MdExitToApp className="text-purple-500" />
                  <span className="text-sm font-medium">Выйти</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
              {tabs[currentTab].content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
