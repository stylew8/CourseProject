import React, { useState, useEffect } from 'react';
import { Container, TextField, Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../api/axiosInstance';
import { Admin, User } from '../api/roles';

const actions = {
    setrole: 'setrole',
    block: 'block',
    unblock: 'unblock',
    delete: 'delete'
}

const ADMIN_USERS_ROUTE = '/admin/users';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState(actions.block);
    const [selectedRole, setSelectedRole] = useState(User);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get(ADMIN_USERS_ROUTE);
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
            const response = await axiosInstance.get(ADMIN_USERS_ROUTE);
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
            if (selectedAction === actions.setrole && !selectedRole) {
                setError('Please select a role');
                return;
            }

            const config = {
                data: { userIds: selectionModel }
            };

            switch (selectedAction) {
                case actions.block:
                    await axiosInstance.put(`${ADMIN_USERS_ROUTE}/${actions.block}`, { userIds: selectionModel });
                    break;
                case actions.unblock:
                    await axiosInstance.put(`${ADMIN_USERS_ROUTE}/${actions.unblock}`, { userIds: selectionModel });
                    break;
                case actions.setrole:
                    await axiosInstance.put(`${ADMIN_USERS_ROUTE}/${actions.setrole}`, {
                        userIds: selectionModel,
                        role: selectedRole.toUpperCase()
                    });
                    break;
                case actions.delete:
                    await axiosInstance.delete(`${ADMIN_USERS_ROUTE}`, config);
                    break;
                default:
                    throw new Error('Unknown action');
            }

            await refreshUsers();
            setSelectionModel([]);
        } catch (err) {
            console.error(err);
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
            (user.firstName && user.firstName.toLowerCase().includes(q)) ||
            (user.lastName && user.lastName.toLowerCase().includes(q)) ||
            (user.role && user.role.toLowerCase().includes(q))
        );
    });

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Admin Panel
            </Typography>
            <Box
                mb={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <TextField
                    label="Search users"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        backgroundColor: 'background.paper',
                        '& .MuiInputBase-input': {
                            color: 'text.primary'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'divider'
                        },
                        '& label': {
                            color: 'text.primary'
                        }
                    }}
                />
                <Button
                    variant="outlined"
                    onClick={handleOpenDialog}
                    disabled={selectionModel.length === 0}
                    sx={(theme) => ({
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                            borderColor:
                                theme.palette.mode === theme.palette.primary.main
                                    ? theme.palette.primary.light
                                    : theme.palette.primary.main,
                        },
                    })}
                >
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
                        sx={{
                            backgroundColor: 'background.paper',
                            color: 'text.primary',
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                            },
                        }}
                    />
                </div>
            )}

            <Dialog
                open={actionDialogOpen}
                onClose={handleCloseDialog}
                sx={{
                    '& .MuiDialog-paper': {
                        minWidth: 300
                    }
                }}
            >
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
                        <MenuItem value={actions.block}>Block</MenuItem>
                        <MenuItem value={actions.unblock}>Unblock</MenuItem>
                        <MenuItem value={actions.setrole}>Set Role</MenuItem>
                        <MenuItem value={actions.delete}>Delete</MenuItem>
                    </TextField>
                    {selectedAction === actions.setrole && (
                        <TextField
                            select
                            label="Role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            fullWidth
                            margin="dense"
                        >
                            <MenuItem key={User} value={User}>User</MenuItem>
                            <MenuItem key={Admin} value={Admin}>Admin</MenuItem>
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
