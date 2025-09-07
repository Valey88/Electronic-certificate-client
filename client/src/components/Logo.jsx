import React from "react";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        navigate("/");
      }}
      className="w-32 sm:w-40 lg:w-48 cursor-pointer"
    >
      <img
        src="/logo.png"
        alt="logo"
        className="w-full h-auto"
        loading="lazy"
      />
    </div>
  );
};

export default Logo;
