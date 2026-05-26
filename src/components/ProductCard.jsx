import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useToast } from "../context/ToastContext";
import { formatPrice, truncate, capitalize } from "../utils/formatters";

export default function ProductCard({ product }) {
  const { add, isInCart } = useCart();
  const { show: showToast } = useToast();
  const navigate = useNavigate();
  const inCart = isInCart(product.id);

  const handleAdd = useCallback(
    (e) => {
      e.preventDefault();
      if (inCart) {
        navigate("/cart");
        return;
      }
      add(product);
      showToast("Added to cart!");
    },
    [add, product, showToast, inCart, navigate],
  );

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
    >
      {/* Image */}
      <div className="relative bg-gray-50 flex items-center justify-center h-40 sm:h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-32 sm:h-40 w-auto object-contain group-hover:scale-105 transition-transform duration-300 p-3 sm:p-4"
          loading="lazy"
        />
        {/* Category badge */}
        <span className="absolute top-2 left-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full max-w-[100px] truncate">
          {capitalize(product.category)}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-1.5">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {truncate(product.title, 70)}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs leading-none">
              {"★".repeat(Math.round(product.rating.rate))}
              {"☆".repeat(5 - Math.round(product.rating.rate))}
            </span>
            <span className="text-xs text-gray-400">
              ({product.rating.count})
            </span>
          </div>
        )}

        {/* Price + button — stacked to prevent overflow on narrow cards */}
        <div className="mt-auto pt-2 space-y-2">
          <span className="block text-sm sm:text-base font-bold text-indigo-700">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            className={`w-full py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
              inCart
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {inCart ? "✓ View Cart" : "+ Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
