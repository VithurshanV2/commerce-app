export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role: string;
}

export interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  roleId: number;
}
