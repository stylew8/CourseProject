import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FormList = ({ forms }) => {
    return (
        <ListGroup>
            {forms.map((form, index) => (
                <ListGroup.Item
                    key={`${form.id}-${index}`}
                    className="d-flex justify-content-between align-items-center"
                >
                    <div>
                        <strong>{form.templateName}</strong> - {new Date(form.submittedAt).toLocaleDateString()}
                    </div>
                    <Link to={`/edit-form/${form.id}`}>
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
