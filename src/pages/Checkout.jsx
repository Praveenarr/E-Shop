import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { formatPrice, truncate } from "../utils/formatters";

export default function Checkout() {
  const {
    items,
    summary,
    coupon,
    applyCode,
    removeCode,
    increase,
    decrease,
    clear,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ordered, setOrdered] = useState(false);

  const { subtotal, discount, tax, total } = useMemo(() => summary, [summary]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      address: "",
      city: "",
      pincode: "",
      phone: "",
    },
  });

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    applyCode(couponInput);
    setCouponInput("");
  };

  const onSubmit = () => {
    setOrdered(true);
    clear();
  };

  if (items.length === 0 && !ordered) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-500">Your cart is empty.</p>
        <button
          onClick={() => navigate("/")}
          className="text-indigo-600 hover:underline"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  if (ordered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-5">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed!
          </h2>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Thank you for shopping with Starlfinx . Your order is confirmed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          Checkout
        </h1>

        {/*
          Mobile: summary on top (order-first), form below.
          Desktop (lg): form left (3 cols), summary right (2 cols).
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Order summary — first on mobile, right column on desktop */}
          <div className="order-first lg:order-last lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <h2 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">
                Order Summary
              </h2>

              {/* Item list with qty controls */}
              <div className="space-y-3 max-h-56 sm:max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg bg-gray-50 p-1 flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug">
                        {truncate(item.title, 45)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatPrice(item.price)} each
                      </p>
                      {/* Qty stepper */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <button
                          onClick={() => decrease(item.id)}
                          className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 text-gray-600 text-sm font-bold transition-colors"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increase(item.id)}
                          className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 text-gray-600 text-sm font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 flex-shrink-0 pt-0.5">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon section */}
              <div className="border-t border-gray-100 mt-4 pt-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Coupon Code
                </p>
                {coupon.code ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <div>
                      <span className="text-green-700 font-semibold text-xs">
                        {coupon.code}
                      </span>
                      <p className="text-green-600 text-xs">
                        {coupon.data?.label} applied!
                      </p>
                    </div>
                    <button
                      onClick={removeCode}
                      className="text-red-400 hover:text-red-600 text-xs font-medium ml-2 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                      placeholder="Enter code…"
                      className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors flex-shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {coupon.error && (
                  <p className="text-red-500 text-xs mt-1.5">{coupon.error}</p>
                )}
                {!coupon.code && !coupon.error && (
                  <p className="text-gray-400 text-xs mt-1.5">
                    Try: SAVE10 · FLAT200 · FIRST20 · SUMMER15
                  </p>
                )}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({coupon.code})</span>
                    <span>− {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Payable</span>
                  <span className="text-indigo-700">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Place order button — visible in summary on mobile */}
            <button
              form="checkout-form"
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg active:scale-95 text-sm"
            >
              Place Order — {formatPrice(total)}
            </button>
          </div>

          {/* Delivery form — below summary on mobile, left on desktop */}
          <div className="order-last lg:order-first lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="font-semibold text-gray-800 mb-4 sm:mb-5 text-base sm:text-lg">
                Delivery Details
              </h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                id="checkout-form"
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Full Name
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Invalid email",
                        },
                      })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Address
                  </label>
                  <input
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Street address…"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      City
                    </label>
                    <input
                      {...register("city", { required: "City is required" })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Pincode
                    </label>
                    <input
                      {...register("pincode", {
                        required: "Pincode is required",
                        pattern: {
                          value: /^\d{6}$/,
                          message: "6-digit pincode",
                        },
                      })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="6 digits"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pincode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <input
                    {...register("phone", {
                      required: "Phone is required",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Enter valid 10-digit phone number",
                      },
                    })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
