import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
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
                    <Link to={`/edit-form/${form.id}`} state={{ isReadOnly: true }}>
                        <Button variant="outline-primary" size="sm">
                            View
                        </Button>
                    </Link>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default FormList;
