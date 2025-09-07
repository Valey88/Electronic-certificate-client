import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ContactMenu from "./ContactMenu";
import CatalogButtons from "./CatalogButtons";
import UserMenu from "./UserMenu";
import Search from "./Search";
import BurgerMenu from "./BurgerMenu";
import Navigation from "./Navigation";
import useUserStore from "../store/userStore";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    isAuthenticated,
    setIsAuthenticated,
    checkAuthStatus,
    getUserInfo,
    user,
    logout,
  } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
    const intervalId = setInterval(checkAuthStatus, 300000);
    return () => clearInterval(intervalId);
  }, [setIsAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      await getUserInfo();
    };
    fetchData();
  }, [getUserInfo]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Toolbar */}
        <div className="hidden lg:flex flex-col py-2 space-y-4">
          <div className="flex justify-center items-center space-x-5 gap-25">
            <div className="flex items-center space-x-5">
              <Logo />
            </div>
            <Navigation />
            <div className="flex items-center space-x-5">
              <UserMenu />
              <ContactMenu />
            </div>
          </div>
          <div className="flex justify-center items-center gap-5">
            <div className="hidden md:flex  items-center space-x-2">
              <CatalogButtons />
            </div>
            <Search />
          </div>
        </div>

        {/* Tablet Toolbar */}
        <div className="hidden sm:flex lg:hidden flex-col py-4 space-y-4">
          <div className="flex justify-between items-center w-full">
            <Logo />
            <Search />
            <button
              onClick={toggleDrawer(true)}
              className="text-teal-500 hover:text-teal-600"
              aria-label="menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Toolbar */}
        <div className="flex sm:hidden flex-col py-4 space-y-4">
          <div className="flex justify-between items-center w-full">
            <Logo />
            <button
              onClick={toggleDrawer(true)}
              className="text-teal-500 hover:text-teal-600"
              aria-label="menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
          <Search />
        </div>

        {/* Drawer for Mobile/Tablet */}
        {drawerOpen && (
          <div
            className="fixed inset-0  bg-opacity-50 z-50"
            onClick={toggleDrawer(false)}
          >
            <div
              className="fixed left-0 top-0 h-full bg-white w-64"
              onClick={(e) => e.stopPropagation()}
            >
              <BurgerMenu toggleDrawer={toggleDrawer} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
