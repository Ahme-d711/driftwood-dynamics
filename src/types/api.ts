/**
 * Global API response and model types
 * Ensures type safety across the application
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'vendor' | 'super_admin';
  picture?: string;
  phone?: string;
  address?: string;
  gender?: 'male' | 'female' | null;
  isVerified: boolean;
  isActive: boolean;
  totalOrders?: number;
  walletBalance?: number;
}

export interface LoginCredentials {
  phone: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  gender?: 'male' | 'female';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
