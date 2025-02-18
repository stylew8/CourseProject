import React from 'react';
import { Card } from 'react-bootstrap';

const GeneralSettings = ({ template }) => (
    <Card className="mb-3">
        <Card.Header>General Settings</Card.Header>
        <Card.Body>
            <p>
                <strong>Title:</strong> {template.title}
            </p>
            <p>
                <strong>Description:</strong> {template.description}
            </p>
        </Card.Body>
    </Card>
);

export default GeneralSettings;
