import axios from 'axios';

const API_BASE_URL = 'https://fe-test-api.nwappservice.com';

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Type Definitions ---
interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'USER';
  };
}

interface Todo {
  id: string;
  item: string;
  isDone: boolean;
}

interface TodoResponse {
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
): Promise<any> => {
  try {
    const response = await instance.post('/register', {
      fullname: fullName,
      email,
      password,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response;
    }
    throw new Error('Registration failed');
  }
};

export const verifyToken = async (token: string): Promise<any> => {
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
  searchFilters?: Record<string, string>
): Promise<TodoResponse> => {
  const response = await instance.get('/todos', {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page,
      rows,
      orderKey: 'createdAt',
      orderRule: 'desc',
      ...(searchFilters && { searchFilters: JSON.stringify(searchFilters) }),
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
): Promise<any> => {
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
): Promise<any> => {
  const res = await instance.delete(`/todos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};