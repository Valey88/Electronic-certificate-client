export default function ImageGallery({
  images,
  mainImageIndex,
  setMainImageIndex,
  onImageClick,
}) {
  const handleNextImage = () => {
    setMainImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setMainImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="w-full md:w-1/2">
      <div className="relative flex justify-center">
        <img
          src={images[mainImageIndex]}
          alt={`Изображение продукта ${mainImageIndex + 1}`}
          className="w-full md:w-[400px] h-[300px] md:h-[400px] object-contain rounded-2xl shadow-md cursor-pointer hover:opacity-90 transition-opacity duration-200"
          onClick={onImageClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onImageClick();
            }
          }}
          aria-label="Увеличить изображение"
        />
        <button
          onClick={handlePrevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-2 hover:bg-white transition-all duration-200"
          aria-label="Предыдущее изображение"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-2 hover:bg-white transition-all duration-200"
          aria-label="Следующее изображение"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setMainImageIndex(index)}
            className={`w-16 h-16 rounded-lg overflow-hidden border cursor-pointer hover:border-teal-500 hover:scale-105 transition-all duration-200 ${
              mainImageIndex === index
                ? "border-teal-500 border-2"
                : "border-gray-300"
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setMainImageIndex(index);
              }
            }}
            aria-label={`Выбрать изображение ${index + 1}`}
          >
            <img
              src={image}
              alt={`Миниатюра ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
