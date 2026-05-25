# Product Requirements Document (PRD)

## eStore — Full-Stack E-Commerce Platform

**Version:** 1.0  
**Last Updated:** 2026-05-25  
**Status:** In Development  

---

## 1. Overview

eStore is a modern, full-stack e-commerce web application built with Next.js 16, React 19, and PostgreSQL (via Neon). It supports multiple product categories, guest and authenticated checkout, real-time order tracking, an AI shopping assistant, and a full admin dashboard for managing products and orders.

---

## 2. Goals & Objectives

| Goal | Description |
|------|-------------|
| **Seamless Shopping** | Allow users to browse, filter, and purchase products without friction |
| **Dual Authentication** | Support credential-based login and Google SSO |
| **Order Transparency** | Provide real-time order placement and status tracking |
| **Admin Control** | Give admins full CRUD control over products and orders |
| **AI-Assisted Discovery** | Offer an in-page AI assistant to help users find products |
| **Multi-Platform Deployment** | Deploy seamlessly on Vercel (primary) and Cloudflare Pages (secondary) |

---

## 3. User Personas

### 3.1 Guest Shopper
- Browses products without logging in
- Can add items to cart and check out as a guest (name + email + address)
- Receives order confirmation

### 3.2 Registered Customer
- Creates an account via email/password or Google SSO
- Views order history under `/orders`
- Manages cart across sessions

### 3.3 Admin
- Logs in with an admin-role account
- Accesses `/admin` dashboard
- Creates, edits, and deletes products
- Views and updates order statuses

---

## 4. Functional Requirements

### 4.1 Product Catalog

| ID | Requirement |
|----|-------------|
| P-01 | Products have: name, description, price, image URL, category, stock count |
| P-02 | Products are browsable via `/categories` page grouped by department |
| P-03 | Clicking a product navigates to `/shop/[id]` with full details |
| P-04 | Product detail page shows: image, description, price, specs sheet, and customer reviews |
| P-05 | Product detail page shows related products from the same category |
| P-06 | Category pages render products in a compact, synced grid layout |

**Supported Categories:**
- Electronics
- Clothing & Apparel
- Home & Kitchen
- Books & Stationery
- Sports & Outdoors
- Beauty & Personal Care

### 4.2 Shopping Cart

| ID | Requirement |
|----|-------------|
| C-01 | Cart state is managed client-side via React Context |
| C-02 | Cart drawer slides in from the right and displays all items |
| C-03 | Users can update item quantities and remove items |
| C-04 | Cart total is dynamically calculated and displayed |
| C-05 | Cart persists across page navigations within a session |

### 4.3 Checkout & Orders

| ID | Requirement |
|----|-------------|
| O-01 | Checkout collects: customer name, email, shipping address, ZIP code |
| O-02 | Guest checkout is supported (no login required) |
| O-03 | On submission, an Order record is created in the database |
| O-04 | Order status progresses through: `Placed → Processing → In Transit → Delivered` |
| O-05 | Registered users can view all their past orders at `/orders` |
| O-06 | Each order displays a list of ordered items with name, quantity, and price |

### 4.4 Authentication

| ID | Requirement |
|----|-------------|
| A-01 | Users can register with email + password |
| A-02 | Users can log in with email + password |
| A-03 | Google Single Sign-On is supported via OAuth2 popup |
| A-04 | Sessions are managed server-side with secure HTTP-only cookies |
| A-05 | Passwords are hashed before storage |
| A-06 | Role field on User distinguishes `customer` vs `admin` |
| A-07 | Admin routes are protected by middleware role check |

### 4.5 Admin Dashboard (`/admin`)

| ID | Requirement |
|----|-------------|
| AD-01 | Admin dashboard is accessible only to users with `role = "admin"` |
| AD-02 | Admins can create new products with all required fields |
| AD-03 | Admins can edit existing product details |
| AD-04 | Admins can delete products |
| AD-05 | Admins can view all orders and update their status |
| AD-06 | A script (`npm run create-admin`) bootstraps the first admin account |

### 4.6 AI Shopping Assistant

| ID | Requirement |
|----|-------------|
| AI-01 | A floating AI chat widget is accessible from all pages |
| AI-02 | The assistant answers product-related questions and shopping queries |
| AI-03 | The assistant can recommend products based on user input |
| AI-04 | The chat UI supports conversation history within a session |

### 4.7 Static Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage with hero, featured products, and category highlights |
| `/about` | About the store |
| `/contact` | Contact form / information |
| `/faq` | Frequently asked questions |
| `/help` | Help center |
| `/delivery` | Delivery information |
| `/shipping` | Shipping policies |
| `/new` | New arrivals |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- First Contentful Paint (FCP) < 2s on standard connection
- Static pages are pre-rendered at build time (SSG)
- Product data is fetched server-side for SEO and speed

### 5.2 Security
- All passwords hashed with bcrypt
- Admin routes protected by server-side middleware
- Environment variables used for all secrets (never committed)
- HTTPS enforced in production

