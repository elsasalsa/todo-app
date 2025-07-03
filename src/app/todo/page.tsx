'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Menu, MenuItem, Divider } from '@mui/material';
import { Cancel, CheckCircle, Search } from '@mui/icons-material';
import {
  getTodos,
  createTodo,
  markTodo,
  deleteTodoById,
} from '@/lib/api';

interface Todo {
  id: string;
  item: string;
  isDone: boolean;
}

interface DecodedToken {
  id: string;
  fullName: string;
  email: string;
  role: string;
  iat: number;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [token, setToken] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };


  useEffect(() => {
    setIsClient(true);
    const fetchTodos = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
          setToken(savedToken);

          const decoded: DecodedToken = jwtDecode(savedToken);
          setUser(decoded);

          const data = await getTodos(savedToken, 1, 5);
          setTodos(data?.entries || []);
        }
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    };
    fetchTodos();
  }, []);

  if (!isClient) return null;

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      await createTodo(input, token);
      setInput('');
      const data = await getTodos(token, 1, 5);
      setTodos(data?.entries || []);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const toggleDone = async (id: string, isDone: boolean) => {
    try {
      await markTodo(id, isDone ? 'UNDONE' : 'DONE', token);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
        )
      );
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodoById(id, token);
      const data = await getTodos(token, 1, 5);
      setTodos(data?.entries || []);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const deleteSelected = async () => {
    try {
      const doneTodos = todos.filter((todo) => todo.isDone);
      await Promise.all(doneTodos.map((todo) => deleteTodoById(todo.id, token)));
      const data = await getTodos(token, 1, 5);
      setTodos(data?.entries || []);
    } catch (error) {
      console.error('Failed to delete selected todos:', error);
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="#f8f9fb" fontFamily="sans-serif">
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#fff', color: '#000', borderBottom: '1px solid #ddd' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton>
            <Search />
          </IconButton>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontWeight={500}>{user?.fullName || 'User'}</Typography>
            <Box
              onClick={handleClick}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: '#d0d5dd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Typography fontSize={16} fontWeight={700}>
                {user?.fullName?.charAt(0) || ''}
              </Typography>
            </Box>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box px={2} py={2} display="flex" flexDirection="column" alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: '#d0d5dd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                }}
              >
                <Typography fontSize={18} fontWeight={700}>
                  {user?.fullName?.charAt(0) || ''}
                </Typography>
              </Box>
              <Typography fontWeight={600}>{user?.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />

            <MenuItem
              onClick={handleLogout}
              sx={{
                justifyContent: 'center',
                fontWeight: 500,
              }}
            >
              Logout
            </MenuItem>
          </Menu>

        </Toolbar>
      </AppBar>

      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={6} px={2}>
        <Typography variant="h5" fontWeight={700} color="#2a3c65" mb={2}>
          To Do
        </Typography>

        <Paper
          elevation={2}
          sx={{
            width: '100%',
            maxWidth: 500,
            p: 3,
            borderRadius: 3,
            backgroundColor: '#fff',
          }}
        >
          <Box display="flex" gap={1.5} mb={2} alignItems="flex-end">
            <TextField
              label="Add a new task"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              fullWidth
              variant="standard"
              InputProps={{ style: { fontWeight: 500 } }}
            />
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#0d6efd',
                textTransform: 'none',
                minWidth: 100,
                fontSize: '0.75rem',
                fontWeight: 500,
                height: '30px',
                lineHeight: '1',
              }}
              onClick={handleAdd}
            >
              Add Todo
            </Button>
          </Box>

          <Stack spacing={1.5}>
            {todos.map((todo) => (
              <Box
                key={todo.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #ddd"
                pb={0.5}
              >
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={todo.isDone}
                    onChange={() => toggleDone(todo.id, todo.isDone)}
                    size="small"
                  />
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      textDecoration: todo.isDone ? 'line-through' : 'none',
                      color: todo.isDone ? 'gray' : '#000',
                    }}
                  >
                    {todo.item}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleDelete(todo.id)} size="small">
                  {todo.isDone ? (
                    <CheckCircle sx={{ color: 'green', fontSize: 20 }} />
                  ) : (
                    <Cancel sx={{ color: 'red', fontSize: 20 }} />
                  )}
                </IconButton>
              </Box>
            ))}
          </Stack>

          <Box mt={3}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ff4d4f',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                px: 2,
                py: 0.5,
                '&:hover': { backgroundColor: '#ff7875' },
              }}
              onClick={deleteSelected}
            >
              Delete Selected
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
