'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Menu,
    MenuItem,
    Divider,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Fade from '@mui/material/Fade';
import { getTodos, Todo } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/types';

export default function AdminPage() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchKey, setSearchKey] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            router.replace('/auth/login');
            return;
        }

        try {
            const decoded: DecodedToken = jwtDecode(token);
            setUser(decoded);
            setIsClient(true);
            if (decoded.role !== 'ADMIN') {
                alert('Access denied. This page is for admin only.');
                router.replace('/todo/user');
            } else {
                setAuthorized(true);
            }
        } catch (err) {
            alert('Invalid token. Please login again.');
            console.error('Invalid token:', err);
            router.replace('/auth/login');
        }
    }, [router]);


    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
    };

    useEffect(() => {
        setIsClient(true);

        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded: DecodedToken = jwtDecode(token);
        setUser(decoded);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchTodos = async () => {
            try {
                setLoading(true);
                const filters: Record<string, string | number | boolean> = {};
                if (statusFilter) {
                    filters.isDone = statusFilter === 'Success';
                }

                const searchFilters =
                    searchKey !== ''
                        ? { item: searchKey, 'user.fullName': searchKey }
                        : undefined;

                const data = await getTodos(token, page, 5, searchFilters, filters);
                setTodos(data.entries);
                setTotalPages(data.totalPage);
            } catch (error) {
                console.error('Failed to fetch todos:', error);
            } finally {
                setLoading(false);
            }
        };


        fetchTodos();
    }, [page, statusFilter, searchKey]);


    const handleSearch = () => {
        setPage(1);
        setSearchKey(searchTerm.trim());
    };

    if (!isClient || !authorized) return null;

    return (
        <Box display="flex" height="100vh">
            {isSidebarOpen && (
                <Box
                    width="220px"
                    bgcolor="#f9fafb"
                    borderRight="1px solid #e5e7eb"
                    display="flex"
                    flexDirection="column"
                    p={2.5}
                    pr={2}
                    pl={3}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography fontWeight={700} fontSize={18} color="#4b5563">
                            Nodewave
                        </Typography>
                        <Button
                            size="small"
                            sx={{ minWidth: 0, color: '#4b5563' }}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            &#x276E;
                        </Button>
                    </Box>

                    <Button
                        variant="contained"
                        disableElevation
                        fullWidth
                        sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            color: '#4b5563',
                            fontWeight: 500,
                            backgroundColor: '#f3f4f6',
                            '&:hover': {
                                backgroundColor: '#e0e7ff',
                            },
                        }}
                        startIcon={<HomeRoundedIcon sx={{ color: '#4b5563' }} />}
                    >
                        To do
                    </Button>
                </Box>
            )}

            {/* Main Content */}
            <Box flex={1} bgcolor="#f9fafb">
                <Box
                    width="100%"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    bgcolor="#fff"
                    px={4}
                    py={2}
                    borderBottom="1px solid #e5e7eb"
                    position="sticky"
                    top={0}
                    zIndex={1000}
                >
                    {!isSidebarOpen ? (
                        <Button
                            size="small"
                            sx={{ color: '#6b7280', minWidth: 0 }}
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            &#x276F;
                        </Button>
                    ) : (
                        <Box />
                    )}

                    <Box display="flex" alignItems="center" gap={2} minWidth={0}>
                        <Typography
                            fontWeight={500}
                            color="#374151"
                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}
                        >
                            {user?.fullName || ''}
                        </Typography>
                        <Box
                            width={32}
                            height={32}
                            borderRadius="50%"
                            bgcolor="#f3f4f6"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography
                                fontWeight={600}
                                color="#374151"
                                sx={{ cursor: 'pointer' }}
                                onClick={handleAvatarClick}
                            >
                                {user?.fullName?.charAt(0) || ''}
                            </Typography>
                            <Menu
                                TransitionComponent={Fade}
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
                                            {user?.fullName?.charAt(0).toUpperCase() || ''}
                                        </Typography>
                                    </Box>
                                    <Typography fontWeight={600}>{user?.fullName}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {user?.email}
                                    </Typography>
                                </Box>
                                <Divider />
                                <MenuItem onClick={handleLogout} sx={{ justifyContent: 'center', fontWeight: 500 }}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Box>

                {/* Page Content */}
                <Box px={{ xs: 3, sm: 4 }} py={3} mt={1.5}>
                    <Typography variant="h4" fontWeight={600} mb={2.5}>
                        To Do
                    </Typography>

                    <Box
                        component={Paper}
                        elevation={3}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            backgroundColor: '#ffffff',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                            border: '1px solid #e2e8f0',
                            transition: '0.3s ease-in-out',
                            '&:hover': {
                                boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08)',
                            },
                        }}
                    >
                        <Box
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            flexWrap="wrap"
                            gap={1.5}
                            mb={2}
                            alignItems={{ xs: 'stretch', sm: 'flex-end' }}
                        >
                            <Box display="flex" alignItems="flex-end">
                                <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    size="small"
                                    label="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputLabelProps={{ sx: { fontSize: '0.88rem' } }}
                                    sx={{ maxWidth: { xs: '100%', sm: 150 } }}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                size="small"
                                sx={{
                                    px: 1.5,
                                    py: 0.3,
                                    fontSize: '0.85rem',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    height: '30px',
                                }}
                            >
                                Search
                            </Button>

                            <TextField
                                select
                                variant="standard"
                                size="small"
                                label="Filter by Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                sx={{
                                    minWidth: { xs: '100%', sm: 150 },
                                    ml: { xs: 0, sm: 2.5 },
                                }}
                                InputLabelProps={{ sx: { fontSize: '0.88rem' } }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Success">Success</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                            </TextField>
                        </Box>

                        <TableContainer sx={{ maxHeight: 275 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>To do</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                <Box py={3}>
                                                    <CircularProgress />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : todos.length > 0 ? (
                                        todos.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.user.fullName}</TableCell>
                                                <TableCell>{row.item}</TableCell>
                                                <TableCell>
                                                    <Box
                                                        px={2}
                                                        py={0.5}
                                                        borderRadius={8}
                                                        fontSize={12}
                                                        fontWeight={600}
                                                        display="inline-block"
                                                        color="#fff"
                                                        bgcolor={row.isDone ? '#22c55e' : '#f87171'}
                                                    >
                                                        {row.isDone ? 'Success' : 'Pending'}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                No data found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>

                            </Table>
                        </TableContainer>

                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, val) => setPage(val)}
                                shape="rounded"
                                size="small"
                                color="primary"
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
