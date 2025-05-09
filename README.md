# ShopUpUK E-commerce Backend

A modular, scalable Node.js backend for an e-commerce platform, built with Express.js and MongoDB.

## Features

- **User Authentication & Authorization** (JWT, roles)
- **Product Management** (CRUD, variants, inventory)
- **Order Management** (status, timeline, address handling)
- **Payment Integration** (Stripe, webhooks, refunds)
- **Admin Tools** (user/product/order management)
- **Validation & Error Handling** (Joi, centralized error middleware)
- **Security** (Helmet, XSS, rate limiting, input sanitization)
- **API Documentation** (Swagger/OpenAPI)
- **Utilities** (CSV export, async error handling)

## Project Structure
src/
├── app.js # Express app setup, middleware, webhook handling
├── index.js # App entry point, DB connection, server start
├── config/ # App config, logger, passport, roles, etc.
├── controllers/ # Route controllers (auth, user, product, order, payment, admin)
├── docs/ # Swagger/OpenAPI docs
├── middlewares/ # Auth, error, validation, rate limiting, etc.
├── models/ # Mongoose models (user, product, order, token)
├── routes/ # Express routers (v1 API, modularized)
├── services/ # Business logic (auth, user, product, order, payment, email)
├── utils/ # Helpers (async error, CSV export, etc.)
└── validations/ # Joi schemas for request validation



## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Stripe account (for payment integration)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd shopupUk_back
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in your values (MongoDB URI, JWT secret, Stripe keys, etc.)

4. Start the server:
   ```bash
   npm start
   ```

### API Documentation

- Swagger UI is available at `/v1/docs` in development mode.
- OpenAPI spec is defined in `src/docs/`.

### Scripts

- `npm start` — Start the server
- `npm run dev` — Start in development mode (with nodemon)
- `npm test` — Run tests (if available)

### Folder Details

- **controllers/**: Handle HTTP requests and responses.
- **services/**: Business logic, database operations.
- **models/**: Mongoose schemas for MongoDB collections.
- **routes/**: API endpoints, grouped by resource.
- **middlewares/**: Authentication, error handling, validation, etc.
- **validations/**: Joi schemas for validating request bodies.
- **utils/**: Helper functions (e.g., async error wrapper, CSV export).
- **config/**: Configuration files (env, logger, passport, etc.).
- **docs/**: OpenAPI/Swagger documentation.

### Security

- Uses Helmet for HTTP headers, XSS-clean, and mongo-sanitize for input.
- Rate limiting on auth endpoints in production.
- JWT authentication for protected routes.

### Payments

- Stripe integration for payments and webhooks.
- Webhook endpoint: `/v1/payments/webhook`

### License

MIT

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Contact

For questions, contact [dharmiegra4@gmail.com].
