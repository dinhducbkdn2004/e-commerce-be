# 🛍️ E-Commerce Backend API

Một REST API hiện đại cho hệ thống thương mại điện tử được xây dựng với **Domain-Driven Design** pattern, sử dụng Node.js, Express, TypeScript, và MongoDB.

## ✨ Tính năng chính

- 🏗️ **Domain-Driven Architecture** - Cấu trúc rõ ràng, dễ mở rộng
- 🔐 **Authentication & Authorization** - JWT, Google OAuth, Email verification
- 👤 **User Management** - Profile management, Admin functions
- 🌍 **Đa ngôn ngữ** - Response message tiếng Anh và tiếng Việt
- 📝 **API Documentation** - Swagger UI tích hợp
- 🛡️ **Security** - Helmet, CORS, Rate limiting, CSRF protection
- 📊 **Logging & Monitoring** - Winston logger, Morgan middleware
- 🔄 **Redis Caching** - Session management và caching
- ✅ **Validation** - Joi schema validation
- 🧪 **Testing** - Jest test framework

## 🎯 Cấu trúc dự án

```
src/
├── domains/                 # Domain-driven design
│   ├── auth/               # 🔐 Authentication domain
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.routes.ts
│   │   └── index.ts
│   └── user/               # 👤 User management domain
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.repository.ts
│       ├── user.routes.ts
│       └── index.ts
├── shared/                 # Shared utilities
│   ├── middlewares/        # Express middlewares
│   ├── utils/             # Helper utilities
│   ├── config/            # Configuration
│   ├── types/             # TypeScript types
│   └── validators/        # Joi schemas
├── models/                # MongoDB models
├── dtos/                  # Data transfer objects
├── docs/                  # API documentation
└── routes/               # Main route aggregator
```

## 🚀 Khởi động nhanh

### 📋 Yêu cầu hệ thống

- Node.js >= 16.x
- MongoDB >= 4.x
- Redis >= 6.x
- npm hoặc yarn

### ⚙️ Cài đặt

1. **Clone repository**

```bash
git clone <repository-url>
cd e-commerce-be
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Thiết lập environment variables**

```bash
cp .env.example .env
# Chỉnh sửa file .env với thông tin của bạn
```

4. **Khởi động Redis** (xem [REDIS_SETUP.md](./REDIS_SETUP.md))

5. **Chạy ứng dụng**

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### 🌐 API Endpoints

#### 🔐 Authentication (`/api/v1/auth`)

| Method | Endpoint           | Mô tả             | Response VI                                            |
| ------ | ------------------ | ----------------- | ------------------------------------------------------ |
| POST   | `/register`        | Đăng ký tài khoản | "Đăng ký thành công. Vui lòng xác thực email của bạn." |
| POST   | `/login`           | Đăng nhập         | "Đăng nhập thành công. Chào mừng bạn trở lại!"         |
| POST   | `/google`          | Đăng nhập Google  | "Đăng nhập Google thành công"                          |
| POST   | `/refresh-token`   | Làm mới token     | "Làm mới token thành công"                             |
| POST   | `/logout`          | Đăng xuất         | "Đăng xuất thành công. Hẹn gặp lại bạn!"               |
| POST   | `/verify-email`    | Xác thực email    | "Xác thực email thành công"                            |
| POST   | `/forgot-password` | Quên mật khẩu     | "Email đặt lại mật khẩu đã được gửi"                   |
| POST   | `/reset-password`  | Đặt lại mật khẩu  | "Đặt lại mật khẩu thành công"                          |

#### 👤 User Management (`/api/v1/users`)

| Method | Endpoint   | Mô tả                            | Response VI                           |
| ------ | ---------- | -------------------------------- | ------------------------------------- |
| GET    | `/profile` | Lấy thông tin cá nhân            | "Lấy thông tin hồ sơ thành công"      |
| PUT    | `/profile` | Cập nhật thông tin cá nhân       | "Cập nhật hồ sơ thành công"           |
| GET    | `/`        | Lấy danh sách người dùng (Admin) | "Lấy danh sách người dùng thành công" |
| GET    | `/:id`     | Lấy thông tin người dùng (Admin) | "Lấy thông tin hồ sơ thành công"      |
| PUT    | `/:id`     | Cập nhật người dùng (Admin)      | "Cập nhật người dùng thành công"      |
| DELETE | `/:id`     | Xóa người dùng (Admin)           | "Xóa người dùng thành công"           |

### 📊 API Response Format

Tất cả API đều trả về format chuẩn với message đa ngôn ngữ:

```json
{
  "success": true,
  "message": "Operation successful",
  "messageVi": "Thao tác thành công",
  "data": {
    // Response data here
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "An error occurred",
  "messageVi": "Đã xảy ra lỗi",
  "error": "Detailed error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📖 API Documentation

Truy cập Swagger UI tại: `http://localhost:3000/docs`

- 🔍 **Interactive testing** - Test API trực tiếp
- 📋 **Schema documentation** - Chi tiết request/response
- 🏷️ **Organized by domains** - Authentication, Users

## 🛡️ Security Features

- **JWT Authentication** - Access & refresh tokens
- **Password Security** - Bcrypt hashing, account locking
- **Rate Limiting** - Prevent brute force attacks
- **CORS Protection** - Cross-origin resource sharing
- **Helmet Security** - Security headers
- **CSRF Protection** - Cross-site request forgery
- **Input Validation** - Joi schema validation
- **SQL Injection Protection** - MongoDB ODM

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['user', 'admin'],
  isEmailVerified: Boolean,
  isActive: Boolean,
  googleId: String (optional),
  avatar: String (optional),
  phoneNumber: String (optional),
  refreshTokens: [RefreshToken],
  failedAttempts: Number,
  lockUntil: Date,
  // ... other fields
}
```

## 🧪 Testing

```bash
# Chạy tất cả tests
npm test

# Test với coverage
npm run test:coverage

# Test watch mode
npm run test:watch
```

## 🔧 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📝 Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build TypeScript to JavaScript
npm start            # Chạy production server
npm test             # Chạy tests
npm run lint         # Lint code
npm run format       # Format code với Prettier
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## 📚 Tài liệu kỹ thuật

### Architecture Principles

- **Domain-Driven Design** - Tách biệt logic theo domains
- **Clean Architecture** - Separation of concerns
- **SOLID Principles** - Maintainable và extensible code
- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic encapsulation

### Performance

- **Redis Caching** - Session và data caching
- **Database Indexing** - Optimized queries
- **Connection Pooling** - Efficient database connections
- **Compression** - Gzip response compression

### Monitoring & Logging

- **Winston Logger** - Structured logging
- **Morgan Middleware** - HTTP request logging
- **Error Tracking** - Comprehensive error handling
- **Performance Metrics** - Request timing và monitoring

## 🔗 Links

- [API Documentation](http://localhost:3000/docs) - Swagger UI
- [Health Check](http://localhost:3000/health) - API status
- [Redis Setup Guide](./REDIS_SETUP.md) - Redis configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using TypeScript, Express, MongoDB, và Redis**
