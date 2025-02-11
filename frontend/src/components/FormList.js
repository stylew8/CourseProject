import React from 'react';
import { ListGroup } from 'react-bootstrap';

const FormList = ({ forms }) => (
    <ListGroup>
        {forms.map((form, index) => (
            <ListGroup.Item key={index} action href={`/form/${form.id}`}>
                Filled by: {form.user} on {new Date(form.date).toLocaleDateString()}
            </ListGroup.Item>
        ))}
    </ListGroup>
);

export default FormList;