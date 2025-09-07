import React from "react";
import { Link } from "react-router-dom";

const CatalogButtons = () => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link
        to="/catalog/certificate"
        className="bg-gradient-to-r from-purple-300 to-purple-500 text-white font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg hover:from-purple-400 hover:to-purple-600 transition-all duration-200"
      >
        Каталог
      </Link>
    </div>
  );
};

export default CatalogButtons;
