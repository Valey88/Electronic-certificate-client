import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFilterStore from "../store/filterStore";
import useProductStore from "../store/productStore";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SidebarFilter = ({ setFilters }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [article, setArticle] = useState("");
  const [openAccordions, setOpenAccordions] = useState({});
  const { fetchFilter, filters, loading } = useFilterStore();
  const { fetchProducts } = useProductStore();
  const [selectedValues, setSelectedValues] = useState([]);
  const { id } = useParams();
  const category_id = id;

  useEffect(() => {
    fetchFilter(category_id);
  }, [category_id]);

  useEffect(() => {
    if (drawerOpen && filters?.data?.characteristics) {
      const initialCharacteristics = filters.data.characteristics.map(
        (filter) => ({
          characteristic_id: filter.id,
          values: [],
        })
      );
      setSelectedValues(initialCharacteristics);
      setOpenAccordions({});
    }
  }, [drawerOpen, filters]);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleChangeCheckbox = (characteristicId, value) => {
    const updatedSelectedValues = [...selectedValues];
    const index = updatedSelectedValues.findIndex(
      (item) => item.characteristic_id === characteristicId
    );
    if (index !== -1) {
      const currentCharacteristic = updatedSelectedValues[index];
      if (currentCharacteristic.values.includes(value)) {
        currentCharacteristic.values = currentCharacteristic.values.filter(
          (v) => v !== value
        );
      } else {
        currentCharacteristic.values = [value];
      }
      setSelectedValues(updatedSelectedValues);
    }
  };

  const handleApplyFilters = async () => {
    const filterData = {
      price: {
        min: minPrice ? Number(minPrice) : 0,
        max: maxPrice ? Number(maxPrice) : 0,
      },
      characteristics: selectedValues
        .filter((characteristic) => characteristic.values.length > 0)
        .map((characteristic) => ({
          characteristic_id: characteristic.characteristic_id,
          values: characteristic.values.map((value) => value.toString()),
        })),
      article: article || undefined,
    };
    const queryParams = new URLSearchParams();
    if (article) queryParams.append("article", article);
    await fetchProducts(
      category_id,
      JSON.stringify(filterData),
      queryParams.toString()
    );
    toggleDrawer();
  };

  const handleResetFilters = () => {
    setSelectedValues(
      filters.data.characteristics.map((filter) => ({
        characteristic_id: filter.id,
        values: [],
      }))
    );
    setMinPrice("");
    setMaxPrice("");
    setArticle("");
    fetchProducts(category_id, null);
    toggleDrawer();
  };

  return (
    <div className="flex">
      <button
        className="flex items-center gap-2 rounded-xl border border-[#00B3A4] bg-[#00B3A405] px-4 py-2 text-[#00B3A4] font-medium hover:bg-[#00B3A41A] transition-all duration-300"
        onClick={toggleDrawer}
      >
        <FilterListIcon />
        Фильтры
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[85%] sm:w-[400px] md:w-[450px] bg-white shadow-2xl transform ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 h-full flex flex-col`}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#00B3A4]">Фильтры</h2>
          <button onClick={toggleDrawer}>
            <CloseIcon className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-[#00B3A4] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-4">Цена</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="number"
                    placeholder="От"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="flex-1 rounded-lg bg-gray-50 border border-[#26BDB8] p-3 text-gray-700 focus:border-[#00B3A4] focus:outline-none w-[50%]"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="flex-1 rounded-lg bg-gray-50 border border-[#26BDB8] p-3 text-gray-700 focus:border-[#00B3A4] focus:outline-none w-[50%]"
                    min="0"
                  />
                </div>
                <h3 className="font-medium text-lg mb-4">Поиск по артиклу</h3>
                <input
                  type="text"
                  placeholder="Артикул"
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  className="w-full rounded-lg bg-gray-50 border border-[#26BDB8] p-3 text-gray-700 focus:border-[#00B3A4] focus:outline-none"
                />
              </div>

              {filters?.data?.characteristics?.length > 0 ? (
                filters.data.characteristics.map((char) => (
                  <div key={char.id} className="mb-2">
                    <button
                      className="w-full flex justify-between items-center bg-gray-50 rounded-lg p-4 hover:bg-[#00B3A405] transition-all duration-200"
                      onClick={() => toggleAccordion(char.id)}
                    >
                      <span className="font-medium text-gray-800">
                        {char.name}
                      </span>
                      <ExpandMoreIcon
                        className={`text-[#00B3A4] transition-transform duration-300 ${
                          openAccordions[char.id] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`bg-white py-4 overflow-hidden transition-all duration-300 ease-in-out ${
                        openAccordions[char.id]
                          ? "max-h-[200px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto p-2">
                        {char.values.map((value, index) => (
                          <label
                            key={`${char.id}-${value}`}
                            className={`flex items-center gap-2 p-2 hover:bg-[#00B3A405] transition-all duration-300 ${
                              index < char.values.length - 1
                                ? "border-b border-gray-100"
                                : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedValues.some(
                                (c) =>
                                  c.characteristic_id === char.id &&
                                  c.values.includes(value)
                              )}
                              onChange={() =>
                                handleChangeCheckbox(char.id, value)
                              }
                              className="w-5 h-5 text-[#00B3A4] border-[#26BDB8] rounded focus:ring-[#00B3A41A]"
                            />
                            <span className="text-gray-800 text-sm">
                              {typeof value === "boolean"
                                ? value
                                  ? "Есть"
                                  : "Нету"
                                : value}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 py-4">Нет доступных фильтров</p>
              )}
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-white shadow-md flex justify-end gap-4">
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="bg-[#00B3A4] text-white rounded-lg px-6 py-3 font-medium hover:bg-[#26BDB8] transition-all duration-200 disabled:bg-gray-400"
          >
            Применить
          </button>
          <button
            onClick={handleResetFilters}
            disabled={loading}
            className="border border-[#E74C3C] text-[#E74C3C] rounded-lg px-6 py-3 font-medium hover:bg-[#E74C3C0D] transition-all duration-200 disabled:border-gray-400 disabled:text-gray-400"
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
