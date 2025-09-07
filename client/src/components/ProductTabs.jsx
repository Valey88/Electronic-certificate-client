import { memo } from "react";

const TabPanel = memo(({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    className="mt-4"
  >
    {value === index && <div>{children}</div>}
  </div>
));

export default function ProductTabs({ product, tabValue, setTabValue }) {
  const renderFeatureValue = (value) => {
    if (value === "true") return "Есть";
    if (value === "false") return "Нет";
    if (!value) return "Нет данных";
    return value;
  };

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setTabValue(0)}
            className={`${
              tabValue === 0
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            id="tab-0"
            aria-controls="tabpanel-0"
          >
            Описание
          </button>
          <button
            onClick={() => setTabValue(1)}
            className={`${
              tabValue === 1
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            id="tab-1"
            aria-controls="tabpanel-1"
          >
            Характеристики
          </button>
        </nav>
      </div>
      <TabPanel value={tabValue} index={0}>
        <div className="mt-4 text-gray-700 prose prose-sm max-w-none">
          {product?.description ? (
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
              className="break-words whitespace-normal leading-relaxed"
            />
          ) : (
            <p>Описание отсутствует</p>
          )}
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <ul className="divide-y divide-gray-200">
            {product?.characteristic
              ?.filter(
                (c) =>
                  c.name.toLowerCase() !== "размер" &&
                  c.name.toLowerCase() !== "объем/размер" &&
                  c.name.toLowerCase() !== "цвет" &&
                  c.name.toLowerCase() !== "рост"
              )
              .map((feature, index) => (
                <li
                  key={index}
                  className="py-3 px-4 hover:bg-gray-100 rounded-md transition-colors duration-150"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 text-sm">
                      {feature.name}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {renderFeatureValue(feature.value)}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </TabPanel>
    </div>
  );
}
