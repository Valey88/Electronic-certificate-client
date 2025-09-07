export default function CharacteristicSelector({
  label,
  characteristicName,
  characteristics,
  selectedValue,
  setSelectedValue,
}) {
  const values = characteristics
    ?.filter((c) => c.name.toLowerCase() === characteristicName.toLowerCase())
    .flatMap((c) => c.value);

  if (!values || values.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{label}:</h3>
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={label}
      >
        {values.map((value, index) => (
          <button
            key={index}
            onClick={() => setSelectedValue(value)}
            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedValue === value
                ? "bg-teal-500 text-white border-teal-500"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-teal-500"
            }`}
            role="radio"
            aria-checked={selectedValue === value}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedValue(value);
              }
            }}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
