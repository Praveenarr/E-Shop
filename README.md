# Starflinx

A full-featured e-commerce single-page application built with React, Redux Toolkit, and Tailwind CSS.

## Tech Stack

| Layer | Library / Tool |
|---|---|
| UI | React 18, Tailwind CSS v3 |
| State | Redux Toolkit (`createSlice`, `createAsyncThunk`, `createSelector`) |
| Routing | React Router v6 |
| Forms | React Hook Form |
| HTTP | Axios (with JWT interceptor) |
| Build | Vite 6 |
| Data | [FakeStore API](https://fakestoreapi.com) |

## Features

- **Product browsing** — list all products, filter by category, search by name, sort by price
- **Product detail** — image, description, rating, quantity selector, add to cart
- **Shopping cart** — add / remove items, adjust quantities, coupon codes, GST calculation
- **Checkout** — order summary with quantity controls, coupon application, and live total updates
- **Authentication** — sign up, login, JWT-based session with auto-expiry
- **Per-user cart** — each user's cart is persisted to `localStorage` and restored on login; guest cart items are merged on login
- **Admin panel** — add, edit, and delete products (role-restricted)
- **Toast notifications** — feedback for cart actions, coupon validation, etc.
- **Responsive design** — mobile-first with a hamburger menu

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components (Navbar, ProductCard, CartItem, …)
├── context/          # ToastContext
├── hooks/            # useAuth, useCart
├── pages/            # Route-level components (Home, Cart, Checkout, Login, …)
├── redux/            # authSlice, cartSlice, productSlice, store
├── routes/           # AppRoutes (ProtectedRoute, AdminRoute)
├── services/         # api.js (Axios instance), authService, productService
└── utils/            # formatters
```

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@gmail.com | admin123 |
| User | register via Sign Up | — |

> Admin users can access **Manage Products** to add, edit, and delete products.

## Coupon Codes

| Code | Discount | Minimum Cart | Applies To |
|---|---|---|---|
| `SAVE10` | 10% off | ₹500 | All categories |
| `FLAT200` | ₹200 flat off | ₹1000 | Electronics only |
| `FIRST20` | 20% off | No minimum | All categories |
| `SUMMER15` | 15% off | ₹300 | Clothing only |

## License

Private — all rights reserved.
