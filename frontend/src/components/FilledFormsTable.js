import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FilledFormsTable = ({ filledForms }) => (
    <Card className="mb-3">
        <Card.Header>Filled Forms</Card.Header>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>User</th>
                    <th>Answers</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {filledForms.map((form) => (
                    <tr key={form.id}>
                        <td>{form.user}</td>
                        <td>{form.answers.join(', ')}</td>
                        <td>
                            <Link to={`/edit-page/${form.id}`}>
                                <Button variant="outline-primary" size="sm">
                                    Edit
                                </Button>
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </Card>
);

export default FilledFormsTable;
