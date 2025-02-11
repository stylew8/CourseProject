import React from 'react';
import { Card, Button } from 'react-bootstrap';

const TemplateCard = ({ template }) => (
    <Card className="mb-3">
        <Card.Body>
            <Card.Title>{template.title}</Card.Title>
            <Card.Text>{template.description}</Card.Text>
            <Button variant="primary" href={`/template/${template.id}`}>View Template</Button>
        </Card.Body>
    </Card>
);

export default TemplateCard;