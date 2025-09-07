import React, { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import useSearchStore from "../store/serchStore";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const DEBOUNCE_DELAY = 250;

const Search = () => {
  const {
    searchQuery,
    searchSuggestions,
    setSearchQuery,
    setSearchSuggestions,
    searchProducts,
  } = useSearchStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const inputRef = useRef(null);
  const searchBoxRef = useRef(null);

  const handleSearchInput = (query) => {
    setSearchQuery(query ?? "");
    if (query.trim().length) {
      setIsLoading(true);
      setError(null);
      debouncedSearchProducts(query);
      setIsSuggestionsVisible(true);
    } else {
      setSearchSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  };

  const debouncedSearchProducts = useRef(
    debounce(async (query) => {
      try {
        const suggestions = await searchProducts(query);
        setSearchSuggestions(suggestions ?? []);
      } catch (error) {
        console.error("Ошибка при получении подсказок:", error);
        setError("Произошла ошибка при поиске. Пожалуйста, попробуйте снова.");
        setSearchSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY)
  ).current;

  const handleSuggestionClick = (suggestion) => {
    window.location.href = `/product/certificate/${suggestion.id}`;
    setIsSuggestionsVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setIsSuggestionsVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      debouncedSearchProducts.cancel();
    };
  }, [debouncedSearchProducts]);

  return (
    <div
      ref={searchBoxRef}
      className="flex items-center w-full max-w-lg relative"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Поиск по товарам"
        value={searchQuery}
        onChange={(e) => handleSearchInput(e.target.value)}
        onFocus={() => setIsSuggestionsVisible(true)}
        className="h-12 w-full border-2 border-purple-300 rounded-full pl-5 pr-12 text-base outline-none bg-white shadow-sm focus:border-purple-500 transition-all duration-200"
      />
      <button className="absolute right-0 h-12 w-12 flex items-center justify-center text-purple-600">
        <MagnifyingGlassIcon className="w-6 h-6" />
      </button>
      {isSuggestionsVisible && searchQuery && (
        <div className="absolute top-14 left-0 w-full bg-white border border-purple-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto transition-all duration-300">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <svg
                className="animate-spin h-6 w-6 text-purple-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            <span className="block p-4 text-red-600">{error}</span>
          ) : searchSuggestions.length > 0 ? (
            searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors"
              >
                <div>
                  <span className="block font-medium text-gray-800">
                    {suggestion.name}
                  </span>
                  {suggestion.description && (
                    <span className="block text-sm text-gray-500">
                      {suggestion.description}
                    </span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <span className="block p-4 text-gray-500">Ничего не найдено</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
