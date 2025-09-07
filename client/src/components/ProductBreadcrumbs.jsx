import { Link as RouterLink } from "react-router-dom";

export default function ProductBreadcrumbs({ product }) {
  const category = product?.categories?.[0];
  const categoryLink = category
    ? `/products/certificate/${category.id}`
    : "/catalog/certificate";
  const categoryName = category ? category.name : "Каталог";

  return (
    <nav className="mb-6 text-sm" aria-label="breadcrumb">
      <ol className="flex space-x-2">
        <li>
          <RouterLink
            to="/"
            className="text-teal-600 hover:text-teal-700 transition-colors duration-200"
          >
            Главная
          </RouterLink>
        </li>
        <li className="text-gray-400">/</li>
        <li>
          <RouterLink
            to="/catalog/certificate"
            className="text-teal-600 hover:text-teal-700 transition-colors duration-200"
          >
            Каталог
          </RouterLink>
        </li>
        <li className="text-gray-400">/</li>
        <li>
          <RouterLink
            to={categoryLink}
            className="text-teal-600 hover:text-teal-700 transition-colors duration-200"
          >
            {categoryName}
          </RouterLink>
        </li>
        <li className="text-gray-400">/</li>
        <li className="text-gray-900 truncate max-w-xs">
          {product?.name || "Товар"}
        </li>
      </ol>
    </nav>
  );
}
