export default function ImageZoomDialog({
  open,
  onClose,
  images,
  zoomedImageIndex,
  setZoomedImageIndex,
}) {
  const handleNextImage = () => {
    setZoomedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setZoomedImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden">
        <img
          src={images[zoomedImageIndex]}
          alt={`Увеличенное изображение ${zoomedImageIndex + 1}`}
          className="max-w-full max-h-[80vh] object-contain"
        />
        <button
          onClick={handlePrevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 rounded-full p-2 hover:bg-white transition-all duration-200"
          aria-label="Предыдущее увеличенное изображение"
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
          aria-label="Следующее увеличенное изображение"
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 hover:bg-white transition-all duration-200"
          aria-label="Закрыть увеличенное изображение"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
