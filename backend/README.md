# Backend for E-commerce Website

This backend serves as the foundation for an e-commerce platform, providing APIs for user authentication, product management, order processing, and more. Built with Express.js and MongoDB, it follows a modular structure for scalability and maintainability.

## Folder Structure

```
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── UsersController.js
│   │   ├── cartController.js
│   │   ├── commonController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── subcategoryController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── sessionIdGenerator.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   ├── cart.js
│   │   ├── category.js
│   │   ├── order.js
│   │   └── subcategory.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── subcategoryRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── usersRoutes.js
│   ├── tests/
│   │   ├── User.test.js
│   │   ├── UsersController.test.js
│   │   └── authController.test.js
│   ├── uploads/
│   └── utils/
│       ├── helper.js
│       └── routeFactory.js
```

### Key Files and Directories

- **server.js**: Entry point of the application.
- **config/db.js**: Database configuration for connecting to MongoDB.
- **controllers/**: Contains business logic for various features like authentication, product management, and orders.
- **middleware/**: Custom middleware such as authentication and session ID generation.
- **models/**: Mongoose schemas and models for MongoDB collections.
- **routes/**: API route definitions for different resources.
- **tests/**: Unit and integration tests for controllers and other modules.
- **uploads/**: Directory for storing uploaded files.
- **utils/**: Utility functions and helper methods.

## Features

- **User Authentication**: Sessions cookies, Sign up, login, and JWT-based authentication.
- **Product Management**: CRUD operations for products, categories, and subcategories.
- **Cart Management**: Add, update, and remove items from the cart.
- **Order Processing**: Place and track orders.
- **File Uploads**: Handle file uploads with Multer for images.
- **Payment Integration**: Process payments using Stripe and paypal.

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/naoufalHdr1/ecommerce-website-project
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: Start the server in development mode with nodemon.
- `npm test`: Run tests using Mocha and Chai.

## Dependencies

### Core Dependencies

- **bcrypt**: For hashing passwords.
- **cookie-parser**: Parse cookies in requests.
- **cors**: Enable Cross-Origin Resource Sharing.
- **dotenv**: Manage environment variables.
- **express**: Web framework.
- **jsonwebtoken**: Generate and verify JSON Web Tokens.
- **mongoose**: MongoDB object modeling.
- **multer**: Handle file uploads.
- **stripe**: Payment processing.

### Dev Dependencies

- **chai**: Assertion library for testing.
- **chai-http**: HTTP integration testing with Chai.
- **mocha**: Testing framework.
- **mongodb-memory-server**: In-memory MongoDB server for testing.
- **nodemon**: Automatically restart the server on file changes.

## API Endpoints

The backend follows a standardized structure for API endpoints across all models (except for authentication). The endpoints for each model are as follows:

### General Endpoints (`/api/<model>`)

- `GET /<model>`: Fetch all items.
- `GET /<model>/:id`: Fetch a specific item by ID.
- `POST /<model>`: Create a new item.
- `PUT /<model>/:id`: Update item information.
- `DELETE /<model>/:id`: Delete an item.

### Available Models

The following models have the endpoints listed above:

- Users (`/users`)
- Products (`/products`)
- Categories (`/categories`)
- Subcategories (`/subcategories`)
- Cart (`/cart`)
- Orders (`/orders`)

### Authentication Endpoints (`/auth`)

- `POST /register`: Register a new user.
- `POST /login`: Authenticate a user.
- `POST /logout`: Logout a user.
- `POST /forgot-password`: Generates a password reset token.
- `POST /reset-password`: Verifies the token and updates the password.

### Authentication

- `POST /register`: Register a new user.
- `POST /login`: Authenticate a user.
- `POST /logout`: Logout a user.
- `POST /forgot-password`: Generates a password reset token.
- `POST /reset-password`: Verifies the token and updates the password.

## Testing

Run tests with the following command:
```bash
npm test
```
Tests are located in the `tests/` directory and use Mocha, Chai, and chai-http.

## Contribution

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add feature-name'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
