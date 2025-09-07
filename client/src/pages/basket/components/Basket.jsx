import React, { useEffect, useState } from "react";
import { DeleteOutline } from "@mui/icons-material";
import useBascketStore from "../../../store/bascketStore";
import { urlPictures } from "../../../configs/axiosConfig";


export default function Basket() {
  const {
    fetchUserBasket,
    basket,
    deleteProductThithBasket,
    editCountProductBascket,
  } = useBascketStore();

  const [currentProducts, setCurrentProducts] = useState([]);

  useEffect(() => {
    fetchUserBasket();
  }, []);

  useEffect(() => {
    if (basket.data?.items) {
      let normalizedProducts = Array.isArray(basket.data.items)
        ? basket.data.items
        : [basket.data.items];
      setCurrentProducts(normalizedProducts);
    }
  }, [basket]);

  const handleDeleteProductBasket = async (id) => {
    await deleteProductThithBasket(id);
    setCurrentProducts(currentProducts.filter((product) => product.id !== id));
    fetchUserBasket();
  };

  const handleClick = async (product_id, action, iso) => {
    try {
      await editCountProductBascket(
        product_id,
        action === "plus" ? 1 : -1,
        iso
      );
      setCurrentProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.product_id === product_id
            ? {
                ...product,
                quantity:
                  action === "plus"
                    ? product.quantity + 1
                    : Math.max(product.quantity - 1, 1),
              }
            : product
        )
      );
      await fetchUserBasket();
    } catch (error) {
      console.error("Ошибка при изменении количества товара:", error);
    }
  };

  const handleQuantityChange = (product_id, value) => {
    setCurrentProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === product_id
          ? { ...product, quantity: value }
          : product
      )
    );
  };

  const handleQuantityBlur = async (product_id, iso) => {
    const currentProduct = currentProducts.find(
      (p) => p.product_id === product_id
    );
    if (currentProduct) {
      let newQuantity = parseInt(currentProduct.quantity, 10);
      if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
        setCurrentProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.product_id === product_id ? { ...p, quantity: 1 } : p
          )
        );
      } else {
        setCurrentProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.product_id === product_id ? { ...p, quantity: newQuantity } : p
          )
        );
      }

      const originalProduct = basket.data.items.find(
        (p) => p.product_id === product_id
      );
      if (originalProduct) {
        const difference = newQuantity - originalProduct.quantity;
        if (difference !== 0) {
          try {
            await editCountProductBascket(product_id, difference, iso);
            await fetchUserBasket();
          } catch (error) {
            console.error("Ошибка при обновлении количества:", error);
          }
        }
      }
    }
  };

  return (
    <div className="w-full lg:w-3/4 mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Корзина
      </h2>
      <div className="space-y-4">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product.product_id}
              className="flex flex-col md:flex-row bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={`${urlPictures}/${product.image}`}
                alt={product.title}
                className="w-full md:w-32 h-32 object-contain rounded-md mb-4 md:mb-0"
              />
              <div className="flex-grow md:pl-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
                <p className="text-lg font-medium text-teal-500 mt-1">
                  {product.total_price} ₽
                </p>
                <div className="flex items-center mt-3 gap-2">
                  <button
                    onClick={() =>
                      handleClick(product.product_id, "minus", product.iso)
                    }
                    disabled={product.quantity <= 1}
                    className="w-10 h-10 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={product.quantity}
                    onChange={(e) =>
                      handleQuantityChange(product.product_id, e.target.value)
                    }
                    onBlur={() =>
                      handleQuantityBlur(product.product_id, product.iso)
                    }
                    className="w-16 text-center border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={() =>
                      handleClick(product.product_id, "plus", product.iso)
                    }
                    className="w-10 h-10 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleDeleteProductBasket(product.id)}
                    className="ml-auto text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <DeleteOutline />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-600">Ваша корзина пуста</p>
        )}
      </div>
    </div>
  );
}
