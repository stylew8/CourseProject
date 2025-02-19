import React, { useState, useEffect } from 'react';
import { Container, TextField, Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../api/axiosInstance';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState('block');
    const [selectedRole, setSelectedRole] = useState('User'); // Для действия setrole

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/admin/users');
                setUsers(response.data);
            } catch (err) {
                console.error(err);
                setError('Error fetching users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const refreshUsers = async () => {
        try {
            const response = await axiosInstance.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            console.error(err);
            setError('Error refreshing users');
        }
    };

    const handleOpenDialog = () => {
        if (selectionModel.length === 0) return;
        setActionDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setActionDialogOpen(false);
    };

    const handleApplyAction = async () => {
        try {
            // Добавляем проверку для действия setrole
            if (selectedAction === 'setrole' && !selectedRole) {
                setError('Please select a role');
                return;
            }

            // Формируем конфигурацию запроса
            const config = {
                data: { userIds: selectionModel }
            };

            switch (selectedAction) {
                case 'block':
                    await axiosInstance.put('/admin/users/block', { userIds: selectionModel });
                    break;
                case 'unblock':
                    await axiosInstance.put('/admin/users/unblock', { userIds: selectionModel });
                    break;
                case 'setrole':
                    await axiosInstance.put('/admin/users/setrole', {
                        userIds: selectionModel,
                        role: selectedRole.toUpperCase() // Приводим роль к нужному формату
                    });
                    break;
                case 'delete':
                    // Для DELETE-запросов данные передаем через config
                    await axiosInstance.delete('/admin/users', config);
                    break;
                default:
                    throw new Error('Unknown action');
            }

            await refreshUsers();
            setSelectionModel([]);
        } catch (err) {
            console.error(err);
            // Более информативное сообщение об ошибке
            setError(`Error applying action: ${err.response?.data?.message || err.message}`);
        } finally {
            setActionDialogOpen(false);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 300 },
        { field: 'firstName', headerName: 'First name', width: 150 },
        { field: 'lastName', headerName: 'Last name', width: 150 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'role', headerName: 'Role', width: 120 },
        { field: 'status', headerName: 'Status', width: 120 },
    ];

    const filteredUsers = users.filter(user => {
        const q = searchQuery.toLowerCase();
        return (
            user.id.toString().includes(q) ||
            (user.userName && user.userName.toLowerCase().includes(q)) ||
            (user.email && user.email.toLowerCase().includes(q)) ||
            (user.role && user.role.toLowerCase().includes(q))
        );
    });

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Admin Panel
            </Typography>
            <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <TextField
                    label="Search users"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outlined" onClick={handleOpenDialog} disabled={selectionModel.length === 0}>
                    Apply Action
                </Button>
            </Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">Error: {error}</Typography>
            ) : (
                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={filteredUsers}
                        columns={columns}
                        loading={loading}
                        checkboxSelection
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        rowSelectionModel={selectionModel}
                        onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                        getRowId={(row) => row.id}
                    />
                </div>
            )}

            <Dialog open={actionDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Apply Action</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Action"
                        value={selectedAction}
                        onChange={(e) => setSelectedAction(e.target.value)}
                        fullWidth
                        margin="dense"
                    >
                        <MenuItem value="block">Block</MenuItem>
                        <MenuItem value="unblock">Unblock</MenuItem>
                        <MenuItem value="setrole">Set Role</MenuItem>
                        <MenuItem value="delete">Delete</MenuItem>
                    </TextField>
                    {selectedAction === 'setrole' && (
                        <TextField
                            select // Добавляем select для выбора из доступных ролей
                            label="Role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            fullWidth
                            margin="dense"
                        >
                            <MenuItem key={"User"} value="User">User</MenuItem>
                            <MenuItem key={"Admin"} value="Admin">Admin</MenuItem>
                        </TextField>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleApplyAction}>Apply</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminPage;
