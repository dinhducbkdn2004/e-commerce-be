import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  messageVi: string;
  data?: T;
  error?: string;
  timestamp: string;
  path?: string;
}

export class ResponseHelper {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Operation successful',
    messageVi: string = 'Thao tác thành công',
    statusCode: number = 200
  ) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      messageVi,
      data,
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully',
    messageVi: string = 'Tạo mới thành công'
  ) {
    return this.success(res, data, message, messageVi, 201);
  }

  static error(
    res: Response,
    message: string = 'An error occurred',
    messageVi: string = 'Đã xảy ra lỗi',
    statusCode: number = 500,
    error?: string
  ) {
    const response: ApiResponse = {
      success: false,
      message,
      messageVi,
      error,
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(response);
  }

  static badRequest(
    res: Response,
    message: string = 'Invalid request data',
    messageVi: string = 'Dữ liệu không hợp lệ',
    error?: string
  ) {
    return this.error(res, message, messageVi, 400, error);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access',
    messageVi: string = 'Truy cập không được phép'
  ) {
    return this.error(res, message, messageVi, 401);
  }

  static forbidden(
    res: Response,
    message: string = 'Access forbidden',
    messageVi: string = 'Không có quyền truy cập'
  ) {
    return this.error(res, message, messageVi, 403);
  }

  static notFound(
    res: Response,
    message: string = 'Resource not found',
    messageVi: string = 'Không tìm thấy dữ liệu'
  ) {
    return this.error(res, message, messageVi, 404);
  }

  static conflict(
    res: Response,
    message: string = 'Resource already exists',
    messageVi: string = 'Dữ liệu đã tồn tại'
  ) {
    return this.error(res, message, messageVi, 409);
  }
}

// Messages cho các thao tác thường dùng
export const Messages = {
  AUTH: {
    REGISTER_SUCCESS: {
      en: 'Registration successful. Please verify your email.',
      vi: 'Đăng ký thành công. Vui lòng xác thực email của bạn.'
    },
    LOGIN_SUCCESS: {
      en: 'Login successful. Welcome back!',
      vi: 'Đăng nhập thành công. Chào mừng bạn trở lại!'
    },
    LOGOUT_SUCCESS: {
      en: 'Logout successful. See you again!',
      vi: 'Đăng xuất thành công. Hẹn gặp lại bạn!'
    },
    GOOGLE_AUTH_SUCCESS: {
      en: 'Google authentication successful',
      vi: 'Đăng nhập Google thành công'
    },
    TOKEN_REFRESH_SUCCESS: {
      en: 'Token refreshed successfully',
      vi: 'Làm mới token thành công'
    },
    EMAIL_VERIFIED: {
      en: 'Email verified successfully',
      vi: 'Xác thực email thành công'
    },
    PASSWORD_RESET_SENT: {
      en: 'Password reset email sent',
      vi: 'Email đặt lại mật khẩu đã được gửi'
    },
    PASSWORD_RESET_SUCCESS: {
      en: 'Password reset successfully',
      vi: 'Đặt lại mật khẩu thành công'
    },
    INVALID_CREDENTIALS: {
      en: 'Invalid email or password',
      vi: 'Email hoặc mật khẩu không đúng'
    },
    EMAIL_EXISTS: {
      en: 'Email already exists',
      vi: 'Email đã tồn tại'
    },
    ACCOUNT_LOCKED: {
      en: 'Account locked due to too many failed attempts',
      vi: 'Tài khoản bị khóa do đăng nhập sai quá nhiều lần'
    }
  },
  USER: {
    PROFILE_UPDATED: {
      en: 'Profile updated successfully',
      vi: 'Cập nhật hồ sơ thành công'
    },
    USER_UPDATED: {
      en: 'User updated successfully',
      vi: 'Cập nhật người dùng thành công'
    },
    USER_DELETED: {
      en: 'User deleted successfully',
      vi: 'Xóa người dùng thành công'
    },
    USER_NOT_FOUND: {
      en: 'User not found',
      vi: 'Không tìm thấy người dùng'
    },
    USERS_RETRIEVED: {
      en: 'Users retrieved successfully',
      vi: 'Lấy danh sách người dùng thành công'
    },
    PROFILE_RETRIEVED: {
      en: 'Profile retrieved successfully',
      vi: 'Lấy thông tin hồ sơ thành công'
    }
  },
  COMMON: {
    SUCCESS: {
      en: 'Operation successful',
      vi: 'Thao tác thành công'
    },
    ERROR: {
      en: 'An error occurred',
      vi: 'Đã xảy ra lỗi'
    },
    VALIDATION_ERROR: {
      en: 'Invalid request data',
      vi: 'Dữ liệu không hợp lệ'
    },
    UNAUTHORIZED: {
      en: 'Unauthorized access',
      vi: 'Truy cập không được phép'
    },
    FORBIDDEN: {
      en: 'Access forbidden',
      vi: 'Không có quyền truy cập'
    },
    NOT_FOUND: {
      en: 'Resource not found',
      vi: 'Không tìm thấy dữ liệu'
    }
  }
}; 