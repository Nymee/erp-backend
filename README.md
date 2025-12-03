# ERP Backend System

A comprehensive Enterprise Resource Planning (ERP) backend system built with Node.js, Express, and MongoDB. This system provides multi-tenant support with role-based access control for managing companies, products, sales, inventory, clients, and suppliers.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Endpoints](#endpoints)
- [Database Models](#database-models)
- [User Roles](#user-roles)
- [Architecture](#architecture)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Multi-tenant Architecture**: Support for multiple companies with data isolation
- **User Management**: Role-based access control with four distinct roles (ADMIN, SAU, SE, MG)
- **Company Registration & Approval**: Automated workflow for company onboarding
- **Product Management**: Comprehensive product catalog with complex pricing calculations
  - Cost price, retail margins, min/max margin validation
  - Discounts (percentage or flat rupee)
  - GST and CESS tax calculations
  - Automatic sales price computation
- **Sales Order Management**:
  - Order and estimation tracking
  - Product price refresh mechanism (7-day expiry)
  - Stock availability checking
  - Multi-level discounts (product-level and order-level)
- **Inventory Management**:
  - Dual tracking system (transactions + current stock)
  - Automatic stock aggregation
  - Supplier integration
- **Client & Supplier Management**: Complete CRM functionality
- **Invoice System**: Payment tracking and order fulfillment
- **Branch Management**: Support for multiple branch locations per company

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi schema validation
- **Password Hashing**: bcrypt
- **Email Service**: Nodemailer
- **Development**: Nodemon

## Project Structure

```
erp-backend/
├── config/                  # Configuration files
│   └── database.js         # MongoDB connection setup
├── controllers/            # Request handlers (8 modules)
│   ├── auth-controller.js
│   ├── client-controller.js
│   ├── company-controller.js
│   ├── inventory-controller.js
│   ├── product-controller.js
│   ├── sales-controller.js
│   ├── supplier-controller.js
│   └── user-controller.js
├── middlewares/            # Express middleware
│   ├── authenticate-user.js
│   ├── authorize-role.js
│   ├── error-handler.js
│   ├── validator.js
│   └── verify-user.js
├── models/                 # Mongoose schemas (10 models)
│   ├── Branch.js
│   ├── Client.js
│   ├── Company.js
│   ├── Inventory.js
│   ├── InventoryProduct.js
│   ├── Invoice.js
│   ├── Product.js
│   ├── Sales.js
│   ├── Supplier.js
│   └── User.js
├── routes/                 # API route definitions
│   ├── auth-routes.js
│   ├── client-routes.js
│   ├── company-routes.js
│   ├── inventory-routes.js
│   ├── product-routes.js
│   ├── sales-routes.js
│   ├── supplier-routes.js
│   └── user-routes.js
├── services/               # Business logic layer
│   ├── client-service.js
│   ├── inventory-service.js
│   ├── product-service.js
│   ├── product-validation.service.js
│   ├── sales-create-edit.service.js
│   ├── sales-product-diffing.service.js
│   ├── sales-service.js
│   └── supplier-service.js
├── validators/             # Joi validation schemas
│   ├── client.validator.js
│   ├── company.validator.js
│   ├── dispatch-products.validator.js
│   ├── inventory.validator.js
│   ├── product.validator.js
│   ├── sales-order.validator.js
│   ├── supplier.validator.js
│   └── user.validator.js
├── utils/                  # Utility functions
│   ├── errors/            # Custom error classes
│   ├── email-service.js
│   ├── filter-builder.js
│   ├── generate-JWT.js
│   └── object-validator.js
├── seeds/                  # Database seeding scripts
│   └── createAdmin.js
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── server.js              # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd erp-backend-Development
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Seed the database with an admin user (optional):
```bash
node seeds/createAdmin.js
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000

# Database
MONGO_URI=your_mongodb_connection_string
DB_NAME=ERP

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

**Important**: Never commit the `.env` file to version control. Make sure it's listed in `.gitignore`.

### Running the Application

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Documentation

### Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained by logging in through the `/api/auth/login` endpoint.

### Endpoints

#### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/sign-up` | Register a new company | Public |
| POST | `/login` | User login | Public |

#### Companies (`/api/company`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all companies | ADMIN |
| PUT | `/status_update/:id` | Approve/reject company | ADMIN |

#### Users (`/api/user`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all users | Authenticated |
| POST | `/` | Create new user | SAU |
| GET | `/:user_id` | Get user details | Authenticated |
| PATCH | `/:user_id` | Update user | Authenticated |

#### Products (`/api/product`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List products (paginated) | Authenticated |
| POST | `/` | Create product | Authenticated |
| GET | `/:product_id` | Get product details | Authenticated |
| PATCH | `/:product_id` | Update product | Authenticated |
| DELETE | `/:product_id` | Delete product | Authenticated |

**Query Parameters**: `page`, `limit`, `search`, `order`, `orderBy`

#### Sales (`/api/sales`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List sales orders/estimations | Authenticated |
| GET | `/product` | List products for sales | Authenticated |
| POST | `/` | Create sales order | Authenticated |
| GET | `/:sales_id` | Get sales order details | Authenticated |
| PUT | `/:sales_id` | Update sales estimation | Authenticated |
| POST | `/dispatch` | Dispatch products | Authenticated |

**Query Parameters**: `page`, `limit`, `search`, `type` (order/estimation)

#### Clients (`/api/client`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List clients | Authenticated |
| POST | `/` | Create client | SAU |
| GET | `/:client_id` | Get client details | Authenticated |
| PATCH | `/:client_id` | Update client | Authenticated |

#### Suppliers (`/api/supplier`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List suppliers | Authenticated |
| POST | `/` | Create supplier | SAU |
| GET | `/:supplier_id` | Get supplier details | Authenticated |
| PATCH | `/:supplier_id` | Update supplier | Authenticated |

#### Inventory (`/api/inventory`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List inventory transactions | Authenticated |
| POST | `/` | Create inventory entry | SAU |
| GET | `/products` | List inventory stock levels | Authenticated |
| GET | `/products/:id` | Get product stock details | Authenticated |
| GET | `/:inventory_id` | Get transaction details | Authenticated |

## Database Models

### Core Entities

1. **User**: User accounts with roles and company/branch associations
2. **Company**: Company registration with approval workflow
3. **Branch**: Branch locations for companies
4. **Product**: Product catalog with pricing and tax information
5. **Client**: Customer information
6. **Supplier**: Supplier details
7. **Sales**: Sales orders and estimations with product details
8. **Inventory**: Inventory transaction history
9. **InventoryProduct**: Current stock levels per product
10. **Invoice**: Invoice and payment tracking

### Relationships

- Users belong to Companies and Branches
- Products belong to Companies
- Sales orders reference Clients and contain Products
- Inventory entries reference Products and Suppliers
- Invoices link to Sales orders

## User Roles

| Role | Code | Permissions |
|------|------|-------------|
| **Admin** | ADMIN | System-wide company management and approval |
| **Super Admin User** | SAU | Company-level admin: create users, clients, suppliers, inventory |
| **Sales Executive** | SE | Sales operations and client management |
| **Manager** | MG | Branch-level management |

## Architecture

This application follows a **layered architecture pattern**:

```
Routes → Controllers → Services → Models → Database
         ↓
    Middleware (Auth, Validation, Error Handling)
```

### Key Design Patterns

- **MVC Pattern**: Separation of routes, controllers, and models
- **Service Layer**: Complex business logic extracted to reusable services
- **Middleware Chain**: Authentication → Authorization → Validation → Controller
- **Multi-tenancy**: Company-scoped data isolation
- **Repository Pattern**: Services act as data access layer

## Security

- **Authentication**: JWT tokens with 1-day expiration
- **Password Security**: bcrypt hashing with salt rounds
- **Authorization**: Role-based access control middleware
- **Input Validation**: Joi schema validation for all inputs
- **CORS**: Configured for specific origins
- **Error Handling**: Centralized error handler preventing information leakage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow existing code structure and naming conventions
- Use meaningful variable and function names
- Add Joi validation schemas for new endpoints
- Place business logic in services, not controllers
- Maintain multi-tenant data isolation

## License

This project is licensed under the ISC License.

---

## Roadmap

- [ ] Add comprehensive test coverage (unit, integration, e2e)
- [ ] Implement API documentation (Swagger/OpenAPI)
- [ ] Add database transaction handling for critical operations
- [ ] Complete invoice and dispatch functionality
- [ ] Implement caching strategy for improved performance
- [ ] Add request rate limiting
- [ ] Database indexing optimization
- [ ] Export functionality (Excel, PDF reports)
- [ ] Audit logging for critical operations
- [ ] Real-time notifications

## Support

For issues, questions, or contributions, please open an issue in the GitHub repository.
