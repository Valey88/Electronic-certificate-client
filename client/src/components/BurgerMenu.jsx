import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import useBascketStore from "../store/bascketStore";

const BurgerMenu = ({ toggleDrawer }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();
  const { fetchUserBasket, basket } = useBascketStore();

  useEffect(() => {
    fetchUserBasket();
  }, [fetchUserBasket]);

  return (
    <div className="w-64 bg-white h-full p-4" role="presentation">
      <ul className="flex flex-col space-y-2">
        <li>
          <Link
            to="/delivery"
            className="text-teal-500 hover:text-teal-600 ml-2"
            onClick={toggleDrawer(false)}
          >
            Доставка
          </Link>
        </li>
        <li>
          <Link
            to="/deteils"
            className="text-teal-500 hover:text-teal-600 ml-2"
            onClick={toggleDrawer(false)}
          >
            Реквизиты
          </Link>
        </li>
        <li>
          <Link
            to="/returnpolicy"
            className="text-teal-500 hover:text-teal-600 ml-2"
            onClick={toggleDrawer(false)}
          >
            Возврат
          </Link>
        </li>
        <li>
          <Link
            to="/blog-list"
            className="text-teal-500 hover:text-teal-600 ml-2"
            onClick={toggleDrawer(false)}
          >
            Блог
          </Link>
        </li>
        <li>
          <Link
            to="/certificate"
            className="text-teal-500 hover:text-teal-600 ml-2"
            onClick={toggleDrawer(false)}
          >
            Электронный сертификат
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="text-teal-500 hover:text-teal-600 ml-2"
            onClick={toggleDrawer(false)}
          >
            О нас
          </Link>
        </li>
        <li>
          <Link
            to="/contacts"
            className="text-teal-500 hover:text-teal-600 ml-2"
            onClick={toggleDrawer(false)}
          >
            Контакты
          </Link>
        </li>
        <div className="mt-4 flex flex-col">
          <Link
            to="/catalog/certificate"
            className="text-lg text-teal-500 hover:text-teal-600 ml-4 mt-4 mb-3"
            onClick={toggleDrawer(false)}
          >
            Каталог
          </Link>
        </div>
        <div className="flex items-center mt-4 ml-4 space-x-4">
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="text-teal-500 hover:text-teal-600"
              onClick={toggleDrawer(false)}
            >
              Личный кабинет
            </Link>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link
                to="/auth"
                className="text-teal-500 hover:text-teal-600"
                onClick={toggleDrawer(false)}
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="text-teal-500 hover:text-teal-600"
                onClick={toggleDrawer(false)}
              >
                Регистрация
              </Link>
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/basket");
            }}
            className="relative"
          >
            <img src="/basket_header.png" alt="basket" className="w-11 h-11" />
            {basket?.data?.quantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {basket?.data?.quantity}
              </span>
            )}
          </button>
        </div>
      </ul>
    </div>
  );
};

export default BurgerMenu;
