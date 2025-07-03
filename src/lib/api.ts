import axios from 'axios';

const API_BASE_URL = 'https://fe-test-api.nwappservice.com';

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===================== AUTH =====================

export const login = async (email: string, password: string) => {
  const response = await instance.post('/login', {
    email,
    password,
  });
  return response.data.content;
};

export const register = async (fullName: string, email: string, password: string) => {
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

export const verifyToken = async (token: string) => {
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

// ===================== TODO =====================

export const getTodos = async (token: string, page: number, rows: number) => {
  const response = await instance.get('/todos', {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page,
      rows,
      orderKey: 'createdAt',
      orderRule: 'desc',
    },
  });

  return response.data.content;
};

export const createTodo = async (item: string, token: string) => {
  const res = await instance.post(
    '/todos',
    { item },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const { id, item: newItem, isDone } = res.data.content;
  return { id, item: newItem, isDone };
};

export const markTodo = async (id: string, action: 'DONE' | 'UNDONE', token: string) => {
  const res = await instance.put(
    `/todos/${id}/mark`,
    { action },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteTodoById = async (id: string, token: string) => {
  const res = await instance.delete(`/todos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
