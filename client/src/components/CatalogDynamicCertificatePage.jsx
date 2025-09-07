import React, { useEffect, useState, memo, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SidebarFilter from "./SidebarFilter";
import { FilterList, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import useBascketStore from "../store/bascketStore";
import useProductStore from "../store/productStore";
import { urlPictures } from "../configs/axiosConfig";

const ProductCard = memo(({ e, hendleAddProductThithBascket }) => {
  const isCatalog1 = e?.catalogs === 1;
  const navigate = useNavigate();

  return (
    <Link to={`/product/certificate/${e.id}`} className="block group ml-0 mr-0">
      <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col xs:w-200">
        {/* Preview Badge */}
        {e.preview && e.preview.trim() !== "" && (
          <span className="absolute top-0 left-0 bg-orange-500 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-br-lg shadow-sm max-w-[80%] truncate">
            {e.preview}
          </span>
        )}
        {/* Image */}
        <div className="flex justify-center items-center h-48 md:h-64 border-b border-gray-200">
          <img
            src={`${urlPictures}/${e.images[0].name}`}
            alt={e.name}
            className="w-full h-full object-contain p-4"
            loading="lazy"
          />
        </div>
        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-sm md:text-base font-semibold text-gray-800 ">
            {e.name}
          </h3>
          {/* Nameplate Badge */}
          {e.nameplate && e.nameplate.trim() !== "" && (
            <span className="inline-block bg-blue-500 text-white  text-xs md:text-[18px] font-bold px-2 py-1 rounded-lg mt-2 shadow-sm">
              {e.nameplate}
            </span>
          )}
          <div className="mt-auto">
            {isCatalog1 && (
              <p className="text-base md:text-lg font-bold text-teal-500 mb-2 mt-2">
                {e.price} ₽
              </p>
            )}
            <button
              onClick={(evt) => {
                evt.preventDefault();
                navigate(`/product/certificate/${e.id}`);
              }}
              className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200 text-sm md:text-base font-medium mt-4"
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default function CatalogDynamicCertificatePage() {
  const { id } = useParams();
  const { fetchProducts, products } = useProductStore();
  const { addProductThisBascket } = useBascketStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(null);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [ProductsPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const category_id = id;
  let catalogs = "1,2";

  useEffect(() => {
    const offset = (currentPage - 1) * ProductsPerPage;
    setLoading(true);
    fetchProducts(category_id, filters, offset, ProductsPerPage, catalogs)
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  }, [category_id, fetchProducts, filters, currentPage]);

  useEffect(() => {
    if (products?.data) {
      let normalizedProducts = Array.isArray(products.data)
        ? products.data
        : [products.data];

      let sortedProducts = [...normalizedProducts];
      if (sortOrder === "priceAsc") {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortOrder === "priceDesc") {
        sortedProducts.sort((a, b) => b.price - a.price);
      }

      setCurrentProducts(sortedProducts);
    } else {
      setCurrentProducts([]);
    }
  }, [products, sortOrder]);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const hendleAddProductThithBascket = useCallback(
    async (id) => {
      const product_id = id;
      await addProductThisBascket(product_id, 1);
    },
    [addProductThisBascket]
  );

  return (
    <div className="max-w-7xl mx-auto xs:px-1 md:px-4 py-6">
      {/* Filter and Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <SidebarFilter setFilters={setFilters} />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSortChange("default")}
            className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-200 ${
              sortOrder === "default"
                ? "bg-teal-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            По умолчанию
          </button>
          <button
            onClick={() => handleSortChange("priceDesc")}
            className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-200 flex items-center gap-1 ${
              sortOrder === "priceDesc"
                ? "bg-teal-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Цена <ArrowUpward className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSortChange("priceAsc")}
            className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-200 flex items-center gap-1 ${
              sortOrder === "priceAsc"
                ? "bg-teal-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Цена <ArrowDownward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-6">
        {loading ? (
          <p className="col-span-full text-center text-gray-600">Загрузка...</p>
        ) : error ? (
          <p className="col-span-full text-center text-red-600">
            Ошибка: {error}
          </p>
        ) : currentProducts.length > 0 ? (
          currentProducts.map((e) => (
            <ProductCard
              key={e.id}
              e={e}
              hendleAddProductThithBascket={hendleAddProductThithBascket}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            Нет данных для отображения
          </p>
        )}
      </div>

      {/* Pagination */}
      {currentProducts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm">
            {Array.from(
              { length: Math.ceil((products.count || 0) / ProductsPerPage) },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => handleChangePage(null, page)}
                className={`px-4 py-2 text-sm font-medium border border-gray-200 transition-colors duration-200 ${
                  currentPage === page
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } ${page === 1 ? "rounded-l-md" : ""} ${
                  page === Math.ceil((products.count || 0) / ProductsPerPage)
                    ? "rounded-r-md"
                    : ""
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
