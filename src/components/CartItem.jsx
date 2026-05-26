import { useCart } from "../hooks/useCart";
import { formatPrice, truncate } from "../utils/formatters";

export default function CartItem({ item }) {
  const { increase, decrease, remove } = useCart();

  return (
    <div className="flex gap-3 p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Product image */}
      <img
        src={item.image}
        alt={item.title}
        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg bg-gray-50 p-1.5 flex-shrink-0"
      />

      {/* Right side: info + controls */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Product info */}
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {truncate(item.title, 60)}
        </p>
        <p className="text-xs text-gray-400 capitalize">{item.category}</p>
        <p className="text-sm font-bold text-indigo-700">
          {formatPrice(item.price)}
        </p>

        {/* Controls row: qty | total + remove */}
        <div className="flex items-center justify-between gap-2 mt-1 flex-wrap">
          {/* Quantity stepper */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => decrease(item.id)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors"
              aria-label="Decrease"
            >
              −
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold bg-gray-50">
              {item.quantity}
            </span>
            <button
              onClick={() => increase(item.id)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors"
              aria-label="Increase"
            >
              +
            </button>
          </div>

          {/* Item subtotal + remove */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-gray-800">
              {formatPrice(item.price * item.quantity)}
            </p>
            <button
              onClick={() => remove(item.id)}
              className="text-xs text-red-400 hover:text-red-600 transition-colors whitespace-nowrap"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
