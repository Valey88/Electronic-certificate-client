import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useBascketStore from "../store/bascketStore";
import useUserStore from "../store/userStore";
import { UserIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef(null);
  const menuRef = useRef(null);
  const { isAuthenticated, user, logout } = useUserStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { fetchUserBasket, basket } = useBascketStore();

  const handleClick = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    fetchUserBasket();
    if (user?.data) {
      setIsAdmin(user.data.role_id === 1);
    }
  }, [user, fetchUserBasket]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        anchorRef.current &&
        !anchorRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const profileText = isAdmin ? "Администратор" : user?.data?.fio || "Профиль";
  const profilePath = isAdmin ? "/admin" : "/profile";

  return (
    <div className="flex items-center space-x-4">
      <button
        ref={anchorRef}
        onClick={handleClick}
        className="text-purple-600 hover:text-purple-800 relative"
        aria-label="user menu"
      >
        <UserIcon className="w-8 h-8" />
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-12 right-65 bg-white shadow-xl rounded-lg z-50 min-w-[220px] p-4 border border-purple-100"
        >
          {isAuthenticated ? (
            <>
              <Link
                to={profilePath}
                onClick={handleClose}
                className="block text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-md"
              >
                {profileText}
              </Link>
              <Link
                to="/"
                onClick={() => {
                  logout();
                  handleClose();
                }}
                className="block text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-md"
              >
                Выйти
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                onClick={handleClose}
                className="block text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-md"
              >
                Войти
              </Link>
              <Link
                to="/register"
                onClick={handleClose}
                className="block text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-md"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      )}
      <button
        onClick={() => navigate("/basket")}
        className="text-purple-600 hover:text-purple-800 relative"
        aria-label="basket"
      >
        <ShoppingCartIcon className="w-8 h-8" />
        {basket?.data?.quantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
            {basket?.data?.quantity}
          </span>
        )}
      </button>
    </div>
  );
};

export default UserMenu;