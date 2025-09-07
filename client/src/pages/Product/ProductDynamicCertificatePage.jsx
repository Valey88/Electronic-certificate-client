import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import ProductBreadcrumbs from "../../components/ProductBreadcrumbs";
import ImageGallery from "../../components/ImageGallery";
import ImageZoomDialog from "../../components/ImageZoomDialog";
import RegionSelector from "../../components/RegionSelector";
import CharacteristicSelector from "../../components/CharacteristicSelector";
import PriceAndCartActions from "../../components/PriceAndCartActions";
import ProductTabs from "../../components/ProductTabs";
import useProductStore from "../../store/productStore";
import useBascketStore from "../../store/bascketStore";
import { urlPictures } from "../../configs/axiosConfig";

export default function ProductDynamicCertificatePage() {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [newRegion, setNewRegion] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedHeight, setSelectedHeight] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(0);

  const { id } = useParams();
  const { fetchProductById, products } = useProductStore();
  const { addProductThisBascket, fetchUserBasket } = useBascketStore();

  const isCatalog1 = products.data?.catalogs === 1;
  const isCatalog2 = products.data?.catalogs === 2;

  useEffect(() => {
    const loadProduct = async () => {
      await fetchProductById(id);
      if (products.data?.characteristic) {
        const sizes = products.data.characteristic
          .filter(
            (c) =>
              c.name.toLowerCase() === "размер" ||
              c.name.toLowerCase() === "объем/размер"
          )
          .flatMap((c) => c.value);
        setSelectedSize(sizes[0] || "");
        const colors = products.data.characteristic
          .filter((c) => c.name.toLowerCase() === "цвет")
          .flatMap((c) => c.value);
        setSelectedColor(colors[0] || "");
        const heights = products.data.characteristic
          .filter((c) => c.name.toLowerCase() === "рост")
          .flatMap((c) => c.value);
        setSelectedHeight(heights[0] || "");
      }
    };
    loadProduct();
  }, [id, fetchProductById]);

  useEffect(() => {
    if (products.data && products.data.images) {
      const fetchedImages = products.data.images.map(
        (image) => `${urlPictures}/${image.name}`
      );
      setImages(fetchedImages);
    }
  }, [products.data]);

  const handleAddProductToBasket = async (productId) => {
    const iso = isCatalog1 ? null : newRegion?.value;
    const dynamicOptions = [];
    if (
      products.data?.characteristic?.some(
        (c) =>
          c.name.toLowerCase() === "размер" ||
          c.name.toLowerCase() === "объем/размер"
      ) &&
      selectedSize
    ) {
      const sizeCharacteristic = products.data?.characteristic?.find(
        (c) =>
          c.name.toLowerCase() === "размер" ||
          c.name.toLowerCase() === "объем/размер"
      );
      dynamicOptions.push({
        id: sizeCharacteristic?.id || 0,
        value: selectedSize,
      });
    }
    if (
      products.data?.characteristic?.some(
        (c) => c.name.toLowerCase() === "цвет"
      ) &&
      selectedColor
    ) {
      const colorCharacteristic = products.data?.characteristic?.find(
        (c) => c.name.toLowerCase() === "цвет"
      );
      dynamicOptions.push({
        id: colorCharacteristic?.id || 0,
        value: selectedColor,
      });
    }
    if (
      products.data?.characteristic?.some(
        (c) => c.name.toLowerCase() === "рост"
      ) &&
      selectedHeight
    ) {
      const heightCharacteristic = products.data?.characteristic?.find(
        (c) => c.name.toLowerCase() === "рост"
      );
      dynamicOptions.push({
        id: heightCharacteristic?.id || 0,
        value: selectedHeight,
      });
    }
    await addProductThisBascket(
      productId,
      quantity,
      iso,
      dynamicOptions.length > 0 ? dynamicOptions : null
    );
    fetchUserBasket();
  };

  const handleImageClick = () => {
    setZoomedImageIndex(mainImageIndex);
    setZoomOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 mb-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{products.data ? products.data.name : "Загрузка..."}</title>
        <meta
          name="description"
          content={
            products.data ? products.data.description : "Описание товара"
          }
        />
      </Helmet>
      <ProductBreadcrumbs product={products.data} />
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-6">
        <ImageGallery
          images={images}
          mainImageIndex={mainImageIndex}
          setMainImageIndex={setMainImageIndex}
          onImageClick={handleImageClick}
        />
        <ImageZoomDialog
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
          images={images}
          zoomedImageIndex={zoomedImageIndex}
          setZoomedImageIndex={setZoomedImageIndex}
        />
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {products.data?.name}
          </h1>
          <p className="text-sm text-gray-500">
            Артикул: {products.data?.article}
          </p>
          {isCatalog2 && (
            <RegionSelector
              newRegion={newRegion}
              setNewRegion={setNewRegion}
              fetchProductById={fetchProductById}
              productId={id}
            />
          )}
          <CharacteristicSelector
            label="Выберите размер"
            characteristicName="размер"
            characteristics={products.data?.characteristic}
            selectedValue={selectedSize}
            setSelectedValue={setSelectedSize}
          />
          <CharacteristicSelector
            label="Выберите цвет"
            characteristicName="цвет"
            characteristics={products.data?.characteristic}
            selectedValue={selectedColor}
            setSelectedValue={setSelectedColor}
          />
          <CharacteristicSelector
            label="Выберите рост"
            characteristicName="рост"
            characteristics={products.data?.characteristic}
            selectedValue={selectedHeight}
            setSelectedValue={setSelectedHeight}
          />
          <PriceAndCartActions
            product={products.data}
            isCatalog1={isCatalog1}
            isCatalog2={isCatalog2}
            newRegion={newRegion}
            addProductToBasket={handleAddProductToBasket}
            quantity={quantity}
            setQuantity={setQuantity}
          />
          <ProductTabs
            product={products.data}
            tabValue={tabValue}
            setTabValue={setTabValue}
          />
        </div>
      </div>
    </div>
  );
}
