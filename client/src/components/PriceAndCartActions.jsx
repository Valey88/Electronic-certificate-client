import { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function PriceAndCartActions({
  product,
  isCatalog1,
  isCatalog2,
  newRegion,
  addProductToBasket,
  quantity,
  setQuantity,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const MAX_QUANTITY = 999;

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= MAX_QUANTITY) {
      setQuantity(value);
    }
  };

  const handleIncrement = () => {
    if (quantity < MAX_QUANTITY) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const showAddToCartButton = isCatalog1
    ? product?.price !== undefined && product?.price !== null
    : newRegion &&
      product?.certificate_price !== undefined &&
      product?.certificate_price !== null;

  return (
    <>
      <div className="mb-4">
        {isCatalog1 && product?.price ? (
          <p className="text-2xl font-bold text-teal-600">{product.price} ₽</p>
        ) : isCatalog2 && newRegion && product?.certificate_price ? (
          <p className="text-2xl font-bold text-teal-600">
            {product.certificate_price} ₽
          </p>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              {isCatalog2
                ? "Пожалуйста, выберите регион для просмотра цены"
                : "Уточнить стоимость товара можно у менеджера"}
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 border border-teal-500 text-teal-500 rounded-lg hover:bg-teal-50 transition-colors duration-200"
              aria-label="Открыть чат поддержки"
            >
              Открыть чат поддержки
            </button>
            {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
          </>
        )}
      </div>
      {showAddToCartButton && (
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-teal-500 hover:text-white rounded-l-lg disabled:opacity-50 transition-colors duration-200"
              aria-label="Уменьшить количество"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={MAX_QUANTITY}
              className="w-12 text-center bg-gray-100 text-gray-900 font-medium py-2 border-none focus:outline-none"
              aria-label="Количество товара"
            />
            <button
              onClick={handleIncrement}
              disabled={quantity >= MAX_QUANTITY}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-teal-500 hover:text-white rounded-r-lg disabled:opacity-50 transition-colors duration-200"
              aria-label="Увеличить количество"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={() => addProductToBasket(product.id)}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Добавить в корзину"
          >
            Добавить в корзину
          </button>
        </div>
      )}
    </>
  );
}
