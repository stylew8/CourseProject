import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FormList = ({ forms }) => {
    return (
        <ListGroup>
            {forms.map(form => (
                <ListGroup.Item
                    key={form.id}
                    className="d-flex justify-content-between align-items-center"
                >
                    <div>
                        <strong>{form.user}</strong> - {form.date}
                    </div>
                    {/* Ссылка на страницу редактирования формы с передачей id */}
                    <Link to={`/edit-page/${form.id}`}>
                        <Button variant="outline-primary" size="sm">
                            Edit
                        </Button>
                    </Link>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default FormList;