### 5.3 Accessibility
- Semantic HTML5 elements used throughout
- Proper heading hierarchy (`h1` → `h2` → `h3`)
- All interactive elements have unique, descriptive IDs
- Color contrast meets WCAG AA standards

### 5.4 SEO
- Each page has a unique `<title>` and `<meta description>`
- Structured semantic markup
- Dynamic routes (`/shop/[id]`) generate product-specific metadata

### 5.5 Responsiveness
- Mobile-first layout with breakpoints at 640px, 768px, 1024px, 1280px
- Product grids adapt columns based on viewport width
- Navigation collapses into a hamburger menu on mobile

---

## 6. Technical Architecture

### 6.1 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.6 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4 |
| **Animation** | Framer Motion 12 |
| **Icons** | Lucide React |
| **ORM** | Prisma 5 (Client-side engine) |
| **Database** | PostgreSQL via Neon (serverless) |
| **Auth** | Custom JWT/session + Google OAuth2 |
| **AI** | Integrated AI chat (Gemini-compatible) |
| **Build** | Webpack (Turbopack disabled for stability) |

### 6.2 Deployment Targets

| Platform | Config File | Status |
|----------|------------|--------|
| **Vercel** (primary) | `vercel.json` | Active |
| **Cloudflare Pages** | `wrangler.jsonc`, `open-next.config.ts` | Secondary |
| **Render** | `render.yaml` | Fallback |

### 6.3 Database Models

```
Product     — id, name, description, price, image, category, stock, timestamps
User        — id, email, name, password, provider, role, timestamps
Order       — id, userId, customerName, customerEmail, shippingAddress, zipCode, totalAmount, status, timestamps
OrderItem   — id, orderId, productId, name, price, quantity, image
```

### 6.4 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/products` | List all products (supports category filter) |
| `POST` | `/api/products` | Create a product (admin only) |
| `GET` | `/api/products/[id]` | Get single product |
| `PUT` | `/api/products/[id]` | Update a product (admin only) |
| `DELETE` | `/api/products/[id]` | Delete a product (admin only) |
| `POST` | `/api/orders` | Place an order |
| `GET` | `/api/orders` | Get orders for logged-in user |
| `PUT` | `/api/orders/[id]` | Update order status (admin only) |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in with credentials |
| `GET` | `/api/auth/google` | Initiate Google OAuth2 flow |
| `POST` | `/api/chat` | Send a message to the AI assistant |
| `POST` | `/api/payments` | (Planned) Process payments |

---

## 7. Key User Flows

### 7.1 Guest Purchase Flow
```
Homepage → Browse Categories → View Product → Add to Cart → Checkout (guest) → Order Confirmed
```

### 7.2 Registered User Flow
```
Login/Register → Browse → Add to Cart → Checkout → View Order in /orders
```

### 7.3 Admin Flow
```
Admin Login → /admin Dashboard → Add/Edit/Delete Products → Manage Orders → Update Status
```

---

## 8. Out of Scope (v1.0)

- Payment gateway integration (Stripe/Razorpay) — placeholder exists
- Product search/filter bar
- Wishlist / saved items
- Product ratings submitted by users (currently static mock reviews)
- Email notifications for order updates
- Multi-vendor support
- Inventory management beyond stock count
- Internationalization (i18n) / multi-currency

---

## 9. Future Enhancements (v1.1+)

- [ ] Stripe payment integration
- [ ] User-submitted product reviews and star ratings
- [ ] Full-text product search
- [ ] Category & price-range filters
- [ ] Email transactional notifications (order placed, shipped)
- [ ] Wishlist / favorites
- [ ] Discount codes and promotions
- [ ] Analytics dashboard for admins
- [ ] PWA support (offline-capable)

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Build passes on Vercel | 100% of pushes to `main` |
| Page load time (FCP) | < 2 seconds |
| Mobile usability score | ≥ 90 (Lighthouse) |
| Checkout completion (no errors) | 100% of valid submissions |
| Admin CRUD success rate | 100% |

---

## 11. Project Structure

```
estore/
├── prisma/                  # Database schema & migrations
├── public/                  # Static assets
├── scripts/                 # Seed, admin creation, build utilities
├── src/
│   ├── app/                 # Next.js App Router pages & API routes
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # REST API handlers
│   │   ├── categories/      # Product category browser
│   │   ├── checkout/        # Checkout page
│   │   ├── orders/          # Order history (authenticated)
│   │   ├── shop/[id]/       # Dynamic product detail page
│   │   └── page.tsx         # Homepage
│   ├── components/          # Shared UI components
│   │   ├── AIAssistant.tsx  # Floating AI chat widget
│   │   ├── CartDrawer.tsx   # Slide-in cart
│   │   ├── Navbar.tsx       # Top navigation bar
│   │   ├── ProductCard.tsx  # Reusable product tile
│   │   └── ...
│   ├── context/             # React Context (cart, auth state)
│   └── lib/                 # Utilities (Prisma client, auth helpers)
├── next.config.ts
├── package.json
├── vercel.json
└── PRD.md                   # This document
```

---

*This document reflects the state of eStore as of v0.1.2. Update this file whenever major features are added, changed, or removed.*
