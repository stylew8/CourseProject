import React from 'react';
import { Table, Button } from 'react-bootstrap';

const AdminPage = () => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Blocked' }
    ];

    return (
        <div>
            <h1>Admin Panel</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2">Block</Button>
                                <Button variant="danger" size="sm">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminPage;