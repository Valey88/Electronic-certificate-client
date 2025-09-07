import Regions from "../configs/constants/regionsData/regions";

export default function RegionSelector({
  newRegion,
  setNewRegion,
  fetchProductById,
  productId,
}) {
  const handleChangeRegion = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "") {
      setNewRegion(null);
      fetchProductById(productId);
      return;
    }
    const selectedRegion = Regions.find(
      (region) => region.value === selectedValue
    );
    if (selectedRegion) {
      setNewRegion(selectedRegion);
      fetchProductById(productId, selectedRegion.value);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Выберите регион:
      </h3>
      <select
        value={newRegion?.value || ""}
        onChange={handleChangeRegion}
        className="min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:bg-gray-50 transition-all duration-200"
        aria-label="Выбор региона"
      >
        <option value="">Не выбран</option>
        {Regions.map((region) => (
          <option key={region.value} value={region.value}>
            {region.name}
          </option>
        ))}
      </select>
    </div>
  );
}
