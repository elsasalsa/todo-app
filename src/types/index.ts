export interface DecodedToken {
  id: string;
  fullName: string;
  email: string;
  role: string;
  iat: number;
}

export interface Todo {
  id: string;
  item: string;
  isDone: boolean;
}