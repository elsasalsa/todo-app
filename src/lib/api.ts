import axios from 'axios';

const API_BASE_URL = 'https://fe-test-api.nwappservice.com';

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'USER';
  };
}

export interface Todo {
  id: string;
  item: string;
  isDone: boolean;
  userId: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface TodoResponse {
  entries: Todo[];
  page: number;
  totalData: number;
  totalPage: number;
}

// --- API Functions ---

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await instance.post('/login', {
    email,
    password,
  });
  return response.data.content;
};

export const register = async (
  fullName: string,
  email: string,
  password: string
): Promise<{ message: string }> => {
  try {
    const response = await instance.post('/register', {
      fullName,
      email,
      password,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw new Error('Registration failed');
  }
};

export const verifyToken = async (token: string): Promise<{ valid: boolean }> => {
  try {
    const response = await instance.post('/verify-token', { token });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Token invalid');
    }
    throw new Error('Token invalid');
  }
};

export const getTodos = async (
  token: string,
  page: number,
  rows: number,
  searchFilters?: Record<string, string>,
  filters?: Record<string, any>
): Promise<TodoResponse> => {
  const response = await instance.get('/todos', {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page,
      rows,
      orderKey: 'createdAt',
      orderRule: 'desc',
      ...(searchFilters && { searchFilters: JSON.stringify(searchFilters) }),
      ...(filters && { filters: JSON.stringify(filters) }),
    },
  });

  return response.data.content;
};

export const createTodo = async (
  item: string,
  token: string
): Promise<Todo> => {
  const res = await instance.post(
    '/todos',
    { item },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.content;
};

export const markTodo = async (
  id: string,
  action: 'DONE' | 'UNDONE',
  token: string
): Promise<{ message: string }> => {
  const res = await instance.put(
    `/todos/${id}/mark`,
    { action },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteTodoById = async (
  id: string,
  token: string
): Promise<{ message: string }> => {
  const res = await instance.delete(`/todos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
