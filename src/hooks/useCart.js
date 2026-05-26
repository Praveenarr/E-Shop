import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectCartSummary,
  selectCoupon,
} from "../redux/cartSlice";

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const summary = useSelector(selectCartSummary);
  const coupon = useSelector(selectCoupon);

  const add = useCallback(
    (product) => dispatch(addToCart(product)),
    [dispatch],
  );
  const remove = useCallback((id) => dispatch(removeFromCart(id)), [dispatch]);
  const increase = useCallback(
    (id) => dispatch(increaseQuantity(id)),
    [dispatch],
  );
  const decrease = useCallback(
    (id) => dispatch(decreaseQuantity(id)),
    [dispatch],
  );
  const applyCode = useCallback(
    (code) => dispatch(applyCoupon(code)),
    [dispatch],
  );
  const removeCode = useCallback(() => dispatch(removeCoupon()), [dispatch]);
  const clear = useCallback(() => dispatch(clearCart()), [dispatch]);

  const isInCart = useCallback((id) => items.some((i) => i.id === id), [items]);

  return {
    items,
    count,
    summary,
    coupon,
    add,
    remove,
    increase,
    decrease,
    applyCode,
    removeCode,
    clear,
    isInCart,
  };
}
